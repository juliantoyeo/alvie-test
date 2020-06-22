import * as React from 'react';
import { StyleSheet, StatusBar, ImageBackground, View, AsyncStorage } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Text } from 'react-native-elements';


const WaitActivationScreen = () => {
    return (
      <SafeAreaView style={{ flex: 1, display: 'flex' }}>
       
          <React.Fragment>
          <StatusBar translucent backgroundColor="transparent" />
          <ImageBackground source={require('../../assets/blue_back.png')} imageStyle={{  resizeMode: 'cover', flex: 1 }} style={styles.container}>
            <View style={[StyleSheet.absoluteFill, { flex: 1, backgroundColor: '#000', opacity: .6 }]}></View>
            <View style={{ display: 'flex', alignItems: 'center' }}>
              <Text >Il faut patienter !</Text>
            </View>
          </ImageBackground>
          </React.Fragment>

    </SafeAreaView>
    )
}
const styles = StyleSheet.create({
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