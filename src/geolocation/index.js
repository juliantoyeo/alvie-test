import axios from 'axios'

import { AsyncStorage } from 'react-native'

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';

import { Platform } from 'react-native';

import getUserAgent from '../api/getUserAgent'

const GEO_TASK_NAME = "hygo-geo"
const GEO_MAX_DURATION = 8 * 3600 * 1000 // 8 hours in ms

const sendLocation = async (locations) => {
  // Ensure Geoloc only runs for 8 hours on iOS
  if (Platform.OS === 'ios') {
    let syncStarted = await AsyncStorage.getItem('start-geo-sync');
    if (!isNaN((new Date(syncStarted)).getTime()) && (new Date(syncStarted)).getTime() < (new Date().getTime() - GEO_MAX_DURATION)) {
      await AsyncStorage.setItem('start-geo-sync', null);

      try {
        await Location.stopLocationUpdatesAsync(GEO_TASK_NAME);
      } catch(e) {}
      
      return
    }

    if (isNaN((new Date(syncStarted)).getTime())) {
      await AsyncStorage.setItem('start-geo-sync', ''+(new Date().getTime()));
    }
  }

  // Handle location update
  let storedToken = await AsyncStorage.getItem('token');
  let lastSync = await AsyncStorage.getItem('last-geo-sync');
  axios({
    method: 'post',
    url: 'https://staging.alvie.fr/app/location',
    headers: { 
      'User-Agent': getUserAgent()
    },
    data: {
      location: locations,
      token: storedToken,
      lastSync: lastSync
    }
  });
  await AsyncStorage.setItem('last-geo-sync', ''+(new Date()).getTime());
}

TaskManager.defineTask(GEO_TASK_NAME, async ({ data: { locations }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }

  await sendLocation(locations)
});

const getLocationPermissionAsync = async () => {
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
  getLocationPermissionAsync
}