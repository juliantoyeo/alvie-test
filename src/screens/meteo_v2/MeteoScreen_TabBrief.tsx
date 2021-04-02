import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ScrollView, Text } from 'react-native'

import { HygoCardTransparent, HygoCardTransparentButton } from '../../components/v2/HygoCards'
import i18n from 'i18n-js'
import capitalize from '../../utils/capitalize'
import { getModulationContext } from '../../api/hygoApi'
import _ from 'lodash'
import { ModulationContext, ModulationContextProps } from '../../context/modulation.context'
import { HygoIconsSprayer } from '../../icons/HygoIcons'
import hygoStyles from '../../styles'


const MeteoBriefScreen_v2 = ({ navigation }) => {
	const MONTHS = [
		i18n.t('months.january'),
		i18n.t('months.february'),
		i18n.t('months.march'),
		i18n.t('months.april'),
		i18n.t('months.may'),
		i18n.t('months.june'),
		i18n.t('months.july'),
		i18n.t('months.august'),
		i18n.t('months.september'),
		i18n.t('months.october'),
		i18n.t('months.november'),
		i18n.t('months.december'),
	]
	const now = new Date()
	const { setContext, isReady } = React.useContext(ModulationContext)
	const [clickToReports, setClickToReports] = useState<boolean>(false)
	const [savedModContext, setSavedModContext] = useState<ModulationContextProps[]>([])

	const loadSavedReports = async () => {
		const mc = await getModulationContext()
		setSavedModContext(mc)
	}

	// navigate to the report screen when click a saved report and context is ready
	useEffect(() => {
		if (isReady && clickToReports) {
			setClickToReports(false)
			navigation.navigate('SavedReportScreen', { isSavedContext: true })
		}
	}, [isReady, clickToReports])

	const getDay = (dt: Date) => {
		return `${dt.getDate()} ${capitalize(MONTHS[dt.getMonth()])}`
	}

	useEffect(() => {
		const focusListener = navigation.addListener('didFocus', () => {
			loadSavedReports()
		});
		loadSavedReports()
		return () => { focusListener.remove() }
	}, []);

	const LogoFirstPulve = () => (
		<React.Fragment>
			<HygoIconsSprayer />
			<Text style={[hygoStyles.textBold, { color: 'white', paddingTop: 10, paddingBottom: 0, fontSize: 16 }]}>Planifions votre première bouillie !</Text>
		</React.Fragment>
	)
	return (
		<ScrollView>
			<View style={styles.textContainer}>
				<Text style={styles.date}>{getDay(now)}</Text>
			</View>
			<View style={styles.actionCards}>
				<HygoCardTransparentButton
					title="Pulvérisation"
					subtitle=""
					text="Démarrer un travail de pulvérisation"
					content={savedModContext.length == 0 && <LogoFirstPulve />}
					buttonText="Démarrer"
					onPress={() => navigation.navigate("Pulverisation_v2")}
				/>
				{savedModContext.length > 0 && savedModContext.map((savedContext) => {
					const dt = new Date(savedContext.selectedDay)
					const day = savedContext.selectedDay ? getDay(dt) : ""
					return (<HygoCardTransparent
						key={savedContext.id}
						title={`${day} - ${savedContext.selectedSlot.min}h / ${savedContext.selectedSlot.max + 1}h`}
						subtitle="Pulvérisation"
						text="État sauvegardé"
						buttonText="Visualiser"
						onPress={() => {
							setContext(savedContext)
							setClickToReports(true)
						}}
					/>
					)
				})}

				<View style={{ height: 80 }}></View>
			</View>

		</ScrollView>
	)
}

const styles = StyleSheet.create({
	date: {
		fontFamily: 'nunito-bold',
		fontSize: 32,
		color: '#fff'
	},
	next_3hours: {
		fontFamily: 'nunito-regular',
		fontSize: 18,
		color: '#fff',
		textAlign: 'center'
	},
	textContainer: {
		display: 'flex',
		alignItems: 'center',
		paddingLeft: 35,
		paddingRight: 35,
		paddingTop: 15
	},
	iconContainer: {
		display: 'flex',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		paddingLeft: 45,
		paddingRight: 45,
		paddingTop: 15,
		flexDirection: 'row',
	},
	iconText: {
		fontFamily: 'nunito-bold',
		fontSize: 12,
		color: '#fff',
		textAlign: 'center',
	},
	meteoElement: {
		display: 'flex',
		alignItems: 'center',
	},
	actionCards: {
		paddingRight: 15,
		marginTop: 30,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center'
	},
	image: {
		marginBottom: 10,
	}
})

export default MeteoBriefScreen_v2
