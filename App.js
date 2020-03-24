import React, { useEffect } from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from 'native-base';

import axios from 'axios'

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';

const GEO_TASK_NAME = "hygo-geo"

TaskManager.defineTask(GEO_TASK_NAME, ({ data: { locations }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }
  console.log('Received new locations', locations);

  axios({
    method: 'post',
    url: 'https://c2232c2a.ngrok.io/test',
    data: locations
  });
  
});

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
    },
    {
      headerMode: 'none',
      defaultNavigationOptions : {
        
        
      }
    
    } ),
    Parametres: AccountScreen 
    },
    {
      header: () => < HeaderHygo/>,
      defaultNavigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let IconComponent = Icon;
        let iconName;
        if (routeName === 'Dashboard') {
          iconName = "ios-stats";
        
        } else if (routeName === 'Parametres') {
          iconName = "contact";
        }
        else if (routeName === 'Traitement') {
          iconName = "ios-leaf";
        }
        else if (routeName === 'Intervention') {
          iconName = "ios-map";
        }

        // You can return any component that you like here!
        return <Icon name={iconName} size={25} style={{color : tintColor}} />;
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


export default App = () => {
  async function getLocationAsync() {
    // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
    const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
    console.log(status)
    console.log(permissions)
    if (status === 'granted') {
      console.log(await Location.getCurrentPositionAsync({ enableHighAccuracy: true }))
    } else {
      throw new Error('Location permission not granted');
    }
  }

  useEffect(() => {
    Location.startLocationUpdatesAsync(GEO_TASK_NAME, {
      distanceInterval: 1,
      accuracy: Location.Accuracy.Highest,
      activityType: Location.ActivityType.AutomotiveNavigation,
    })
    getLocationAsync()
  })

  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>  
  );
}