import { translate } from '@vitalets/google-translate-api';

export const translate = async (text: string, targetLang: string) => {
  const result = await translate(text, { to: targetLang });
  return result.text;
};