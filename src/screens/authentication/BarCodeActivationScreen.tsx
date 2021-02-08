import React, { useState } from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, View, Text, StatusBar, AsyncStorage, TextInput } from 'react-native';
import { Content, Header, Left, Button, Icon } from 'native-base';
import { connect } from 'react-redux'
import { deleteToken } from '../../store/actions/authActions'
import COLORS from '../../colors';
import i18n from 'i18n-js';
import { Amplitude } from '../../amplitude'
import { updateAuthInfo } from '../../store/actions/authActions';
import { updatePhytoProductList, updatePulvInfo } from '../../store/actions/pulveActions'
import { updateParcellesList, updateCulturesList } from '../../store/actions/metaActions'
import { checkToken, activateDevice } from '../../api/hygoApi';
import HygoButton from '../../components/HygoButton'
import { authValidate } from './authValidate';

interface activationDataType {
    token: string,
    deviceid: string,
    userName: string,
    familyName: string,
    barcode,
    deviceType: string,
    hasEquipment: boolean,
    agri: number
}
const BarCodeActivationScreen = (props) => {
    const barcode = props.navigation.getParam('barcode', '');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [activationCode, setActivationCode] = useState<string>('');

    const onPress = async () => {
        const {activationData, error} = await activateDevice(barcode, activationCode)
        if (!!activationData) {
            authValidate(activationData, false, props)
        }
        else {
            setErrorMessage("Code d'activiation erroné");
        }
    }
    return (
        <View>
            <Text>Barcode : {barcode}</Text>
            <TextInput 
                        onChangeText={(text) => setActivationCode(text)}
                        value={activationCode}
                        style={{ textAlign:'left'}}
                        keyboardType='numeric'
                      />
            <Button onPress={onPress}>
                <Text>Activer HYGO</Text>
            </Button>
            <Text>{errorMessage}</Text>
        </View>
    );
}
const mapStateToProps = (state) => ({
    deviceid: state.authen.deviceid
})
const mapDispatchToProps = (dispatch, props) => ({
    updateAuthInfo: (params) => dispatch(updateAuthInfo(params)),
    updatePulvInfo: (params) => dispatch(updatePulvInfo(params)),
    checkToken: (token) => dispatch(checkToken(token)),
    updatePhytoProductList: (l) => dispatch(updatePhytoProductList(l)),
    updateParcellesList: (l) => dispatch(updateParcellesList(l)),
    updateCulturesList: (l) => dispatch(updateCulturesList(l)),
})

export default connect(mapStateToProps, mapDispatchToProps)(BarCodeActivationScreen);