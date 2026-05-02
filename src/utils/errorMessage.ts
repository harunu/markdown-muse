import trMessages from '../i18n/locales/tr.json';
import enMessages from '../i18n/locales/en.json';

type MessageMap = Record<string, Record<string, Record<string, string>>>;

const messages: Record<string, MessageMap> = {
  tr: trMessages as unknown as MessageMap,
  en: enMessages as unknown as MessageMap,
};

export function getErrorMessage(
  code: string,
  section: string = 'common',
  language: string = localStorage.getItem('language') || 'tr'
): string {
  const lang = messages[language] || messages['tr'];
  const sectionErrors = lang[section]?.errors || lang['common']?.errors || {};
  return sectionErrors[code] || lang['common']?.errors?.SERVER_ERROR || code;
}

export default getErrorMessage;
