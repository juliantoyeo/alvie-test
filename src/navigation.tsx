import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

import { Image } from 'react-native';

import TabBar from './components/HygoTabBar'

import i18n from 'i18n-js'

import HygoProductPicker from './components/HygoProductPicker';
import HygoCulturePicker from './components/HygoCulturePicker';
import RealTimeScreen from './screens/RealTimeScreen';
import BarCodeScreen from './screens/authentication/BarCodeScreen';
import BarCodeValidationScreen from './screens/authentication/BarCodeValidationScreen'
import BarCodeActivationScreen from './screens/authentication/BarCodeActivationScreen'
import MeteoScreen from './screens/MeteoScreen';
import MeteoScreen_v2 from './screens/meteo_v2/MeteoScreen_v2'
import InterventionsScreen from './screens/InterventionsScreen';
import InterventionMapScreen from './screens/InterventionMapScreen';
import EquipmentScreen from './screens/EquipmentScreen';
import LoadingScreen from './screens/LoadingScreen';
import DrawerScreen from './screens/DrawerScreen'
import FieldsScreen from './screens/FieldsScreen'
import MeteoDetailedDetails from './screens/MeteoDetailedDetails'
import NextPulverisationScreen from './screens/NextPulverisationScreen'
import NextPulverisationDetails from './screens/NextPulverisationDetailsTop'
import WaitActivationScreen from './screens/authentication/WaitActivationScreen'
import SelectParcelsScreen from './screens/modulation_v2/SelectParcelsScreen';
import SelectProductsScreen from './screens/modulation_v2/SelectProductsScreen';
import SelectSlotScreen from './screens/modulation_v2/SelectSlotScreen';
import ReportScreen from './screens/modulation_v2/ReportScreen';
import HeaderText from './components/HeaderText';
import OnboardingScreen from './screens/onboarding/OnboardingScreen';

import COLORS from './colors'
import NewUpdateScreen from './screens/NewUpdateScreen';

const Navigator = createSwitchNavigator({
	authentication: createStackNavigator({
		BarCode: BarCodeScreen,
		WaitActivation: WaitActivationScreen,
		BarCodeActivation: BarCodeActivationScreen,
	}, {headerMode: 'none'}),
	onboarding: createStackNavigator({
		Onboarding: OnboardingScreen,
		BarCodeValidation: BarCodeValidationScreen,
		OnboardingSettingsScreen: {
			screen: EquipmentScreen,
			navigationOptions: {
				header: () => <HeaderText text={i18n.t('equipment.header')} />,
			},
		},
	}, {headerMode: 'none'}),
    mainFlow: createStackNavigator({
		main_v2: createDrawerNavigator({
			Drawer: {
				screen: createBottomTabNavigator({
					MeteoScreen: createStackNavigator({
						MeteoScreen: {
							screen: MeteoScreen_v2,
							navigationOptions: {
								headerShown: false,
							},
						},
					}),
					RealTime: RealTimeScreen,
					Intervention: createStackNavigator({
						Interventions: InterventionsScreen,
					}, {
						headerMode: 'none',
						defaultNavigationOptions: {}
					}),
				}, {
					defaultNavigationOptions: ({ navigation }) => ({
						tabBarIcon: ({ focused, horizontal, tintColor }) => {
							const { routeName } = navigation.state;

							const r = ['MeteoScreen', 'RealTime', 'Intervention']
							let idx = r.indexOf(routeName)

							let props = {
								style: {
									height: 20,
									tintColor,
								},
							}

							switch (idx) {
								case 0:
									return <Image {...props} source={require("../assets/ICN-Nav1.png")} />
								case 1:
									return <Image {...props} source={require("../assets/ICN-Nav3.png")} />
								case 2:
									return <Image {...props} source={require("../assets/ICN-Nav4.png")} />
							}

						}
					}),

					tabBarComponent: TabBar,
					tabBarOptions: {
						activeTintColor: COLORS.DARK_GREEN,
						inactiveTintColor: '#fff',
						labelStyle: {
							fontSize: 14,
						},
					},
				})
			}
		}, {
			contentComponent: DrawerScreen,
			drawerWidth: 310
		}),
		Pulverisation_v2: createStackNavigator({
			Pulverisation_Fields: SelectParcelsScreen,
			Pulverisation_Products: SelectProductsScreen,
			Pulverisation_Slot: SelectSlotScreen,
			Pulverisation_Report: ReportScreen,
		}, {
			headerMode: 'none'
		}),
		SavedReportScreen: ReportScreen,
		InterventionMapScreen: InterventionMapScreen,
		MeteoDetailedDetails: {
			screen: MeteoDetailedDetails,
			navigationOptions: {
				gesturesEnabled: false,
			}
		},
		NextPulverisationDetails: {
			screen: NextPulverisationDetails,
			navigationOptions: {
				gesturesEnabled: false,
			}
		},
		FieldsScreen: FieldsScreen,
		EquipmentSettingsScreen: {
			screen: EquipmentScreen,
			navigationOptions: {
				header: () => <HeaderText text={i18n.t('equipment.header')} />,
			},
		},
		HygoProductPicker: HygoProductPicker,
		HygoCulturePicker: HygoCulturePicker,
		LoadingScreen: {
			screen: LoadingScreen,
			navigationOptions: {
				headerShown: false
			}
		},

	}, {
		headerMode: 'none'
	})
})



export default createAppContainer(Navigator)
