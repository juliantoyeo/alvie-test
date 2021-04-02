import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { logout } from '../utils/authentication'
import { StyleSheet, View, Text, StatusBar, AsyncStorage } from 'react-native';
import { Content, Header, Left, Button, Icon } from 'native-base';
import { connect } from 'react-redux'
import { deleteToken } from '../../store/actions/authActions'
import COLORS from '../../colors';
import i18n from 'i18n-js';
import { Amplitude } from '../../amplitude'

import HygoButton from '../../components/HygoButton'

const BarCodeValidationScreen = ({ navigation, deleteToken }) => {
    const logoutAndLeave = async () => {
        try {
			await logout(deleteToken)
        	navigation.navigate('BarCode');
		} catch(e) {}
    }
    return (

        <SafeAreaView style={[styles.statusbar, { backgroundColor: 'black' }]} forceInset={{ top: 'always' }}>
            <StatusBar translucent backgroundColor="transparent" />
            <Header style={styles.header} androidStatusBarColor={COLORS.CYAN} iosBarStyle="light-content">
                <Left style={{ flex: 1 }}>
                    <Button transparent onPress={logoutAndLeave}>
                        <Icon name='close' style={{ color: COLORS.DARK_GREEN }} />
                    </Button>
                </Left>

            </Header>
            <Content contentContainerStyle={styles.container}>
                <View style={{ flex: 2 }} />
                <Text textAlign="center" style={styles.title}>{i18n.t('barcode_validation.title_notice')}</Text>
                <Text textAlign="center" style={styles.text}>{i18n.t('barcode_validation.text_notice_1')}</Text>
                <Text textAlign="center" style={styles.text}>{i18n.t('barcode_validation.text_notice_2')}</Text>
                <View style={{ flex: 2 }} />

                <View style={[StyleSheet.absoluteFill, styles.buttonView]}>
                    <HygoButton onPress={() => {
                        navigation.navigate('OnboardingSettingsScreen')
                    }} label={i18n.t('button.next')} icon={{
                        type: 'AntDesign',
                        name: 'arrowright',
                        fontSize: 26
                    }} />
                </View>
            </Content>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    statusbar: { backgroundColor: COLORS.BEIGE, flex: 1 },
    header: {
        backgroundColor: COLORS.BEIGE
      },
    container: { justifyContent: 'center', flex: 1, display: 'flex', paddingLeft: 38, paddingRight: 38, alignItems: 'center', backgroundColor: COLORS.BEIGE },
    containerSelect: { justifyContent: 'flex-start', flex: 1, display: 'flex', paddingLeft: 0, paddingRight: 15, backgroundColor: COLORS.BEIGE },
    title: {
        color: COLORS.DARK_BLUE,
        textAlign: 'center',
        fontSize: 24,
        flex: 1,
        fontFamily: 'nunito-regular'
    },
    loading: {
        color: COLORS.DARK_BLUE,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'nunito-regular'
    },
    text: {
        color: COLORS.DARK_GREEN,
        textAlign: 'center',
        fontSize: 18,
        flex: 1,
        fontFamily: 'nunito-regular'
    },
    buttonView: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
});
const mapDispatchToProps = (dispatch, props) => ({
    deleteToken: () => dispatch(deleteToken())
})

export default connect(null, mapDispatchToProps)(BarCodeValidationScreen);
