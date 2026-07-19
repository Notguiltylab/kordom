import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <div className="brand">🏠 {t('brand')}</div>
          <p>{t('footer.tagline')}</p>
        </div>
        <div className="footer-links">
          <Link to="/terms">{t('footer.terms')}</Link>
          <Link to="/privacy">{t('footer.privacy')}</Link>
          <a href="mailto:contact@kordom.demo">{t('footer.contact')}</a>
        </div>
        <div className="footer-rights">{t('footer.rights')}</div>
      </div>
    </footer>
  );
}
