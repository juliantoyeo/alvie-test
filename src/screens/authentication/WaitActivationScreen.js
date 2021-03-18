import * as React from 'react';
import { StyleSheet, StatusBar, ImageBackground, View, AsyncStorage, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Text, Button, Icon } from 'native-base';
import LogoLoading from '../../components/LogoLoading';
import i18n from 'i18n-js'
import { deleteToken } from '../../store/actions/authActions'


const WaitActivationScreen = ({navigation}) => {
    const error = navigation.getParam('error')
	const error2 = navigation.getParam('error2')
    const logout = async () => {
        await AsyncStorage.removeItem('token');

        deleteToken();

        navigation.replace('BarCode');
      }

    return (
        <SafeAreaView style={[styles.statusbar, { backgroundColor: 'black', flex: 1, display: 'flex' }]} forceInset={{top:'always'}}>

          <React.Fragment>
          <StatusBar translucent backgroundColor="transparent" />
          <ImageBackground source={require('../../../assets/blue_back.png')} imageStyle={{  resizeMode: 'cover', flex: 1 }} style={styles.container}>

            <View style={[StyleSheet.absoluteFill, { flex: 1, backgroundColor: '#000', opacity: .6 }]}></View>
            <View style={[StyleSheet.absoluteFill]}>
            <TouchableOpacity  onPress={() => logout()} style ={{marginTop:50, marginLeft: 20}}>
                    <Icon name='close' style={{ color: '#fff', fontSize: 40 }} />
            </TouchableOpacity>
            </View>
            <View style={{ display: 'flex', alignItems: 'center' }}>
                <LogoLoading duration={1000} color={"#fff"} />
                <Text style= {styles.subtitle}>{i18n.t(`wait_screen.${error2 ? error2 : error}.msg1`)}</Text>
                <Text style= {styles.title}>{i18n.t(`wait_screen.${error2 ? error2 : error}.msg2`)}</Text>
            </View>
          </ImageBackground>
          </React.Fragment>

    </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    subtitle: {
        paddingTop: 30,
        fontFamily: 'nunito-bold',
        textAlign: 'center',
        fontSize: 20,
        color: '#fff'
    },
    title: {
        paddingTop: 10,
        fontFamily: 'nunito-bold',
        fontSize: 26,
        textAlign: 'center',
        color: '#fff'
    },
    container: {
        justifyContent: 'center',
        flex: 1,
        display: 'flex',
        paddingLeft: 38,
        paddingRight: 38,
        alignItems: 'center',
        resizeMode: 'cover'
    },
})

export default WaitActivationScreen;
