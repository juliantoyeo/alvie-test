import React from 'react';
import AccountScreen from './src/screens/AccountScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import BarCodeScreen from './src/screens/BarCodeScreen';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Provider } from 'react-redux';
import Store from './src/store/configureStore';

const switchNavigator = createSwitchNavigator({
  loginFlow: createStackNavigator({
    BarCode: BarCodeScreen,
  }),
  mainFlow: createBottomTabNavigator({
    Dashboard: DashboardScreen,
    Account: AccountScreen 
  })
});

const AppContainer = createAppContainer(switchNavigator);

export default App = () => (
  <Provider store={Store}>
    <AppContainer />
  </Provider>  
) 