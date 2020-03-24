import axios from 'axios'

import { AsyncStorage } from 'react-native'

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';

const GEO_TASK_NAME = "hygo-geo"

const sendLocation = async (locations) => {
  let storedToken = await AsyncStorage.getItem('token');
  let lastSync = await AsyncStorage.getItem('last-geo-sync');
  axios({
    method: 'post',
    url: 'https://c2232c2a.ngrok.io/test',
    data: {
      location: locations,
      token: storedToken,
      lastSync: lastSync
    }
  });
  await AsyncStorage.setItem('last-geo-sync', (new Date()).getTime());
}

TaskManager.defineTask(GEO_TASK_NAME, ({ data: { locations }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }

  await sendLocation(locations)
});

const getLocationAsync = async () => {
  const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
  if (status === 'granted') {
    let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true })
    await sendLocation([ location ])

    let isStarted = await Location.hasStartedLocationUpdatesAsync(GEO_TASK_NAME)
    if (!isStarted) {
      Location.startLocationUpdatesAsync(GEO_TASK_NAME, {
        distanceInterval: 1,
        accuracy: Location.Accuracy.Highest,
        activityType: Location.ActivityType.AutomotiveNavigation,
      })
    }
  } else {
    throw new Error('Location permission not granted');
  }
}

export {
  getLocationAsync
}