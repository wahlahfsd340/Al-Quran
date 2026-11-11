import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { useLang } from '../i18n.jsx';

export default function Login() {
  const { login, register } = useAuth();
  const { t, tErr } = useLang();
  const nav = useNavigate();
  const [isNew, setIsNew] = useState(false);
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      if (isNew) await register(f.name, f.email, f.password); else await login(f.email, f.password);
      nav('/');
    } catch (x) { setErr(tErr(x)); }
    setBusy(false);
  };

  return (
    <section className="panel narrow">
      <h1 className="section-title">{isNew ? t('signup_title') : t('login_title')}</h1>
      <form onSubmit={submit} className="form">
        {isNew && (
          <label>{t('your_name')}
            <input value={f.name} onChange={set('name')} required minLength={2} maxLength={60} autoComplete="name" />
          </label>
        )}
        <label>{t('col_email')}
          <input type="email" dir="ltr" value={f.email} onChange={set('email')} required autoComplete="email" />
        </label>
        <label>{t('password')} {isNew && <small>{t('pw_hint')}</small>}
          <input type="password" dir="ltr" value={f.password} onChange={set('password')} required minLength={isNew ? 8 : 1} autoComplete={isNew ? 'new-password' : 'current-password'} />
        </label>
        {err && <p className="error">{err}</p>}
        <button className="btn primary" disabled={busy}>{busy ? t('wait') : isNew ? t('do_signup') : t('do_login')}</button>
      </form>
      <p className="hint center">{t('privacy')}</p>
      <p className="center">
        <button className="linklike" onClick={() => { setIsNew(!isNew); setErr(''); }}>{isNew ? t('to_login') : t('to_signup')}</button>
      </p>
      <p className="center"><Link to="/">{t('back_home')}</Link></p>
    </section>
  );
}
