import * as React from 'react';
import { StyleSheet, StatusBar, ImageBackground, View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Text } from 'react-native-elements';
import LogoLoading from '../components/LogoLoading';


const WaitActivationScreen = () => {
    return (
      <SafeAreaView style={{ flex: 1, display: 'flex' }}>
       
          <React.Fragment>
          <StatusBar translucent backgroundColor="transparent" />
          <ImageBackground source={require('../../assets/blue_back.png')} imageStyle={{  resizeMode: 'cover', flex: 1 }} style={styles.container}>
            <View style={[StyleSheet.absoluteFill, { flex: 1, backgroundColor: '#000', opacity: .6 }]}></View>
            <View style={{ display: 'flex', alignItems: 'center' }}>
                <LogoLoading duration={1000} color={"#fff"} />
                <Text style= {styles.text1}>Nous semons les données dans nos serveurs.</Text>
                <Text style= {styles.text2}>La récolte sera bientôt prête !</Text>
            </View>
          </ImageBackground>
          </React.Fragment>

    </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    text1: { 
        paddingTop: 30,
        fontFamily: 'nunito-bold',
        textAlign: 'center',
        fontSize: 20,
        color: '#fff'
    },
    text2: { 
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