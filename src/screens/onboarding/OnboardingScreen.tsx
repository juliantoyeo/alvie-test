import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, SafeAreaView, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { OnboardingIcon1, OnboardingIcon2, OnboardingIcon3, OnboardingIcon4 } from '../../icons/HygoOnboardingIcons'
import hygoStyles, { heightRatio } from '../../styles'
import COLORS from '../../colors'

const Onboarding = () => {

	const [pagePosition, setPagePosition] = useState<number>(0)
	const screenHeight = Dimensions.get('screen').height
	const screenWidth = Dimensions.get('screen').width
	const texts = [
		"Plannifiez vos pulvérisations",
		"Suivez les conditions en temps réel",
		"Suivez vos interventions passées",
		"Modifiez vos parcelles"
	]

	const onScrollHandler = (event) => {
		let pageNumber = 1;
		const scrollViewAbscissa = event.nativeEvent.contentOffset.x;
		const pageWidth = Dimensions.get('window').width;

		//On va voir si le reste de la division de l'abscisse par rapport à la largeur de l'écran est égale à 0. Si oui, le résultat de la division, nous donnera la page
		const remain: number = scrollViewAbscissa % pageWidth;
		if (remain === 0) {
			pageNumber = Math.floor(scrollViewAbscissa / pageWidth);
			//Si le numéro de page ainsi calculé est différent de celui en cours, on le met à jour
			if (pagePosition !== pageNumber) {
				setPagePosition(pageNumber)
			}
		}
	}
	return (
		<SafeAreaView style={styles.container}>
			<View>
				<ScrollView
					style={styles.onboardingScrollView}
					horizontal={true}
					pagingEnabled={true}
					showsHorizontalScrollIndicator={false}
					onScroll={onScrollHandler}
				>
					<View style={styles.onboardingView}>
						<View style={{flex:1}}></View>
						<Image
							source={require('../../../assets/Background_onboarding1.png')}
							style={{ width: screenWidth, height: screenHeight }}
						/>
						<View style={{flex:1}}></View>
					</View>
					<View style={styles.onboardingView}>
						<Image
							source={require('../../../assets/Background_onboarding2.png')}
							style={{ width: screenWidth, height: screenHeight }}
						/>
					</View>
					<View style={styles.onboardingView}>
						<Image
							source={require('../../../assets/Background_onboarding3.png')}
							style={{ width: screenWidth, height: screenHeight }}
						/>
					</View>
					<View style={styles.onboardingView}>
					<Image
							source={require('../../../assets/Background_onboarding4.gif')}
							style={{ width: screenWidth, height: screenHeight }}
						/>
					</View>
				</ScrollView>
				<View style={styles.bottomOptions}>
					<View style={{ marginTop: 25, marginHorizontal: 40, height: 20 }}>
						<Text style={styles.text}>{texts[pagePosition]}</Text>
					</View>
					<View style={styles.positionIndicatorsRow}>
						<View
							style={[styles.positionIndicatorCircle, { backgroundColor: pagePosition === 0 ? COLORS.DARK_BLUE : 'white' }]} />
						<View
							style={[styles.positionIndicatorCircle, { backgroundColor: pagePosition === 1 ? COLORS.DARK_BLUE : 'white' }]} />
						<View
							style={[styles.positionIndicatorCircle, { backgroundColor: pagePosition === 2 ? COLORS.DARK_BLUE : 'white' }]} />
						<View
							style={[styles.positionIndicatorCircle, { backgroundColor: pagePosition === 3 ? COLORS.DARK_BLUE : 'white' }]} />
					</View>

				</View>
				<View style={styles.icon}>
					{pagePosition === 0 && <OnboardingIcon1 />}
					{pagePosition === 1 && <OnboardingIcon2 />}
					{pagePosition === 2 && <OnboardingIcon3 />}
					{pagePosition === 3 && <OnboardingIcon4 />}
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
		alignItems: 'center',
		justifyContent: 'center'
	},
	onboardingScrollView: {
		flex: 1,
		width: Dimensions.get('screen').width
	},
	onboardingView: {
		flex: 1,
		width: Dimensions.get('screen').width,
		justifyContent: 'center',
		alignItems: 'center'
	},
	bottomOptions: {
		position: 'absolute',
		height: Dimensions.get('screen').height / heightRatio,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		bottom: 0,
		left: 0,
		width: Dimensions.get('screen').width,
		backgroundColor: 'white',
		alignItems: 'center',
	},
	icon: {
		position: 'absolute',
		bottom: Dimensions.get('screen').height / heightRatio - 30,
		left: 20,
		// width: Dimensions.get('screen').width,
		// backgroundColor: 'white',
		// alignItems: 'center'
	},
	positionIndicatorsRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: 150,
		marginVertical: 10
	},
	positionIndicatorCircle: {
		width: 12,
		height: 12,
		borderRadius: 6,
		borderWidth: 2,
		borderColor: COLORS.DARK_BLUE
	},
	text: {
		fontFamily: 'nunito-bold',
		fontSize: 15,
		color: COLORS.DARK_BLUE,
		textAlign: "center"
	}
});

export default Onboarding
