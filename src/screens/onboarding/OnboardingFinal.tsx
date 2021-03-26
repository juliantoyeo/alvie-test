import React from 'react';
import { SafeAreaView } from 'react-navigation';
import { StyleSheet, View, Text, StatusBar, AsyncStorage } from 'react-native';
import { Content, Header, Left, Button, Icon } from 'native-base';
import { connect } from 'react-redux'
import { deleteToken } from '../../store/actions/authActions'
import COLORS from '../../colors';
import i18n from 'i18n-js';
import { Amplitude } from '../../amplitude'

import HygoButton from '../../components/HygoButton'
import Onboarding from './OnboardingScreen';

const OnboardingFinal = ({ navigation, deleteToken }) => {
	console.log("========", navigation)
	const logout = async () => {
		await AsyncStorage.removeItem('token');

		deleteToken();
		Amplitude.setUserId(null)
		navigation.replace('BarCode');
	}
	return (

		<View style= {styles.view}>
			<View style={{ flex: 2 }} />
			<Text style={styles.title}>{i18n.t('barcode_validation.title_notice')}</Text>
			<Text style={styles.text}>{i18n.t('barcode_validation.text_notice_1')}</Text>
			<Text style={styles.text}>{i18n.t('barcode_validation.text_notice_2')}</Text>
			<View style={{ flex: 2 }} />

			<View style={[StyleSheet.absoluteFill, styles.buttonView]}>
				<HygoButton onPress={() => {
					navigation.navigate('EquipmentSettingsScreen')
				}} label={i18n.t('button.next')} icon={{
					type: 'AntDesign',
					name: 'arrowright',
					fontSize: 26
				}} />
			</View>
		</View>
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
	view: {
		justifyContent: 'center',
		flex: 1,
		display: 'flex',
		paddingLeft: 38,
		paddingRight: 38,
		alignItems: 'center',
		backgroundColor: COLORS.BEIGE
	},
});
const mapDispatchToProps = (dispatch, props) => ({
	deleteToken: () => dispatch(deleteToken())
})

export default connect(null, mapDispatchToProps)(OnboardingFinal);
