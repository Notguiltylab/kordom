import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function SignupChoice() {
  const { t } = useTranslation();
  return (
    <div className="auth-page">
      <div className="signup-choice">
        <h1>{t('auth.signupChoiceTitle')}</h1>
        <div className="signup-choice-grid">
          <Link to="/signup/seeker" className="signup-choice-card">
            <div className="signup-choice-icon">🏡</div>
            <h3>{t('auth.signupSeekerCard')}</h3>
            <p>{t('auth.signupSeekerDesc')}</p>
          </Link>
          <Link to="/signup/agent" className="signup-choice-card">
            <div className="signup-choice-icon">🧑‍💼</div>
            <h3>{t('auth.signupAgentCard')}</h3>
            <p>{t('auth.signupAgentDesc')}</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
