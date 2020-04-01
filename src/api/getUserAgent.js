import { Platform } from 'react-native';
import * as Device from 'expo-device';
import pkg from '../../app.json'

const getUserAgent = () => {
  switch(Platform.OS) {
    case "ios":
      return `HygoApp/${pkg.expo.version} ${Device.osName}/${Device.osVersion} ${Device.deviceName}`

    case "android":
      return `HygoApp/${pkg.expo.version} Android/${Device.platformApiLevel} ${Device.manufacturer}/${Device.modelName} ${Device.deviceName}`

    default:
      return `HygoApp/${pkg.expo.version} ${Device.osName}/${Device.osVersion} ${Device.deviceName}`
  }
}

export default getUserAgent