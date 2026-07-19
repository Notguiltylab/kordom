import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getListings } from '../services/listings';
import { ListingCard } from '../components/listing/ListingCard';

export function Home() {
  const { t } = useTranslation();
  const slogans = [t('home.slogan1'), t('home.slogan2'), t('home.slogan3')];
  const [sloganIdx, setSloganIdx] = useState(0);
  const featured = getListings().filter((l) => l.featured);

  useEffect(() => {
    const timer = setInterval(() => setSloganIdx((i) => (i + 1) % slogans.length), 3800);
    return () => clearInterval(timer);
  }, [slogans.length]);

  return (
    <div>
      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-slogan" key={sloganIdx}>
            {slogans[sloganIdx]}
          </h1>
          <div className="hero-dots">
            {slogans.map((_, i) => (
              <span key={i} className={`hero-dot ${i === sloganIdx ? 'hero-dot-active' : ''}`} />
            ))}
          </div>
          <div className="hero-actions">
            <Link to="/listings" className="btn btn-primary btn-lg">
              {t('home.ctaSearch')}
            </Link>
            <Link to="/signup" className="btn btn-outline btn-lg">
              {t('home.ctaSignup')}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">{t('home.featuresTitle')}</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🇷🇺</div>
            <h3>{t('home.feature1Title')}</h3>
            <p>{t('home.feature1Body')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🗣️</div>
            <h3>{t('home.feature2Title')}</h3>
            <p>{t('home.feature2Body')}</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚖️</div>
            <h3>{t('home.feature3Title')}</h3>
            <p>{t('home.feature3Body')}</p>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="section-header-row">
          <h2 className="section-title">{t('home.featuredTitle')}</h2>
          <Link to="/listings" className="link-more">
            {t('home.viewAll')} →
          </Link>
        </div>
        <div className="listing-grid">
          {featured.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">{t('home.howItWorksTitle')}</h2>
        <ol className="steps">
          <li>
            <span className="step-num">1</span>
            {t('home.how1')}
          </li>
          <li>
            <span className="step-num">2</span>
            {t('home.how2')}
          </li>
          <li>
            <span className="step-num">3</span>
            {t('home.how3')}
          </li>
        </ol>
      </section>

      <section className="section section-trust">
        <h2 className="section-title">{t('home.trustTitle')}</h2>
        <ul className="trust-list">
          <li>✅ {t('home.trust1')}</li>
          <li>✅ {t('home.trust2')}</li>
          <li>✅ {t('home.trust3')}</li>
        </ul>
      </section>
    </div>
  );
}
