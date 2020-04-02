import React, { useState } from 'react';
import AccountScreen from './src/screens/AccountScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import BarCodeScreen from './src/screens/BarCodeScreen';
import SelectPhytoScreen from './src/screens/SelectPhytoScreen';
import InterventionsScreen from './src/screens/InterventionsScreen';
import InterventionMapScreen from './src/screens/InterventionMapScreen';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Provider } from 'react-redux';
import configureStore from './src/store/configureStore';
import { Icon } from 'native-base';

import * as Font from 'expo-font';
import { AppLoading } from 'expo';

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import translations from './src/i18n/i18n.js'

i18n.translations = translations
i18n.locale = Localization.locale
i18n.fallbacks = true;

const fetchFonts = () => {
  return Font.loadAsync({
  'nunito-bold': require('./assets/fonts/Nunito-Bold.ttf'),
  'nunito-italic': require('./assets/fonts/Nunito-Italic.ttf'),
  'nunito-regular': require('./assets/fonts/Nunito-Regular.ttf')
  });
};

const switchNavigator = createSwitchNavigator({
  loginFlow: createStackNavigator({
    BarCode: BarCodeScreen,
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
    header: () => < HeaderHygo/>,
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;

      let iconName;
      if (routeName === 'Dashboard') {
        iconName = "ios-stats";
      } else if (routeName === 'Parametres') {
        iconName = "contact";
      } else if (routeName === 'Traitement') {
        iconName = "ios-leaf";
      } else if (routeName === 'Intervention') {
        iconName = "ios-map";
      }

      return <Icon name={iconName} size={25} style={{color : tintColor}} />;
    }}),
    tabBarOptions: {
      activeTintColor: '#59DFD6',
      inactiveTintColor: 'gray',
      labelStyle: {
        fontSize: 14,
      },
      style: {
        backgroundColor: '#F6F6E9' // TabBar background
      }
    },
  })
});

const AppContainer = createAppContainer(switchNavigator);
const store = configureStore();

export default App = () => {
  const [fontLoaded, setFontLoaded] = useState(false)

  if (!fontLoaded) {
    return (
      <AppLoading startAsync={fetchFonts} onFinish={() => setFontLoaded(true)} />
    )
  }

  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>  
  );
}