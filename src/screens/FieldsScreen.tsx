import React, { useState, useEffect, useRef, createRef, Fragment } from 'react'
import MapView from 'react-native-maps';
import { Polygon2 } from '../components/v2/Polygonv2';

import { updateParcellesList } from '../store/actions/metaActions'
import { SafeAreaView } from 'react-navigation';
import { Dimensions, StyleSheet, View, Text, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Left, Right, Body, Title, Header, Button, Icon, Content, Picker, Container, Spinner, Footer } from 'native-base';

import COLORS from '../colors';
import i18n from 'i18n-js';

import { updateField, getAllCultures, getFieldsReturnType, getFields_v2 } from '../api/hygoApi';

import { Amplitude, AMPLITUDE_EVENTS } from '../amplitude'
import { fieldType } from '../types/field.types';
const { fieldsScreen: ampEvent } = AMPLITUDE_EVENTS

import ParcelSVG from '../components/v2/ParcelSVG';
import hygoStyles from '../styles';
import { SnackbarContext } from '../context/snackbar.context';

interface ParcelListProps {
	title: string,
	items: Array<fieldType>,
	onPress: ((id: number) => any),
	active: boolean
}

export const ParcelList = ({ title, items, onPress, active }: ParcelListProps) => {
	const [opened, setOpened] = useState(false)
	return (
		<View style={ListStyles.container}>
			<View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
				<TouchableOpacity onPress={() => setOpened(!opened)}>
					<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#D1CFCF' }}>
						<Text style={[ListStyles.cardTitle, !active && ListStyles.hidden]}>{title}</Text>
						<Icon
							type='AntDesign'
							name={opened ? 'down' : 'right'}
							style={[{ fontSize: 16, color: COLORS.DARK_BLUE, padding: 10, paddingRight: 20 }, !active && ListStyles.hidden]}
						/>
					</View>
				</TouchableOpacity>
				{opened &&
					<View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginTop: 10, paddingLeft: 20, paddingRight: 20 }}>
						{items.map((item, k) => (
							<TouchableOpacity
								key={k}
								onPress={() => { active && onPress(item.id) }}
								style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 }}
								disabled={!active}
							>
								<Icon
									type='FontAwesome'
									name={'edit'}
									style={[{ fontSize: 16, color: COLORS.DARK_BLUE, paddingTop: 3 }, !active && ListStyles.hidden]}
								/>
								<View style={{ flex: 2, paddingLeft: 10 }}>
									<Text style={[hygoStyles.textBold, { color: '#888888' }, !active && ListStyles.hidden, { paddingBottom: 0 }]}>
										{(item.name == 'unknown' ? (
											`Parcelle ${item.id}`
										) : (
											`${item.id} - ${item.name}`
										))}
									</Text>
									{item.nomCommune &&
										<Text style={[hygoStyles.text, !active && ListStyles.hidden]}>
											{item.nomCommune}
										</Text>}
								</View>

								<View style={{ flex: 1 }}>
									{item.svg && <ParcelSVG path={item.svg} height={30} width={30} />}
								</View>
								<Text style={[hygoStyles.text, { textAlign: 'right' }, !active && ListStyles.hidden]}>
									{(item.area / 10000).toFixed(1)}ha
                                </Text>
							</TouchableOpacity>
						))}
					</View>
				}
			</View>
		</View>

	)
}

