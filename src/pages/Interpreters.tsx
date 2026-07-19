import { useTranslation } from 'react-i18next';
import { getInterpreters } from '../services/interpreters';
import type { Lang } from '../types';

export function Interpreters() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Lang;
  const interpreters = getInterpreters();

  return (
    <div className="section">
      <h1>{t('interpretersPage.title')}</h1>
      <p className="page-subtitle">{t('interpretersPage.subtitle')}</p>

      <div className="interpreter-grid">
        {interpreters.map((i) => (
          <div key={i.id} className="interpreter-card">
            <div className="interpreter-avatar-lg">{i.photo}</div>
            <h3>{i.name}</h3>
            <p className="interpreter-years">{t('interpretersPage.yearsExp', { years: i.yearsExperience })}</p>
            <p className="interpreter-bio">{i.bio[lang]}</p>
            <div className="interpreter-langs">
              <span>{t('interpretersPage.languages')}:</span> {i.languages.join(', ')}
            </div>
            <div className="interpreter-rate-badge">
              {t('interpretersPage.hourlyRate')}: {i.hourlyRateKrw.toLocaleString()} {t('common.won')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
