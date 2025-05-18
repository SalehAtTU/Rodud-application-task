import * as Localization from 'expo-localization';
import en from './locales/en.json';
import ar from './locales/ar.json';
import ur from './locales/ur.json';

// Our bundles
const bundles = { en, ar, ur };

// Pick device language (e.g. "en_US" → "en")
let locale = Localization.locale.split('-')[0];
if (!bundles[locale]) locale = 'en'; // default to English

/**
 * Change the locale at runtime (e.g. on a settings screen)
 */
export function setLocale(lng) {
  if (bundles[lng]) locale = lng;
}

/**
 * Simple translate helper
 * @param {string} key  e.g. "my_shipments"
 * @param {object} [vars]  e.g. { status: "Delivered" }
 */
export function t(key, vars = {}) {
  // look up in current bundle, then fall back to English, then to the key itself
  let str = bundles[locale][key] ?? bundles.en[key] ?? key;

  // simple interpolation for {{var}}
  Object.keys(vars).forEach((k) => {
    str = str.replaceAll(`{{${k}}}`, vars[k]);
  });

  return str;
}
