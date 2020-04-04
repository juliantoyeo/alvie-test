import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { Icon } from 'native-base';

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

        let iconName, iconType, fontSize = 18;
        if (routeName === 'Dashboard') {
          iconName = "tractor";
          iconType = "FontAwesome5"
        } else if (routeName === 'Parametres') {
          iconType = "FontAwesome5"
          iconName = "map";
        } else if (routeName === 'Traitement') {
          iconName = "ios-partly-sunny";
          iconType = "Ionicons"
        } else if (routeName === 'Intervention') {
          iconType = "Octicons"
          iconName = "graph";
        }

        return <Icon type={iconType} name={iconName} size={25} style={{color : tintColor, fontSize}} />;
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