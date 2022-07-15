import i18n from 'i18next'
import { initReactI18next } from 'react-i18next';
import translationEng from './en-US.json';
import translationHindi from './hin-IN.json';

const translationConfig = i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: translationEng },
            hin: { translation: translationHindi }
        },
        lng: 'en',
        fallbackLng: 'en',
    });

export { translationConfig };