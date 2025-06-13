import { createContext, useState, ReactNode } from 'react';
import { translate } from '../utils/translate'; // Your translation utility

type TranslationContextType = {
  language: string;
  setLanguage: (lang: string) => void;
  t: (text: string) => Promise<string>;
};

export const TranslationContext = createContext<TranslationContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: async (text) => text, // Fallback to original text
});

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('fr');

  const t = async (text: string) => {
    try {
      return await translate(text, language);
    } catch (error) {
      console.error("Translation error:", error);
      return text; // Return original text if translation fails
    }
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};