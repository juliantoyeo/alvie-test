import { Platform } from 'react-native';
import * as Device from 'expo-device';

const getUserAgent = () => {
  switch(Platform.OS) {
    case "ios":
      return `HygoApp/1.0 ${Device.osName}/${Device.osVersion}`

    case "android":
      return `HygoApp/1.0 Android/${Device.platformApiLevel} ${Device.manufacturer}/${Device.modelName}`

    default:
      return `HygoApp/1.0 ${Device.osName}/${Device.osVersion}`
  }
}

export default getUserAgent