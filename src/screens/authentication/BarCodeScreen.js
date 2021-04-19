import * as React from 'react';
import { StyleSheet, StatusBar, ImageBackground, View, AsyncStorage, TextInput } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Text } from 'react-native-elements';
import { Content, Spinner } from 'native-base';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { connect } from 'react-redux';
import { updateAuthInfo } from '../../store/actions/authActions';
import { updatePhytoProductList, updatePulvInfo } from '../../store/actions/pulveActions'
import { updateParcellesList, updateCulturesList } from '../../store/actions/metaActions'
import { signInWithBarCode, checkToken, getPhytoProducts } from '../../api/hygoApi';
import * as Device from 'expo-device';
import COLORS from '../../colors'
import i18n from 'i18n-js';
import HygoLittleButton from '../../components/v2/HygoLittleButton'
import HygoButton from '../../components/HygoButton'
import LogoLoading from '../../components/LogoLoading'
import pkg from '../../../app.json'
import { OTA } from '../../constants'

import { Amplitude, AMPLITUDE_EVENTS } from '../../amplitude'
import { authValidate } from '../../utils/authentication';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { HygoIconsArrowRight, HygoIconsArrowRightFilled } from '../../icons/HygoIcons';
import HygoModal from '../../components/v2/HygoModal';

const { barCodeScreen: ampEvent } = AMPLITUDE_EVENTS

const v2Devices = ["BE72FC"]

