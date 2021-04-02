import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { storePushToken } from '../api/hygoApi'

    // registerForPushNotificationsAsync = async (deviceid) => {
    //     const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    //     if (status !== 'granted') {
    //         return;
    //     }
    //     // Get the token that identifies this device
    //     const pushToken = await Notifications.getExpoPushTokenAsync();

    //     // POST the token to the backend server
    //     return storePushToken(pushToken, deviceid)
    // }

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
	let token;
	if (Constants.isDevice) {
	  const { status: existingStatus } = await Notifications.getPermissionsAsync();
	  let finalStatus = existingStatus;
	  if (existingStatus !== 'granted') {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	  }
	  if (finalStatus !== 'granted') {
		//Failed to get push token for push notification
		return null;
	  }
	  token = (await Notifications.getExpoPushTokenAsync()).data;
	  console.log(token);
	} else {
	  //Must use physical device for Push Notifications
	  return null;
	}
	if (Platform.OS === 'android') {
	  Notifications.setNotificationChannelAsync('default', {
		name: 'default',
		importance: Notifications.AndroidImportance.MAX,
		vibrationPattern: [0, 250, 250, 250],
		lightColor: '#FF231F7C',
	  });
	}

	return token;
  }
