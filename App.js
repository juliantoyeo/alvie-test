import React, { useState, useContext, useEffect } from 'react';
import { Provider } from 'react-redux';
import configureStore from './src/store/configureStore';
import { AppState, LogBox } from 'react-native'
import AppContainer from './src/navigation'
import * as Updates from 'expo-updates';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import translations from './src/i18n/i18n.js'
import SnackbarProvider from './src/context/snackbar.context'
import ModulationProvider from './src/context/modulation.context'
import MeteoProvider from './src/context/meteo.context';
import NewUpdateScreen from './src/screens/NewUpdateScreen';

i18n.translations = translations
i18n.locale = Localization.locale
i18n.defaultLocale = 'fr'
i18n.fallbacks = true

const fetchResources = async () => {
	await Promise.all([
		Font.loadAsync({
			'nunito-bold': require('./assets/fonts/Nunito-Bold.ttf'),
			'nunito-italic': require('./assets/fonts/Nunito-BoldItalic.ttf'),
			'nunito-regular': require('./assets/fonts/Nunito-SemiBold.ttf'),
			'nunito-heavy': require('./assets/fonts/Nunito-ExtraBold.ttf'),
			'Roboto_medium': require('./assets/fonts/Nunito-SemiBold.ttf'),
		}),
		Asset.loadAsync([
			require('./assets/blue_back.png'),
			require('./assets/meteo_back.png'),
			require('./assets/ICN-Nav1.png'),
			require('./assets/ICN-Nav2.png'),
			require('./assets/ICN-Nav3.png'),
			require('./assets/ICN-Nav4.png'),
			require('./assets/ICN-Temperature.png'),
			require('./assets/ICN-Rain.png'),
			require('./assets/ICN-Hygro.png'),
			require('./assets/ICN-Wind.png'),
			require('./assets/Background_onboarding1.jpg'),
			require('./assets/Background_onboarding2.jpg'),
			require('./assets/Background_onboarding3.jpg'),
			require('./assets/Background_onboarding4.gif'),
			require('./assets/Background_onboarding5.jpg'),
		])
	]);
};

const store = configureStore();

// disable warning about getNode()
LogBox.ignoreLogs([
	'Calling `getNode()` on the ref',
	'currentlyFocusedField is deprecated and will be removed',
])

const DataProviders = ({ children }) => (
	<ModulationProvider>
		<MeteoProvider>
			{children}
		</MeteoProvider>
	</ModulationProvider>
)

export default App = () => {
	const [resourcesLoaded, setResourcesLoaded] = useState(false)
	const [updateRequired, setUpdateRequired] = useState(false)
	// Check when app is coming to the foreground
	const onChangeState = (nextAppState) => {
		const checkUpdate = async () => {
			try {
				const {isAvailable } = await Updates.checkForUpdateAsync()
				if (isAvailable) setUpdateRequired(true)
			} catch (e) {
				setUpdateRequired(false)
			}
		}
		if (nextAppState === "active") {
			checkUpdate()
		}
	}

	useEffect(() => {
		AppState.addEventListener("change", onChangeState);
		return () => {
			AppState.removeEventListener("change", onChangeState);
		};
	}, []);

	if (!resourcesLoaded) {
		return (
			<AppLoading startAsync={fetchResources} onFinish={() => setResourcesLoaded(true)} />
		)
	}
	return (
		<Provider store={store}>
			<SnackbarProvider>
				<DataProviders>
					{updateRequired ?
						<NewUpdateScreen onError={() => setUpdateRequired(false)}/>
						: <AppContainer />}
				</DataProviders>
			</SnackbarProvider>
		</Provider>
	);
}
