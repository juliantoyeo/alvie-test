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

import { getFields, updateField, updateField_v2, getAllCultures, getFieldsReturnType, getFields_v2 } from '../api/hygoApi';

import { Amplitude, AMPLITUDE_EVENTS } from '../amplitude'
import { fieldType } from '../types/field.types';
const { fieldsScreen: ampEvent } = AMPLITUDE_EVENTS

import ParcelSVG from '../components/v2/ParcelSVG';
import hygoStyles from '../styles';

const Card = ({ field, cultureList, onUpdate }) => {
	const [editMode, setEditMode] = useState<boolean>(false)
	const [name, setName] = useState<string>(field.name)
	const [cultureId, setCultureId] = useState<string>(field.culture_id)

	const confirmEdit = async () => {
		const newField = { id: field.id, name, cultureId: cultureId }
		await onUpdate(newField)
		setEditMode(!editMode)
	}
	const cancelEdit = () => {
		reset()
		setEditMode(!editMode)
	}
	const reset = () => {
		setName(field.name)
		setCultureId(field.culture_id)
	}
	useEffect(() => {
		reset()
	}, [field])

	return (
		<View>
			{editMode ? (
				//===========Card in Edit Mode==================//
				<View style={[styles.hygocard, { backgroundColor: '#fff' }]}>
					<View style={styles.editButtons}>
						<Button transparent onPress={cancelEdit}>
							<Icon type='AntDesign' name='arrowleft' style={{ color: '#000', marginLeft: 0 }} />
						</Button>

						<Button transparent onPress={confirmEdit}>
							<Icon type='AntDesign' name='check' style={{ color: '#000', marginRight: 0 }} />
						</Button>
					</View>

					<View style={{ display: 'flex', flexDirection: 'row' }}>
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
							// iosIcon={<Icon name="arrow-down" />}
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
			) : (
				//============== Card in View Mode =======================//
				<View style={[styles.hygocard, { backgroundColor: '#fff' }]}>
					<View style={[styles.editButtons, { flexDirection: 'row-reverse' }]}>
						<Button transparent onPress={() => { setEditMode(!editMode) }}>
							<Icon type='AntDesign' name={editMode ? 'arrowleft' : 'edit'} style={{ color: '#000', marginRight: 0 }} />
						</Button>
					</View>
					<Text style={styles.overlayText}>{i18n.t('fields.name')} : {field.name}</Text>
					<Text style={styles.overlayText}>
						{i18n.t('fields.culture', { value: i18n.t(`cultures.${field.culture_name}`) || i18n.t('fields.unknown') })}
					</Text>
					<Text style={styles.overlayText}>
						{field.area ? `${i18n.t('fields.area', { value: (field.area / 10000).toFixed(2) })}` : ''}
					</Text>

				</View>
			)}
		</View>
	)
}


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

						{/* <Icon
                      type='AntDesign'
                      name={items.filter((it)=>it.selected == true).length > 0 ? 'arrowdown' : 'arrowright'}
                      style={{fontSize: 16, color: COLORS.CYAN}} /> */}

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