const FieldsScreen = ({ navigation, parcelles }) => {
	const [selectedFieldIdx, setSelectedFieldIdx] = useState<number>(null)
	const [cultureList, setCultureList] = useState<Array<any>>([])
	const [fields, setFields] = useState<Array<fieldType>>([])
	const [isReady, setIsReady] = useState<boolean>(false)
	const [editMode, setEditMode] = useState<boolean>(false)
	const [cultureNames, setCulturesNames] = useState<Array<string>>([])
	const snackbar = React.useContext(SnackbarContext)

	const loadFields = async () => {
		setIsReady(false)
		const { fields: fld }: getFieldsReturnType = await getFields_v2()
		if (!!fld) {
			setFields(fld)
			// filtering out useless cultures like "Jachère", "Bande Tampon",...
			const fld_filter = fld.filter((f) => {
				const c = cultureList.find((c) => c.id == f.culture.id)
				// if (!c)
				// 	console.log("======",f)
				return !c ? false : !c.hidden
			})
			let nm = fld_filter.map((f) => f.culture.name).sort((a, b) => a.localeCompare(b))
			setCulturesNames([... new Set(nm)])     //delete duplicate
		}
		setIsReady(true)
	}

	useEffect(() => {
		// console.log("Amplitude : ", ampEvent.render)
		Amplitude.logEventWithProperties(ampEvent.render, {
			timestamp: Date.now()
		})
	}, [])

	useEffect(() => {
		// Init fields and retrieve culture_names
		loadFields()
	}, [cultureList])

	useEffect(() => {
		const getCultureList = async () => {
			const l = await getAllCultures()
			setCultureList(l)
		}
		getCultureList()
	}, [])

	const setField = async (newField) => {
		try {
			setEditMode(false)
			setSelectedFieldIdx(null)
			await updateField(newField)
			loadFields()
			snackbar.showSnackbar("Modification réussie", "OK")
			//updateParcellesList(fields)
		} catch (error) {
			snackbar.showSnackbar("Modification échouée", "ERROR")
		}
	}
	const updateList = (index) => {
		setSelectedFieldIdx(index)
	}
	useEffect(() => {
		if (selectedFieldIdx !== null) {
			setEditMode(true)
		}
	}, [selectedFieldIdx])
	return (
		<SafeAreaView style={styles.statusbar} forceInset={{ top: 'always' }}>
			<StatusBar translucent backgroundColor="transparent" />
			<Container contentContainerStyle={[styles.container, StyleSheet.absoluteFill]}>
				<Header style={styles.header} androidStatusBarColor={COLORS.CYAN} iosBarStyle="light-content">
					<Left style={{ flex: 1 }}>
					</Left>
					<Body style={styles.headerBody}>
						<Title style={styles.headerTitle}>Mes Parcelles</Title>
					</Body>
					<Right style={{ flex: 1 }}>
						<Button transparent onPress={() => navigation.navigate("main_v2")}>
							<Icon type='AntDesign' name='close' style={{ color: '#fff' }} />
						</Button>
					</Right>
				</Header>
				<Content style={styles.content}>
					<View style={{height: 30}}></View>
					{!editMode ? (
						<View>
							{fields.length > 0 && cultureNames.length > 0 ? (
								<View>
								{ !isReady && <Spinner />}
								{cultureNames.map((n, k) => {
									const items: Array<fieldType> = fields.filter((f) => f.culture.name == n)
									return (
										items.length > 0 &&
										<ParcelList
											key={k}
											title={n}
											items={items.sort((it1, it2) => it1.id - it2.id)}
											onPress={updateList}
											active={true}
										/>
									)
								})}
								</View>
							) : (<Spinner />)
							}
						</View>
					) : (
						<EditField
							cultureList={cultureList}
							fields={fields}
							selectedFieldIndex={selectedFieldIdx}
							parcelles={parcelles}
							onCancel={() => {
								setEditMode(false)
								setSelectedFieldIdx(null)
							}}
							onConfirm={setField}
						/>
					)}
				</Content>
			</Container>

		</SafeAreaView>
	);
}

const EditField = ({cultureList, fields, selectedFieldIndex, parcelles, onCancel, onConfirm }) => {

	const [name, setName] = useState<string>(null)
	const [cultureId, setCultureId] = useState<string>(null)
	const field = fields.find((f) => f.id == selectedFieldIndex)
	const confirmEdit = async () => {
		const newField = { id: field.id, name, cultureId: cultureId }
		onConfirm(newField)
	}
	const reset = () => {
		setName(field.name)
		setCultureId(field.culture.id)
	}
	useEffect(() => {
		if (!!field) {
			reset()
			setName(field.name)
			setCultureId(field.culture.id)
		}
	}, [field])

	const getRegion = () => {
		const bbox = field.features.bbox
		let center = {
			longitude: (bbox[2] + bbox[0]) / 2,
			latitude: (bbox[3] + bbox[1]) / 2
		}

		let r = {
			...center,
			longitudeDelta: Math.max(0.0222, Math.abs(bbox[2] - bbox[0])),
			latitudeDelta: Math.max(0.0121, Math.abs(bbox[3] - bbox[1])),
		}
		return r
	}
	const region = getRegion()

	const polygons = useRef([]);
	if (polygons.current.length !== parcelles.length) {
		polygons.current = Array(parcelles.length).fill().map((_, i) => polygons.current[i] || createRef())
	}

	return (
		field &&
		<View>
			<View style={[styles.hygocard, { backgroundColor: '#fff' }]}>
				<View style={styles.editButtons}>
					<Button transparent onPress={onCancel}>
						<Icon type='AntDesign' name='arrowleft' style={{ color: '#000', marginLeft: 0 }} />
					</Button>

					<Button transparent onPress={confirmEdit}>
						<Icon type='AntDesign' name='check' style={{ color: '#000', marginRight: 0 }} />
					</Button>
				</View>

				<View style={{paddingLeft: 10}}>
					<TextInput
						onChangeText={text => setName(text)}
						value={name}
						style={[{ textAlign: 'left' }, styles.overlayText]}
					/>
				</View>
				<View style={{ display: 'flex', flexDirection: 'row' }}>
					<Picker
						mode='dropdown'
						itemTextStyle={styles.overlayText}
						textStyle={[styles.overlayText, { paddingLeft: 0 }]}
						selectedValue={cultureId}
						onValueChange={(v, i) => {
							setCultureId(v)
						}}
					>
						{cultureList.slice().sort(
							(a, b) => (b.name >= a.name) ? -1 : 1
						).map(
							(v, i) => <Picker.Item label={i18n.t(`cultures.${v.name.trim()}`)} value={v.id} key={i} />
						)}
					</Picker>

				</View>
			</View>
			<View style={styles.mapview}>
				<MapView
					provider="google"
					mapType="hybrid"
					initialRegion={region}
					style={styles.map}
					loadingEnabled={true}
				>

					{parcelles.fields.map((field, idx) => {
						return (
							<Polygon2
								key={field.id}
								strokeWidth={selectedFieldIndex === field.id ? 4 : 1}
								strokeColor={selectedFieldIndex === field.id ? '#fff' : COLORS.DARK_GREEN}
								fillColor={selectedFieldIndex === field.id ? COLORS.CYAN : COLORS.DEFAULT_FIELD_MY}
								_ref={ref => (polygons.current[idx] = ref)}
								onLayout={() => polygons.current[idx].setNativeProps({
									fillColor: selectedFieldIndex === field.id ? COLORS.CYAN : COLORS.DEFAULT_FIELD_MY
								})}

								tappable={true}
								onPress={() => {}}
								coordinates={field.features.coordinates[0].map((coordinate) => {
									return {
										latitude: coordinate[1],
										longitude: coordinate[0],
									}
								})}
							/>
						);
					})}
				</MapView>
			</View>
		</View>
	)
}


