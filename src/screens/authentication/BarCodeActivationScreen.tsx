import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, View, Text, StatusBar, AsyncStorage } from 'react-native';
import { Content, Header, Left, Button, Icon } from 'native-base';
import { connect } from 'react-redux'
import { deleteToken } from '../../store/actions/authActions'
import COLORS from '../../colors';
import i18n from 'i18n-js';
import { Amplitude } from '../../amplitude'
import { updateAuthInfo } from '../../store/actions/authActions';
import { updatePhytoProductList, updatePulvInfo } from '../../store/actions/pulveActions'
import { updateParcellesList, updateCulturesList } from '../../store/actions/metaActions'
import { signInWithBarCode, checkToken, storePushToken, getPhytoProducts, getFields, getCultures, checkSetup } from '../../api/hygoApi';
import HygoButton from '../../components/HygoButton'

const BarCodeActivationScreen = ({ navigation, deleteToken }) => {
    const barcode = navigation.getParam('barcode', '')
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