const FieldsScreen = ({ navigation, parcelles, updateParcellesList, cultures }) => {
	const [selectedFieldIdx, setSelectedFieldIdx] = useState<number>(null)
	const [cultureList, setCultureList] = useState<Array<any>>([])
	const [fields, setFields] = useState<Array<fieldType>>([])
	const [ready, setReady] = useState<boolean>(false)
	const [editMode, setEditMode] = useState<boolean>(false)
	const [cultureNames, setCulturesNames] = useState<Array<string>>([])
	const [selectedName, setSelectedName] = useState<string>(null)

	const loadFields = async () => {
		const { fields: fld }: getFieldsReturnType = await getFields_v2()
		if (!!fld) {
			setFields(fld)
			// filtering out useless cultures like "Jachère", "Bande Tampon",...
			const fld_filter = fld.filter((f) => {
				const c = cultures.find((c) => c.id == f.culture.id)
				return !c.hidden
			})
			let nm = fld_filter.map((f) => f.culture.name).sort((a, b) => a.localeCompare(b))
			setCulturesNames([... new Set(nm)])     //delete duplicate
		}
	}

	useEffect(() => {
		// console.log("Amplitude : ", ampEvent.render)
		Amplitude.logEventWithProperties(ampEvent.render, {
			timestamp: Date.now()
		})
	}, [])

	useEffect(() => {
		// Init fields and retrieve culture_names
		if (fields.length == 0) {
			loadFields()
		}
	}, [])

	useEffect(() => {
		const getCultureList = async () => {
			const l = await getAllCultures()
			setCultureList(l)
		}
		getCultureList()
	}, [])

	const getRegion = () => {
		let center = {
			longitude: (parcelles.region.lon_max - parcelles.region.lon_min) / 2 + parcelles.region.lon_min,
			latitude: (parcelles.region.lat_max - parcelles.region.lat_min) / 2 + parcelles.region.lat_min,
		}

		let r = {
			...center,
			longitudeDelta: Math.max(0.0222, 2 * Math.abs(parcelles.region.lon_max - center.longitude)),
			latitudeDelta: Math.max(0.0121, 2 * Math.abs(parcelles.region.lat_max - center.latitude)),
		}
		return r
	}
	const region = getRegion()

	const polygons = useRef([]);
	if (polygons.current.length !== parcelles.length) {
		polygons.current = Array(parcelles.length).fill().map((_, i) => polygons.current[i] || createRef())
	}

	const setField = async (newField) => {
		try {
			await updateField_v2(newField)
			loadFields()
			//updateParcellesList(fields)
		} catch (error) {

		}
	}
	const updateList = (index) => {
		setSelectedFieldIdx(index)
	}
	useEffect(() =>  {
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
						<Button transparent onPress={() => navigation.navigate("main_v2")}>
							<Icon type='AntDesign' name='arrowleft' style={{ color: '#fff' }} />
						</Button>
					</Left>
					<Body style={styles.headerBody}>
						<Title style={styles.headerTitle}>{i18n.t('pulve_parcelscreen.title')}</Title>
						<Title style={styles.headerSubtitle}>{i18n.t('pulve_parcelscreen.subtitle')}</Title>
					</Body>
					<Right style={{ flex: 1 }}>
						<Button transparent onPress={() => navigation.navigate("main_v2")}>
							<Icon type='AntDesign' name='close' style={{ color: '#fff' }} />
						</Button>
					</Right>
				</Header>
				<Content style={styles.content}>
					{!editMode ? (
						<View>
							<Text style={hygoStyles.h0}>{i18n.t('pulve_parcelscreen.parcels')}</Text>
							{fields.length > 0 && cultureNames.length > 0 ? (
								cultureNames.map((n, k) => {
									const items: Array<fieldType> = fields.filter((f) => f.culture.name == n)
									return (
										items.length > 0 &&
										<ParcelList
											key={k}
											title={n}
											items={items.sort((it1, it2) => it1.id - it2.id)}
											onPress={updateList}
											active={true} //{(!selectedName || n == selectedName)}
										/>
									)
								})
							) : (<Spinner />)
							}
						</View>
					) : (
						<EditField
							field={fields.find((f) => f.id == selectedFieldIdx)}
							cultureList={cultureList}
							onCancel={() => setEditMode(false)}
							onConfirm={(field) => {
								setField(field)
								setEditMode(false)
							}}
						/>
					)}
				</Content>
			</Container>

		</SafeAreaView>
		// <SafeAreaView style={styles.statusbar} forceInset={{ top: 'always' }}>
		//     <StatusBar translucent backgroundColor="transparent" />
		//     <Header style={styles.header} androidStatusBarColor={COLORS.CYAN} iosBarStyle="light-content">
		//         <Left style={{ flex: 1 }}>
		//             {parcelles && (
		//                 <Button transparent onPress={() => navigation.goBack()}>
		//                     <Icon name='close' style={{ color: '#fff' }} />
		//                 </Button>
		//             )}
		//         </Left>
		//         <Body style={styles.headerBody}>
		//             <Title style={styles.headerTitle}>{i18n.t('fields.header')}</Title>
		//         </Body>
		//         <Right style={{ flex: 1 }}></Right>
		//     </Header>
		//     <Content style={styles.content}>
		//         <View style={styles.mapview}>
		//             <MapView
		//                 provider="google"
		//                 mapType="hybrid"
		//                 initialRegion={region}
		//                 style={styles.map}
		//                 loadingEnabled={true}
		//             >

		//                 {parcelles.fields.map((field, idx) => {
		//                     return (
		//                         <Polygon2
		//                             key={field.id}
		//                             strokeWidth={selectedFieldIdx === idx ? 4 : 1}
		//                             strokeColor={selectedFieldIdx === idx ? '#fff' : COLORS.DARK_GREEN}
		//                             fillColor={selectedFieldIdx === idx ? COLORS.CYAN : COLORS.DEFAULT_FIELD_MY}
		//                             _ref={ref => (polygons.current[idx] = ref)}
		//                             onLayout={() => polygons.current[idx].setNativeProps({
		//                                 fillColor: selectedFieldIdx === idx ? COLORS.CYAN : COLORS.DEFAULT_FIELD_MY
		//                             })}

		//                             tappable={true}
		//                             onPress={() => {
		//                                 let i = idx

		//                                 let newValue = selectedFieldIdx === i ? null : i
		//                                 setSelectedFieldIdx(newValue)
		//                             }}
		//                             coordinates={field.features.coordinates[0].map((coordinate) => {
		//                                 return {
		//                                     latitude: coordinate[1],
		//                                     longitude: coordinate[0],
		//                                 }
		//                             })}
		//                         />
		//                     );
		//                 })}
		//             </MapView>
		//         </View>

		//         <View>
		//             {selectedFieldIdx != null ? (
		//                 <Card
		//                     field={parcelles.fields[selectedFieldIdx]}
		//                     cultureList={cultureList}
		//                     onUpdate={setField} />
		//             ) : (
		//                     <Text style={[styles.overlayText, {paddingLeft:20}]}>{i18n.t('fields.parcelles', { value: parcelles.fields.length })}</Text>
		//                 )}
		//         </View>
		//     </Content>
		// </SafeAreaView >
	);
}

const EditField = ({field, cultureList, onCancel, onConfirm}) => {

	const [editMode, setEditMode] = useState<boolean>(false)
	const [name, setName] = useState<string>(field.name)
	const [cultureId, setCultureId] = useState<string>(field.culture.id)

	const confirmEdit = async () => {
		const newField = { id: field.id, name, cultureId: cultureId }
		//await onUpdate(newField)
		setEditMode(!editMode)
	}
	const cancelEdit = () => {
		reset()
		setEditMode(!editMode)
	}
	const reset = () => {
		setName(field.name)
		setCultureId(field.culture.id)
	}
	useEffect(() => {
		reset()
	}, [field])


	return (
		<View style={[styles.hygocard, { backgroundColor: '#fff' }]}>
			<View style={styles.editButtons}>
				<Button transparent onPress={onCancel}>
					<Icon type='AntDesign' name='arrowleft' style={{ color: '#000', marginLeft: 0 }} />
				</Button>

				<Button transparent onPress={onConfirm}>
					<Icon type='AntDesign' name='check' style={{ color: '#000', marginRight: 0 }} />
				</Button>
			</View>

			<View style={{ display: 'flex', flexDirection: 'row' }}>
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
					// iosIcon={<Icon name="arrow-down" />}
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
		fontSize: 16,
		fontFamily: 'nunito-bold',
		color: COLORS.DARK_GREEN,
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

// const styles = StyleSheet.create({

//     header: {
//         backgroundColor: COLORS.CYAN
//     },
//     headerBody: {
//         flex: 4,
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     headerTitle: {
//         color: '#fff',
//         fontFamily: 'nunito-regular',
//         fontSize: 20
//     },
//     statusbar: { backgroundColor: 'black', flex: 1 },
//     map: {
//         justifyContent: "center",
//         flexDirection: 'column',
//         width: Dimensions.get('window').width,
//         height: Dimensions.get('window').width,
//     },
//     mapview: {
//         justifyContent: 'center',
//         flex: 1, display: 'flex',
//         paddingLeft: 15,
//         paddingRight: 15,
//         paddingBottom: 20,
//         alignItems: 'center',
//         backgroundColor: COLORS.BEIGE
//     },
//     overlay: {
//         paddingHorizontal: 20,
//         paddingVertical: 15,
//         backgroundColor: '#fff',
//         shadowColor: '#000',
//         shadowOffset: {
//             width: 0,
//             height: 2
//         },
//         shadowOpacity: .2,
//         shadowRadius: 3,
//         elevation: 3,
//         width: Dimensions.get('window').width - 30,
//         top: -25,
//     },
//     overlayText: {
//         fontSize: 16,
//         fontFamily: 'nunito-bold',
//         color: COLORS.DARK_GREEN,
//     },
//     content: {
//         backgroundColor: COLORS.BEIGE
//     },
//     hygocard: {
//         borderTopRightRadius: 20,
//         shadowOffset: { width: 0, height: 2 },
//         shadowColor: '#000000',
//         shadowRadius: 2,
//         shadowOpacity: .2,
//         padding: 20,
//         paddingTop: 5,
//         display: 'flex',
//         elevation: 2,
//         marginBottom: 10
//     },
//     editButtons: {
//         display: 'flex',
//         justifyContent: 'space-between',
//         flexDirection: 'row'
//     }
// });


const mapStateToProps = (state) => ({
	parcelles: state.metadata.parcelles,
	cultures: state.metadata.cultures,
});

const mapDispatchToProps = (dispatch, props) => ({
	updateParcellesList: (l) => dispatch(updateParcellesList(l)),
})

export default connect(mapStateToProps, mapDispatchToProps)(FieldsScreen);