const styles = StyleSheet.create({
	statusbar: {
		flex: 1,
		display: 'flex',
		backgroundColor: Platform.OS === 'ios' ? 'black' : COLORS.CYAN,
	},
	container: {
		backgroundColor: COLORS.BEIGE,
		flexDirection: "column",
		display: 'flex',
	},
	header: {
		backgroundColor: COLORS.CYAN,
		paddingTop: 0
	},
	headerBody: {
		flex: 4,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerTitle: {
		color: '#fff',
		fontFamily: 'nunito-regular',
		fontSize: 24
	},
	headerSubtitle: {
		color: '#fff',
		fontFamily: 'nunito-regular',
		fontSize: 20,
	},
	title: {
		paddingTop: 20,
		paddingLeft: 10,
		textTransform: 'uppercase',
		fontFamily: 'nunito-bold',
		fontSize: 16,
		color: COLORS.CYAN
	},
	content: {
		backgroundColor: COLORS.BEIGE
	},
	footer: {
		backgroundColor: COLORS.BEIGE
	},
	map: {
		justifyContent: "center",
		flexDirection: 'column',
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').width,
	},
	mapview: {
		justifyContent: 'center',
		flex: 1, display: 'flex',
		paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: 20,
		alignItems: 'center',
		backgroundColor: COLORS.BEIGE
	},
	overlay: {
		paddingHorizontal: 20,
		paddingVertical: 15,
		backgroundColor: '#fff',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: .2,
		shadowRadius: 3,
		elevation: 3,
		width: Dimensions.get('window').width - 30,
		top: -25,
	},
	overlayText: {
		...hygoStyles.text,
		fontSize: 16,
		fontFamily: 'nunito-regular',
		color: '#000',
	},
	// content: {
	// 	backgroundColor: COLORS.BEIGE
	// },
	hygocard: {
		borderTopRightRadius: 20,
		shadowOffset: { width: 0, height: 2 },
		shadowColor: '#000000',
		shadowRadius: 2,
		shadowOpacity: .2,
		padding: 20,
		paddingTop: 5,
		display: 'flex',
		elevation: 2,
		marginBottom: 10
	},
	editButtons: {
		display: 'flex',
		justifyContent: 'space-between',
		flexDirection: 'row'
	}
});

const buttonStyle = StyleSheet.create({
	inner: {
		backgroundColor: '#AFAEAE'
	}
});

const ListStyles = StyleSheet.create({
	container: {
		borderTopRightRadius: 20,
		backgroundColor: '#fff',
		shadowOffset: { width: 0, height: 2 },
		shadowColor: '#000000',
		shadowRadius: 2,
		shadowOpacity: .2,
		display: 'flex',
		elevation: 2,
		marginBottom: 10,
	},
	cardTitle: {
		...hygoStyles.h1,
		flex: 1,
		padding: 10,
		paddingLeft: 20
	},
	hidden: {
		color: '#DDD'
	}
})


const mapStateToProps = (state) => ({
	parcelles: state.metadata.parcelles,
	// cultures: state.metadata.cultures,
});

// const mapDispatchToProps = (dispatch, props) => ({
// 	updateParcellesList: (l) => dispatch(updateParcellesList(l)),
// })

export default connect(mapStateToProps)(FieldsScreen);
