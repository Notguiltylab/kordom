import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand">
          🏠 {t('brand')}
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="menu">
          ☰
        </button>

        <nav className={`site-nav ${menuOpen ? 'site-nav-open' : ''}`} onClick={() => setMenuOpen(false)}>
          <Link to="/listings">{t('nav.listings')}</Link>
          <Link to="/interpreters">{t('nav.interpreters')}</Link>
          <Link to="/columns">{t('nav.columns')}</Link>

          {user && <Link to="/my-requests">{t('nav.myRequests')}</Link>}
          {user?.role === 'agent' && <Link to="/agent">{t('nav.agentDashboard')}</Link>}
          {user?.role === 'admin' && <Link to="/admin">{t('nav.adminDashboard')}</Link>}

          <div className="site-nav-divider" />

          <LanguageSwitcher />

          {user ? (
            <div className="nav-user">
              <span className="nav-hello">{t('nav.hello', { name: user.name })}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div className="nav-user">
              <Link className="btn btn-ghost btn-sm" to="/login">
                {t('nav.login')}
              </Link>
              <Link className="btn btn-primary btn-sm" to="/signup">
                {t('nav.signup')}
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
