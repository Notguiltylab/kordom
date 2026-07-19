import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      login(email, password);
      navigate('/');
    } catch {
      setError(t('auth.loginError'));
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>{t('auth.loginTitle')}</h1>
        <label>
          {t('auth.email')}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          {t('auth.password')}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block">
          {t('auth.loginBtn')}
        </button>
        <p className="auth-switch">
          {t('auth.noAccount')} <Link to="/signup">{t('nav.signup')}</Link>
        </p>

        <div className="demo-accounts-box">
          <p className="demo-title">{t('auth.demoAccountsTitle')}</p>
          <p>{t('auth.demoAdmin')}</p>
          <p>{t('auth.demoAgent')}</p>
          <p>{t('auth.demoAgentPending')}</p>
          <p>{t('auth.demoSeeker')}</p>
        </div>
      </form>
    </div>
  );
}
