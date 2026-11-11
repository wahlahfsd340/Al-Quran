import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { useLang } from '../i18n.jsx';

export default function Header() {
  const { user, logout } = useAuth();
  const { t, lang, toggle } = useLang();
  return (
    <nav className="topbar" aria-label="Main">
      <Link to="/" className="brand">{t('brand')}</Link>
      <span className="topbar-right">
        <button className="btn small lang" onClick={toggle} lang={lang === 'en' ? 'ur' : 'en'}>
          {lang === 'en' ? 'اردو' : 'English'}
        </button>
        {user ? (
          <>
            <span className="hello">{t('hello', { name: user.name })}</span>
            <button className="btn small" onClick={logout}>{t('logout')}</button>
          </>
        ) : (
          <Link to="/login" className="btn small">{t('login_btn')}</Link>
        )}
      </span>
    </nav>
  );
}
