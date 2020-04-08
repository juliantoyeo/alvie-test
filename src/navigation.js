import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';

import { Image } from 'react-native';

import TabBar from './components/HygoTabBar'

import i18n from 'i18n-js'

import AccountScreen from './screens/AccountScreen';
import RealTimeScreen from './screens/RealTimeScreen';
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
  mainFlow: createStackNavigator({
    BarCode: BarCodeScreen,
    main: createDrawerNavigator({
      Drawer: {
        screen: createBottomTabNavigator({
          MeteoScreen: createStackNavigator({
            MeteoScreen: {
              screen: MeteoScreen, 
              navigationOptions: {
                header: null,
              },
            },
          }),

          Other: AccountScreen,

          RealTime: RealTimeScreen,

          Intervention: createStackNavigator({
            Interventions : InterventionsScreen,
          }, {
            headerMode: 'none',
            defaultNavigationOptions : {}
          }),
        }, {
          defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, horizontal, tintColor }) => {
              const { routeName } = navigation.state;
      
              const r = [ 'MeteoScreen', 'Other', 'RealTime', 'Intervention' ]
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
          },
        })
      }
    }, {
      contentComponent: DrawerScreen,
      drawerWidth: 310
    }),
    InterventionMapScreen: InterventionMapScreen,
    EquipmentSettingsScreen: {
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
  }, {
    headerMode: 'none'
  })
})

export default createAppContainer(Navigator)