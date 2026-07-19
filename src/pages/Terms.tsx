import { useTranslation } from 'react-i18next';

interface Section {
  heading: string;
  body: string;
}

export function Terms() {
  const { t } = useTranslation();
  const sections = t('terms.sections', { returnObjects: true }) as Section[];

  return (
    <div className="section section-narrow legal-page">
      <h1>{t('terms.title')}</h1>
      <p className="legal-effective">{t('terms.effective')}</p>
      {sections.map((s, idx) => (
        <section key={idx}>
          <h2>{s.heading}</h2>
          <p>{s.body}</p>
        </section>
      ))}
      <p className="legal-draft-notice">{t('terms.draftNotice')}</p>
    </div>
  );
}
