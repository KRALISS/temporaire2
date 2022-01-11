import { language  } from 'react-native-languages';
import i18n from 'i18n-js';

import fr from './translations/fr.json';
import en from './translations/en.json';

i18n.locale = language; //RNLanguages.language;
i18n.fallbacks = true;
i18n.translations = { fr, en };

export default i18n;