import { AsyncStorage } from 'react-native'

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as TaskManager from 'expo-task-manager';

import { Platform } from 'react-native';

import { storeAppLocation } from '../api/hygoApi'

const GEO_TASK_NAME = "hygo-geo"
const GEO_MAX_DURATION = 8 * 3600 * 1000 // 8 hours in ms

const sendLocation = async (locations, isInit) => {
  let syncStarted = await AsyncStorage.getItem('start-geo-sync');
  if (!isInit && !isNaN((new Date(syncStarted)).getTime()) && (new Date(syncStarted)).getTime() < (new Date().getTime() - GEO_MAX_DURATION)) {
    await AsyncStorage.removeItem('start-geo-sync');

    try {
      await Location.stopLocationUpdatesAsync(GEO_TASK_NAME);
    } catch(e) {}

    return
  }

  if (isInit || isNaN((new Date(syncStarted)).getTime())) {
    await AsyncStorage.setItem('start-geo-sync', ''+(new Date().getTime()));
  }

  // Handle location update
  let storedToken = await AsyncStorage.getItem('token');
  let lastSync = await AsyncStorage.getItem('last-geo-sync');

  await storeAppLocation({
    location: locations,
    token: storedToken,
    lastSync: lastSync
  })

  await AsyncStorage.setItem('last-geo-sync', ''+(new Date()).getTime());
}

TaskManager.defineTask(GEO_TASK_NAME, async ({ data: { locations }, error }) => {
  if (error) {
    // check `error.message` for more details.
    return;
  }

  await sendLocation(locations)
});

const initLocation = async (i18n) => {
  let location = await Location.getLastKnownPositionAsync()
  await sendLocation([ location ], true)

  let isStarted = await Location.hasStartedLocationUpdatesAsync(GEO_TASK_NAME)
  if (!isStarted) {
    if (Platform.OS === 'ios') {
      Location.startLocationUpdatesAsync(GEO_TASK_NAME, {
        distanceInterval: 10,
        accuracy: Location.Accuracy.Highest,
        activityType: Location.ActivityType.AutomotiveNavigation,
        showsBackgroundLocationIndicator: false,
      })
    } else {
      Location.startLocationUpdatesAsync(GEO_TASK_NAME, {
        distanceInterval: 10,
        accuracy: Location.Accuracy.Highest,
        activityType: Location.ActivityType.AutomotiveNavigation,
        showsBackgroundLocationIndicator: false,
        foregroundService: {
          notificationTitle: 'Hygo',
          notificationBody: i18n
        },
        pausesUpdatesAutomatically: false,
      })
    }
  }
}

const getLocationPermissionAsync = async (i18n) => {
  const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);

  if (status === 'granted') {
    initLocation(i18n)
  } else {
    console.log(new Error('Location permission not granted'));
  }
}

export {
  getLocationPermissionAsync
}