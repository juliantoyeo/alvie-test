import { AsyncStorage } from 'react-native';

import { signInWithBarCode, checkToken, storePushToken, getPhytoProducts, getFields, getCultures, checkSetup } from '../../api/hygoApi';

import { Amplitude, AMPLITUDE_EVENTS } from '../../amplitude'

const { barCodeScreen: ampEvent } = AMPLITUDE_EVENTS

export const authValidate = async (
    {token, userName, familyName, deviceid, deviceType, hasEquipment},
    tester,
    {navigation, updateAuthInfo, updatePulvInfo, updateParcellesList, updateCulturesList}) => {

    await AsyncStorage.setItem('token', token);

    Amplitude.setUserId(`${deviceid}-${userName}-${familyName}`)
    // console.log("Amplitude : ", ampEvent.loggedin)
    Amplitude.logEventWithProperties(ampEvent.loggedin, {
        timestamp: Date.now(),
        token,
        userName,
        familyName,
        deviceid,
        deviceType,
        hasEquipment
    })
    let phytoProductSelected = await AsyncStorage.getItem('phytoProductSelected');
    let culturesSelected = await AsyncStorage.getItem('culturesSelected');
    await updateAuthInfo({
        token,
        userName, familyName, deviceid, deviceType, tester
    })
    phytoProductSelected = phytoProductSelected == null ? [] : JSON.parse(phytoProductSelected)
    culturesSelected = culturesSelected == null ? [] : JSON.parse(culturesSelected)

    await updatePulvInfo({
        phytoProductSelected,
        culturesSelected
    })

    const { result, error, error2 } = await checkSetup()
    if (!result)
        navigation.replace('WaitActivation', { error, error2 });
    else {
        let [fields, cultures] = await Promise.all([
            getFields(),
            getCultures(),
        ])
        updateParcellesList(fields)
        updateCulturesList(cultures)

        // TODO debug this
        // await this.registerForPushNotificationsAsync(deviceid)

        if (hasEquipment) {
            navigation.navigate('main_v2');
        } else {
            navigation.navigate('onboarding')
        }
    }
}
