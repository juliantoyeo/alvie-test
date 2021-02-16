import React, { useState, useEffect } from 'react'
import { StatusBar, StyleSheet, SafeAreaView, View, ImageBackground } from 'react-native'
import { Container, Header, Left, Body, Right, Button, Icon, Title, Tabs, Tab , Text} from 'native-base';

import i18n from 'i18n-js'

import MeteoBriefScreen_v2 from './MeteoScreen_TabBrief'
import MeteoRadar_v2 from './MeteoScreen_TabRadar'
import MeteoDetailed_v2 from './MeteoScreen_TabDetailed'

import * as Localization from 'expo-localization';

import { Amplitude, AMPLITUDE_EVENTS } from '../../amplitude'
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { MeteoContext } from '../../context/meteo.context';
import { connect } from 'react-redux'


const SVGminifiedPath = (svgString) => {
    const values = svgString.split('L').join(' ').split('M').join(' ').split('Z').join('').split(' ').filter(el => el != "").map((el) => parseFloat(el));
    let Xs = values.filter((el, index) => index %2 == 0)
    let Ys = values.filter((el, index) => index %2 != 0)
    const minX = Math.min(...Xs)
    const maxX = Math.max(...Xs)
    const minY = Math.min(...Ys)
    const maxY = Math.max(...Ys)
    Xs = Xs.map(el => el - minX)
    Ys = Ys.map(el => el - minY)
    // console.log("=======",Xs, Ys)
    // console.log(minX, maxX, minY, maxY)
    
    const ret = `M ${Xs[0]} ${Ys[0]} L ${Xs.slice(1).map( (el, index) => `${el} ${Ys.slice(1)[index]} `).join(' ')}Z`
    console.log("==========")
    console.log(ret)
    console.log(maxX - minX)
    console.log(maxY - minY)
    return ret
}
const MeteoScreen_v2 = ({ navigation, parcelles }) => {

    const pathValue = "M 500160.8882 -6618953.609 L 500161.456100002 -6618965.6359 500163.498100005 -6618978.5698 500169.625100002 -6618998.6529 500177.567100003 -6619018.8489 500182.1061 -6619029.8549 500182.787100002 -6619041.4278 500187.098099999 -6619068.7719 500190.729100004 -6619092.0319 500196.7421 -6619115.1778 500202.869100004 -6619137.53 500202.075199999 -6619145.812 500202.075100005 -6619158.86 500200.146200001 -6619185.4099 500202.302100003 -6619195.7348 500202.529100001 -6619195.7348 500202.756099999 -6619206.0599 500204.004100002 -6619213.7757 500333.576700002 -6619172.0218 500327.676800005 -6619160.5618 500327.789700001 -6619160.5618 500319.620800003 -6619132.424 500317.4648 -6619120.284 500313.947800003 -6619107.803 500308.728799999 -6619079.891 500306.458800003 -6619069.453 500302.487800002 -6619045.172 500292.843800001 -6619021.345 500288.305799998 -6619002.851 500283.993799999 -6618978.797 500280.7038 -6618949.638 500271.639800005 -6618929.0391 500261.868799999 -6618922.1801 500246.437899999 -6618915.0321 500219.887900002 -6618906.4091 500209.449900001 -6618905.6151 500189.027000003 -6618903.9132 500176.206 -6618905.5011 500166.788000003 -6618908.1111 500163.158200003 -6618910.1531 500164.065099999 -6618921.2719 500165.654100001 -6618942.4899 500165.540100001 -6618947.028 Z"  
    const minifiedSVG = new SVGminifier(pathValue);
    // const minifyValues = "M 0 335.3727000001818 L 634.0256000009831 0  728.7430999950739 83.67980000004172  74.60999999905471 469.0100999996066  34.93509999697562 390.2318000001833 Z"
    return (
        <SafeAreaView style={[styles.statusbar, { backgroundColor: 'black' }]} forceInset={{ top: 'always' }}>
            <StatusBar translucent backgroundColor="transparent" />
            <ImageBackground source={require('../../../assets/meteo_back.png')} imageStyle={{ resizeMode: 'cover', flex: 1 }} style={styles.container}>
                <Container style={styles.content}>
                    <Header style={styles.header} androidStatusBarColor="transparent" hasTabs transparent iosBarStyle="light-content">
                        <Left style={{ flex: 1 }}>
                            <Button transparent onPress={() => navigation.toggleDrawer()}>
                                <Icon name='menu' style={{ color: '#fff' }} />
                            </Button>
                        </Left>
                        <Body style={styles.headerBody}>
                            <Title style={styles.headerTitle}>{i18n.t('meteo.header')}</Title>
                        </Body>
                        <Right style={{ flex: 1 }}></Right>
                    </Header>
                    <View style={{backgroundColor: "black", flexDirection: "row" }}>
                        
                        <Text style={{color: 'white'}}>YESSS</Text>
                    </View>

                </Container>
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    statusbar: {
        flex: 1,
        display: 'flex',
    },
    container: {
        flex: 1,
        display: 'flex',
    },
    header: {
        backgroundColor: 'transparent',
    },
    headerBody: {
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        flex: 1,
    },
    headerTitle: {
        color: '#fff',
        fontFamily: 'nunito-regular',
        fontSize: 24
    },
    content: {
        flex: 1,
        backgroundColor: Colors.BEIGE
    },
    tabBar: {
        backgroundColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        elevation: 0,
        borderBottomWidth: 0
    },
    tabStyle: {
        backgroundColor: 'transparent',
        borderBottomWidth: 0
    },
    textStyle: {
        textTransform: 'uppercase',
        color: '#fff',
        fontSize: 14,
        fontFamily: 'nunito-bold',
    }
})

const mapStateToProps = (state) => ({
    parcelles: state.metadata.parcelles,
});

const mapDispatchToProps = (dispatch, props) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(MeteoScreen_v2);