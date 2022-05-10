import React from 'react';
import {I18nManager} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import GlobalFont from 'react-native-global-font';
import en from '../../assets/locales/en.json';
import ar from '../../assets/locales/ar.json';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async cb => {
    let lang = await AsyncStorage.getItem('lang');
    if (lang == null) {
      lang = 'en';
      restart = false;
      await AsyncStorage.setItem('lang', lang);
    }
    lang == 'en'
      ? GlobalFont.applyGlobal('Roboto')
      : GlobalFont.applyGlobal('Helvetica Arabic');
    I18nManager.forceRTL(lang == 'ar');
    cb(lang);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    returnObjects: true,
    resources: {
      en: {
        translation: en,
      },
      ar: {
        translation: ar,
      },
    },
  });
export {i18n};
