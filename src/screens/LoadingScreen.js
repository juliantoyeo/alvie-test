import React, { useEffect } from 'react'
import { SafeAreaView, ImageBackground, StyleSheet, View, StatusBar } from 'react-native'

import LogoLoading from '../components/LogoLoading'

const LoadingScreen = ({ navigation }) => {
  useEffect(() => {
    if (typeof navigation.state.params.action !== 'undefined') {
      run()
    }
  }, [navigation.state.params])

  const run = async () => {
    const { action, next, params, raw } = navigation.state.params

    let result = await action(params)
    navigation.replace(next, raw ? {
      ...result
    } : {
      result
    })
  }

  return (
    <SafeAreaView style={styles.statusbar}>
      <StatusBar translucent backgroundColor="transparent" />
      <ImageBackground source={require('../../assets/blue_back.png')} imageStyle={{  resizeMode: 'cover', flex: 1 }} style={styles.container}>
        <View style={[StyleSheet.absoluteFill, { flex: 1, backgroundColor: '#000', opacity: .6 }]}></View>
        <View style={{ display: 'flex', alignItems: 'center' }}>
          <LogoLoading duration={1000} color={"#fff"} />
        </View>
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
    justifyContent: 'center', 
    flex: 1, 
    display: 'flex', 
    paddingLeft: 38, 
    paddingRight: 38, 
    alignItems: 'center',
    resizeMode: 'cover'
  },
  
})

export default LoadingScreen