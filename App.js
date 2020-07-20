import React, { useState } from 'react';
import { Provider } from 'react-redux';
import configureStore from './src/store/configureStore';

import AppContainer from './src/navigation'

import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import translations from './src/i18n/i18n.js'

import { Snackbar } from 'react-native-paper';

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
    ]),
  ]);
};

const store = configureStore();

export default App = () => {
  const [resourcesLoaded, setResourcesLoaded] = useState(false)
  const [snackIsVisible ,setSnackIsVisible] = useState(true)

  if (!resourcesLoaded) {
    return (
      <AppLoading startAsync={fetchResources} onFinish={() => setResourcesLoaded(true)} />
    )
  }

  return (
    <Provider store={store}>
      <AppContainer />
      <Snackbar
          visible={snackIsVisible}
          onDismiss={() => setSnackIsVisible(false)}
          action={{
            label: 'Undo',
            onPress: () => {
              // Do something
            },
          }}
        >
          Hey there! I'm a Snackbar.
        </Snackbar>
    </Provider>  
  );
}