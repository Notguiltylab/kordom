import { useTranslation } from 'react-i18next';

interface Section {
  heading: string;
  body: string;
}

export function Privacy() {
  const { t } = useTranslation();
  const sections = t('privacy.sections', { returnObjects: true }) as Section[];

  return (
    <div className="section section-narrow legal-page">
      <h1>{t('privacy.title')}</h1>
      <p className="legal-effective">{t('privacy.effective')}</p>
      {sections.map((s, idx) => (
        <section key={idx}>
          <h2>{s.heading}</h2>
          <p>{s.body}</p>
        </section>
      ))}
      <p className="legal-draft-notice">{t('privacy.draftNotice')}</p>
    </div>
  );
}
