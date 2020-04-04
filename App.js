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

i18n.translations = translations
i18n.locale = Localization.locale
i18n.fallbacks = true;

const fetchResources = async () => {
  await Promise.all([
    Font.loadAsync({
      'nunito-bold': require('./assets/fonts/Nunito-Bold.ttf'),
      'nunito-italic': require('./assets/fonts/Nunito-Italic.ttf'),
      'nunito-regular': require('./assets/fonts/Nunito-Regular.ttf'),
      'nunito-heavy': require('./assets/fonts/Nunito-Black.ttf'), 
    }),
    Asset.loadAsync([
      require('./assets/blue_back.png'),      
    ]),
  ]);
};

const store = configureStore();

export default App = () => {
  const [resourcesLoaded, setResourcesLoaded] = useState(false)

  if (!resourcesLoaded) {
    return (
      <AppLoading startAsync={fetchResources} onFinish={() => setResourcesLoaded(true)} />
    )
  }

  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>  
  );
}