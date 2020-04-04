import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { Image } from 'react-native';

import TabBar from './components/TabBar'

import i18n from 'i18n-js'

import AccountScreen from './screens/AccountScreen';
import DashboardScreen from './screens/DashboardScreen';
import BarCodeScreen from './screens/BarCodeScreen';
import SelectPhytoScreen from './screens/SelectPhytoScreen';
import InterventionsScreen from './screens/InterventionsScreen';
import InterventionMapScreen from './screens/InterventionMapScreen';
import EquipmentScreen from './screens/EquipmentScreen';
import LoadingScreen from './screens/LoadingScreen';

import HeaderText from './components/HeaderText'

import COLORS from './colors'

const Navigator = createSwitchNavigator({
  loginFlow: createStackNavigator({
    BarCode: BarCodeScreen,
    EquipmentScreen: {
      screen: EquipmentScreen, 
      navigationOptions: {
        header: () => <HeaderText text={i18n.t('equipment.header')} />,
      },
    },
    LoadingScreen: {
      screen: LoadingScreen,
      navigationOptions: {
        header: null
      }
    }
  }),

  mainFlow: createBottomTabNavigator({
    Traitement: SelectPhytoScreen,

    Dashboard: DashboardScreen,

    Intervention: createStackNavigator({
      Interventions : InterventionsScreen,
      InterventionMapScreen: InterventionMapScreen,
    }, {
      headerMode: 'none',
      defaultNavigationOptions : {}
    }),

    Parametres: AccountScreen 
  }, {
    header: () => <HeaderHygo />,

    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;

        const r = [ 'Traitement', 'Dashboard', 'Intervention', 'Parametres' ]
        let idx = r.indexOf(routeName)

        let props = {
          style: {
            width: 20,
          },
          tintColor,
        }

        switch (idx) {
          case 0:
            return <Image {...props} source={require("../assets/ICN-Nav1.png")} />
          case 1:
            return <Image {...props} source={require("../assets/ICN-Nav2.png")} />
          case 2:
            return <Image {...props} source={require("../assets/ICN-Nav3.png")} />
          case 3:
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
      style: {
        backgroundColor: '#F6F6E9' // TabBar background
      }
    },
  })
});

export default createAppContainer(Navigator)