class BarCodeScreen extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			hasCameraPermission: null,
			scanned: false,
			loading: true,
			tokenLoading: false,
			qrError: null,
			manual: false,
			textQRCode: '',
			modalVisible: false,
		};
	}
	getPermissionsAsync = async () => {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({ hasCameraPermission: status === 'granted' });

		if (!Device.isDevice) {
			let code = await BarCodeScanner.scanFromURLAsync('https://alvie-mvp.s3-eu-west-1.amazonaws.com/QRCode-FFFFFF.png')
			this.handleBarCodeScanned(code[0])
		}
	};

	async componentDidMount() {
		//await getLocationPermissionAsync(i18n.t('geolocation.text'))

		this.setState({
			hasCameraPermission: null,
			scanned: false,
			loading: true,
			tokenLoading: false,
			qrError: null,
		});
		this.props.updatePhytoProductList(await getPhytoProducts())

		let storedToken = await AsyncStorage.getItem('token');
		let { errorMessage, userName, familyName, deviceid, deviceType, hasEquipment, tester } = await checkToken(storedToken);

		if (!errorMessage) {
			this.setState({
				scanned: false,
				tokenLoading: false,
				qrError: null
			});
			await this.gotoNextScreen(storedToken, userName, familyName, deviceid, deviceType, hasEquipment, tester)
		} else {
			this.setState({ loading: false, qrError: errorMessage })
			this.getPermissionsAsync();
		}
	}

	gotoNextScreen = async (token, userName, familyName, deviceid, deviceType, hasEquipment, tester) => {
		try {
			await authValidate(
				{ token, userName, familyName, deviceid, deviceType, hasEquipment },
				tester,
				this.props,
			)
		} catch (e) {

		}
	}

	handleBarCodeScanned = async ({ type, data }) => {
		this.setState({ tokenLoading: true });
		const { token, errorMessage, userName, familyName, deviceid, deviceType, hasEquipment } = await signInWithBarCode(data);
		if (!errorMessage && token) {
			await this.gotoNextScreen(token, userName, familyName, deviceid, deviceType, hasEquipment)
		} else if (errorMessage == 'NOT_ACTIVATED') {
			this.setState({
				scanned: false,
				tokenLoading: false,
				qrError: null
			});
			this.props.navigation.navigate('BarCodeActivation', { barcode: data })
		} else {
			this.setState({ qrError: errorMessage })
			this.setState({ tokenLoading: false });
			this.setState({ scanned: true });
			this.state.manual && this.setState({modalVisible: true})
		}
	};


	render() {
		const { hasCameraPermission, scanned, tokenLoading, manual, textQRCode, modalVisible } = this.state;

		return (
			<SafeAreaView style={[styles.statusbar, { backgroundColor: 'black', flex: 1, display: 'flex' }]} forceInset={{ top: 'always' }}>
				{ this.state.loading && (
					<React.Fragment>
						<StatusBar translucent backgroundColor="transparent" />
						<ImageBackground source={require('../../../assets/blue_back.png')} imageStyle={{ resizeMode: 'cover', flex: 1 }} style={styles.container}>
							<View style={[StyleSheet.absoluteFill, { flex: 1, backgroundColor: '#000', opacity: .6 }]}></View>
							<View style={{ display: 'flex', alignItems: 'center' }}>
								<LogoLoading duration={1000} color={"#fff"} />
							</View>
						</ImageBackground>
					</React.Fragment>
				)}

				{ !this.state.loading && hasCameraPermission === false && !manual && (
					<Content contentContainerStyle={{ justifyContent: 'center', flex: 1, padding: 20 }}>
						<Text style={{
							color: COLORS.DARK_BLUE,
							textAlign: 'center',
							fontSize: 24,
							fontFamily: 'nunito-regular'
						}}>{i18n.t('bar_code.camera_description')}</Text>

						<View style={[StyleSheet.absoluteFill, {
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'flex-end'
						}]}>

							<HygoButton onPress={() => this.getPermissionsAsync()} label={i18n.t('bar_code.retry_camera')} icon={{
								type: 'EvilIcons',
								name: 'refresh'
							}} />
						</View>
					</Content>
				)}

				{ !this.state.loading && hasCameraPermission && !manual && (
					<BarCodeScanner
						onBarCodeScanned={scanned || tokenLoading ? undefined : this.handleBarCodeScanned}
						style={[StyleSheet.absoluteFill, { display: 'flex' }]}
					>
						<View style={{
							backgroundColor: COLORS.BEIGE,
							flex: 1,
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							padding: 36,
							paddingTop: 50,
							justifyContent: 'space-between'
						}}>

							<View style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
								<Text textAlign="center" style={{
									color: COLORS.DARK_BLUE,
									textAlign: 'center',
									fontSize: 24,
									flex: 1,
									fontFamily: 'nunito-regular'
								}}>{i18n.t('bar_code.welcome')}</Text>

								<Text textAlign="center" style={{
									color: COLORS.DARK_GREEN,
									textAlign: 'center',
									fontSize: 18,
									flex: 1,
									fontFamily: 'nunito-regular'
								}}>{i18n.t('bar_code.notice')}</Text>
							</View>
						</View>
						<View style={{ flex: 2, display: 'flex', flexDirection: 'row', backgroundColor: tokenLoading ? '#000' : 'transparent' }}>
							<View style={{ backgroundColor: COLORS.BEIGE, flex: 1 }}></View>
							<View style={{ backgroundColor: scanned || tokenLoading ? 'rgba(255, 255, 255, .6)' : 'transparent', flexDirection: 'column', width: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
								{scanned && (
									<Text textAlign="center" style={{
										color: COLORS.DARK_BLUE,
										textAlign: 'center',
										fontSize: 24,
										fontFamily: 'nunito-bold'
									}}>{i18n.t(`bar_code.qr_error.${this.state.qrError == 'SIGNIN_ERROR' ? 'signin' : 'network'}`)}</Text>
								)}

								{tokenLoading && (
									<Spinner color={COLORS.DARK_BLUE} />
								)}
							</View>
							<View style={{ backgroundColor: COLORS.BEIGE, flex: 1 }}></View>
						</View>
						<View style={{ backgroundColor: COLORS.BEIGE, flex: 1, paddingTop: 10, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
							<Text textAlign="center" style={styles.text}> {`${i18n.t('drawer.app_version', { version: pkg.expo.version })} | ${i18n.t('drawer.build_number', { build: pkg.extra.build })} - ${OTA}`} </Text>
							{!scanned && (
								<HygoLittleButton
									label='Problème de QRCode ?'
									onPress={() => this.setState({ manual: true })}
								/>
							)}
						</View>


					</BarCodeScanner>
				)}
				{!this.state.loading && manual && (
					<View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.BEIGE }]}>
						<View style={{
							flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
							justifyContent: 'center', backgroundColor: COLORS.BEIGE, margin: 40
						}}
						>
							<HygoModal
								title='Identifiant erroné'
								modalVisible={modalVisible}
								setModalVisible={value => this.setState({modalVisible: value})}
							/>
							<View style={{ flex: 1, justifyContent: 'flex-start' }}>
								<Text textAlign="center" style={{
									color: COLORS.DARK_BLUE,
									textAlign: 'center',
									fontSize: 24,
									paddingBottom: 20,
									fontFamily: 'nunito-regular'
								}}>{i18n.t('bar_code.welcome')}</Text>

								<Text textAlign="center" style={{
									color: COLORS.DARK_GREEN,
									textAlign: 'center',
									fontSize: 18,
									fontFamily: 'nunito-regular'
								}}>Entrez l'identifiant de votre capteur (exemple : BE12345)</Text>
							</View>
							<View style={{ flexDirection: 'column' }}>
								<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
									<View style={styles.inputBorder}>
										<TextInput
											onChangeText={text => this.setState({ textQRCode: text })}
											value={textQRCode}
											style={{ flex: 1, color: COLORS.DARK_GREEN, textAlign: 'center', fontSize: 26 }}
										/>
									</View>
									<TouchableOpacity
										onPress={() => this.handleBarCodeScanned({ data: textQRCode })}
										style={{ paddingLeft: 20 }}>
										<HygoIconsArrowRightFilled height={50} width={50} />
									</TouchableOpacity>
								</View>
							</View>
							<View style={{ flex: 1, justifyContent: 'flex-end' }}>
								<HygoLittleButton
									label='Scanner un QRCode'
									onPress={() => this.setState({ manual: false })}
								/>
							</View>
						</View>
					</View>

				)}

				<View style={[StyleSheet.absoluteFill, {
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'flex-end'
				}]}>

					{scanned && !manual && (
						<HygoButton onPress={() => this.setState({ scanned: false })} label={i18n.t('bar_code.retry_barcode')} icon={{
							type: 'EvilIcons',
							name: 'refresh'
						}} />
					)}
				</View>

			</SafeAreaView>
		);
	}
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
	text: {
		color: COLORS.DARK_GREEN,
		textAlign: 'center',
		fontSize: 10,
		paddingBottom: 20,
		fontFamily: 'nunito-regular'
	},
	inputBorder: {
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: '#AAA',
		borderWidth: 1,
		height: 40,
		width: 200,
	},
})

BarCodeScreen.navigationOptions = () => {
	return {
		headerShown: false
	}
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

export default connect(mapStateToProps, mapDispatchToProps)(BarCodeScreen);
