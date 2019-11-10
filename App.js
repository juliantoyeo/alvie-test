import React from 'react';
import AccountScreen from './src/screens/AccountScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import BarCodeScreen from './src/screens/BarCodeScreen';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Provider } from 'react-redux';
import configureStore from './src/store/configureStore';

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

const store = configureStore();
const state = store.getState();
console.log(store.getState());


export default App = () => (
  <Provider store={store}>
    <AppContainer />
  </Provider>  
) 