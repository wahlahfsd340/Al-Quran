import { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { useLang } from '../i18n.jsx';
import { api } from '../api.js';

export default function ContactForm() {
  const { user } = useAuth();
  const { t, tErr } = useLang();
  const [f, setF] = useState({ name: '', email: '', message: '', website: '' });
  const [state, setState] = useState({ busy: false, ok: false, err: '' });
  const name = f.name || user?.name || '';
  const email = f.email || user?.email || '';
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, ok: false, err: '' });
    try {
      await api('/api/contact', { method: 'POST', body: { name, email, message: f.message, website: f.website } });
      setState({ busy: false, ok: true, err: '' });
      setF({ name: '', email: '', message: '', website: '' });
    } catch (x) {
      setState({ busy: false, ok: false, err: tErr(x) });
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <h3>{t('form_title')}</h3>
      <label>{t('your_name')}
        <input value={name} onChange={set('name')} required minLength={2} maxLength={60} autoComplete="name" />
      </label>
      <label>{t('your_gmail')}
        <input type="email" dir="ltr" value={email} onChange={set('email')} required autoComplete="email" />
      </label>
      <label>{t('your_msg')}
        <textarea rows={4} value={f.message} onChange={set('message')} required minLength={3} maxLength={2000} />
      </label>
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={f.website} onChange={set('website')} />
      {state.err && <p className="error">{state.err}</p>}
      {state.ok && <p className="success">{t('sent')}</p>}
      <button className="btn primary" disabled={state.busy}>{state.busy ? t('sending') : t('send')}</button>
    </form>
  );
}
