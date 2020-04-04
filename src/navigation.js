import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

import { Image } from 'react-native';

import TabBar from './components/HygoTabBar'

import i18n from 'i18n-js'

import AccountScreen from './screens/AccountScreen';
import DashboardScreen from './screens/DashboardScreen';
import BarCodeScreen from './screens/BarCodeScreen';
import MeteoScreen from './screens/MeteoScreen';
import InterventionsScreen from './screens/InterventionsScreen';
import InterventionMapScreen from './screens/InterventionMapScreen';
import EquipmentScreen from './screens/EquipmentScreen';
import LoadingScreen from './screens/LoadingScreen';
import DrawerScreen from './screens/DrawerScreen'

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

  mainFlow: createDrawerNavigator({
    Drawer: {
      screen: createBottomTabNavigator({
        MeteoScreen: createStackNavigator({
          MeteoScreen: {
            screen: MeteoScreen, 
            navigationOptions: {
              header: null,
            },
          }
        }),

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
        defaultNavigationOptions: ({ navigation }) => ({
          tabBarIcon: ({ focused, horizontal, tintColor }) => {
            const { routeName } = navigation.state;
    
            const r = [ 'MeteoScreen', 'Dashboard', 'Intervention', 'Parametres' ]
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
    }
  }, {
    contentComponent: DrawerScreen,
    drawerWidth: 310
  })
});

export default createAppContainer(Navigator)