import { translate as googleTranslate } from '@vitalets/google-translate-api';

export const translate = async (text: string, targetLang: string) => {
  const result = await googleTranslate(text, { to: targetLang });
  return result.text;
};