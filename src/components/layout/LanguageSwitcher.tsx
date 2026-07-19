import { useTranslation } from 'react-i18next';

const LANGS: { code: 'ko' | 'en' | 'ru'; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="lang-switcher">
      {LANGS.map((l) => (
        <button
          key={l.code}
          className={`lang-btn ${i18n.language === l.code ? 'lang-btn-active' : ''}`}
          onClick={() => i18n.changeLanguage(l.code)}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
