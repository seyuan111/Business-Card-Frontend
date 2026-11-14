import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Download, LockKeyhole, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StudioDialog from './StudioDialog';

const DownloadDialog = ({ onClose, onDownload }) => {
  const { isAuthenticated, login } = useAuth();
  const [mode, setMode] = useState('login');
  const [format, setFormat] = useState('png');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', code: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const pendingUser = useRef(null);
  const change = event => setForm(previous => ({ ...previous, [event.target.name]: event.target.value }));
  const submit = async event => {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      if (isAuthenticated) { await onDownload(format); return; }
      const base = import.meta.env.VITE_BACKEND_URL;
      if (mode === 'signup') {
        if (form.password !== form.confirmPassword) throw new Error('Passwords do not match.');
        const response = await axios.post(`${base}/users/signup`, { name: form.name.trim(), email: form.email.trim(), password: form.password });
        pendingUser.current = response.data.user;
        setMode('verify');
        return;
      }
      let response;
      if (mode === 'verify') response = await axios.post(`${base}/users/verify-email`, { code: form.code.trim() });
      else response = await axios.post(`${base}/users/login`, { email: form.email.trim(), password: form.password }, { withCredentials: true });
      if (!response.data.success) throw new Error(response.data.message || 'Authentication failed. Please try again.');
      const token = response.data.token;
      let user = response.data.user || (mode === 'verify' ? pendingUser.current : null);
      if (token && !user) {
        const checked = await axios.get(`${base}/users/check-auth`, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
        user = checked.data.user;
      }
      if (!token || !user) {
        if(mode === 'verify') { setMode('login'); throw new Error('Your email is verified. Log in to continue your download.'); }
        throw new Error('The server did not return a valid login. Please try again.');
      }
      login(user, token);
      await onDownload(format);
    } catch (err) { setError(err.response?.data?.message || err.message || 'Something went wrong. Please try again.'); }
    finally { setBusy(false); }
  };
  return <StudioDialog title={isAuthenticated ? 'Download your business card' : 'Create an account to download'} onClose={() => { if (!busy) onClose(); }}>
    <div className="download-dialog__icon">{isAuthenticated ? <Download size={25} /> : <LockKeyhole size={24} />}</div>
    <p className="studio-eyebrow">YOUR NEXT INTRODUCTION IS READY</p>
    <h2>{isAuthenticated ? 'Take your design with you.' : mode === 'verify' ? 'Check your inbox.' : 'One last step. All yours.'}</h2>
    <p className="studio-description">{isAuthenticated ? 'A high-quality file, ready for your next connection.' : mode === 'verify' ? 'Enter the verification code we emailed you to finish creating your account.' : 'An account is required to download your card. Your design stays right here, and your download starts as soon as you sign in.'}</p>
    <form onSubmit={submit}>
      <fieldset className="download-formats" disabled={busy}><legend>File format</legend>{['png','pdf'].map(value => <label className={format === value ? 'is-selected' : ''} key={value}><input type="radio" name="format" value={value} checked={format === value} onChange={() => setFormat(value)} /><strong>{value.toUpperCase()}</strong><span>{value === 'png' ? '1050 × 600 px' : '3.5 × 2 in · 300 DPI'}</span></label>)}</fieldset>
      {!isAuthenticated && <>
        {mode !== 'verify' && <div className="auth-tabs"><button type="button" disabled={busy} className={mode === 'login' ? 'is-active' : ''} onClick={() => { setMode('login');setError(''); }}>Log in</button><button type="button" disabled={busy} className={mode === 'signup' ? 'is-active' : ''} onClick={() => { setMode('signup');setError(''); }}>Create account</button></div>}
        {mode === 'verify' ? <label className="studio-field">Verification code<input name="code" value={form.code} onChange={change} autoComplete="one-time-code" required autoFocus /></label> : <>
          {mode === 'signup' && <label className="studio-field">Full name<input name="name" value={form.name} onChange={change} autoComplete="name" required /></label>}
          <label className="studio-field">Email address<input name="email" type="email" value={form.email} onChange={change} autoComplete="email" required /></label>
          <label className="studio-field">Password<input name="password" type="password" value={form.password} onChange={change} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} minLength={mode === 'signup' ? 8 : undefined} required /></label>
          {mode === 'signup' && <label className="studio-field">Confirm password<input name="confirmPassword" type="password" value={form.confirmPassword} onChange={change} autoComplete="new-password" minLength={8} required /></label>}
          {mode === 'login' && <Link className="download-forgot" to="/forgot-password">Forgot your password?</Link>}
        </>}
      </>}
      {error && <p className="studio-error" role="alert">{error}</p>}
      <button type="submit" className="studio-button studio-button--primary download-submit" disabled={busy}>{busy ? 'Please wait…' : isAuthenticated ? `Download ${format.toUpperCase()}` : mode === 'signup' ? 'Create account' : mode === 'verify' ? 'Verify & download' : 'Log in & download'}{isAuthenticated ? <Download size={16} /> : <ArrowRight size={16} />}</button>
      <p className="download-dialog__note">Your editable progress is saved in this browser.</p>
    </form>
  </StudioDialog>;
};
DownloadDialog.propTypes = { onClose: PropTypes.func.isRequired, onDownload: PropTypes.func.isRequired };
export default DownloadDialog;