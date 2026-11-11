import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n.jsx';
import { api } from '../api.js';

const fmt = (d) => (d ? new Date(d).toLocaleString() : '-');

export default function Admin() {
  const { t, tErr } = useLang();
  const [key, setKey] = useState('');
  const [users, setUsers] = useState(null);
  const [msgs, setMsgs] = useState([]);
  const [err, setErr] = useState('');

  const load = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const headers = { 'x-admin-key': key };
      const u = await api('/api/admin/users', { headers });
      const m = await api('/api/admin/messages', { headers }).catch(() => []);
      setUsers(u); setMsgs(m);
    } catch (x) { setErr(tErr(x)); }
  };

  return (
    <section className="panel">
      <h1 className="section-title">{t('admin_title')}</h1>
      {!users ? (
        <form className="form narrow-form" onSubmit={load}>
          <label>{t('admin_key')}
            <input type="password" dir="ltr" value={key} onChange={(e) => setKey(e.target.value)} required />
          </label>
          {err && <p className="error">{err}</p>}
          <button className="btn primary">{t('show')}</button>
        </form>
      ) : (
        <>
          <h2>{t('users')} ({users.length})</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>{t('col_name')}</th><th>{t('col_email')}</th><th>{t('col_logins')}</th><th>{t('col_last')}</th><th>{t('col_created')}</th></tr></thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}><td>{u.name}</td><td dir="ltr">{u.email}</td><td>{u.loginCount}</td><td>{fmt(u.lastLoginAt)}</td><td>{fmt(u.createdAt)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <h2>{t('messages')} ({msgs.length})</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>{t('col_name')}</th><th>{t('col_email')}</th><th>{t('col_msg')}</th><th>{t('col_time')}</th></tr></thead>
              <tbody>
                {msgs.map((m) => (
                  <tr key={m._id}><td>{m.name}</td><td dir="ltr">{m.email}</td><td className="wrap">{m.message}</td><td>{fmt(m.createdAt)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <p className="center"><Link to="/">{t('back_home')}</Link></p>
    </section>
  );
}
