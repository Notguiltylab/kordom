import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signupAgent } from '../services/auth';
import { useAuth } from '../context/AuthContext';

export function SignupAgent() {
  const { t } = useTranslation();
  const { refresh } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseFileName, setLicenseFileName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      signupAgent({
        email,
        password,
        name,
        phone,
        agencyName,
        licenseNumber,
        licenseFileName: licenseFileName || 'license.pdf',
      });
      refresh();
      navigate('/agent');
    } catch {
      setError(t('auth.emailTakenError'));
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>{t('auth.signupAgentCard')}</h1>
        <label>
          {t('auth.name')}
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          {t('auth.email')}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          {t('auth.password')}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label>
          {t('auth.phone')}
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <label>
          {t('auth.agencyName')}
          <input value={agencyName} onChange={(e) => setAgencyName(e.target.value)} required />
        </label>
        <label>
          {t('auth.licenseNumber')}
          <input value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} required />
        </label>
        <label>
          {t('auth.licenseFile')}
          <input
            type="file"
            onChange={(e) => setLicenseFileName(e.target.files?.[0]?.name ?? '')}
          />
        </label>
        <p className="hint-text">{licenseFileName || t('auth.noFileChosen')}</p>

        <p className="pending-notice">{t('auth.agentPendingNotice')}</p>

        {error && <p className="form-error">{error}</p>}
        <p className="agree-terms-line">
          {t('auth.agreeTermsPrefix')} <Link to="/terms">{t('auth.agreeTermsLink')}</Link> {t('auth.agreeTermsAnd')}{' '}
          <Link to="/privacy">{t('auth.agreePrivacyLink')}</Link>
          {t('auth.agreeTermsSuffix')}
        </p>
        <button type="submit" className="btn btn-primary btn-block">
          {t('auth.submit')}
        </button>
      </form>
    </div>
  );
}
