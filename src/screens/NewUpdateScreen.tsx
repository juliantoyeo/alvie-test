import { Icon } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, StatusBar, ImageBackground } from 'react-native';
import LogoLoading from '../components/LogoLoading';

const NewUpdateScreen = () => {
	return (
		<SafeAreaView style={{ backgroundColor: 'black', flex: 1, display: 'flex' }} forceInset={{ top: 'always' }}>
			<React.Fragment>
				<StatusBar translucent backgroundColor="transparent" />
				<ImageBackground source={require('../../assets/blue_back.png')} imageStyle={{ resizeMode: 'cover', flex: 1 }} style={styles.container}>
					<View style={[StyleSheet.absoluteFill, { flex: 1, backgroundColor: '#000', opacity: .6 }]}></View>
					<View style={{ display: 'flex', alignItems: 'center' }}>
						<LogoLoading duration={1000} color={"#fff"} />
						<Text style={styles.title}>Une nouvelle version de Hygo est disponible</Text>
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


export default NewUpdateScreen
