import React from 'react';
import AccountScreen from './src/screens/AccountScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import BarCodeScreen from './src/screens/BarCodeScreen';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Provider } from 'react-redux';
import configureStore from './src/store/configureStore';
import Ionicons from 'react-native-vector-icons/Ionicons';

const switchNavigator = createSwitchNavigator({
  loginFlow: createStackNavigator({
    BarCode: BarCodeScreen,
  }),
  mainFlow: createBottomTabNavigator({
    Dashboard: DashboardScreen,
    Compte: AccountScreen 
    },
    {
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Ionicons;
        let iconName;
        if (routeName === 'Dashboard') {
          iconName = `ios-information-circle${focused ? '' : '-outline'}`;
        
        } else if (routeName === 'Compte') {
          iconName = `ios-options`;
        }

        // You can return any component that you like here!
        return <IconComponent name={iconName} size={25} color={tintColor} />;
      },
      }),
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
      }
  )
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