import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

export const LanguageSwitcher: React.FC = () => {
  const { language, switchLanguage } = useLanguage();

  return (
    <div className="flex gap-1">
      <button
        data-testid="lang-switch-tr"
        onClick={() => switchLanguage('tr')}
        className={`px-2 py-1 text-xs rounded ${language === 'tr' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      >
        TR
      </button>
      <button
        data-testid="lang-switch-en"
        onClick={() => switchLanguage('en')}
        className={`px-2 py-1 text-xs rounded ${language === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
