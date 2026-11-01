import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const DEMO_EMAIL = 'demo@streamflix.com';

function Login({ onSuccess }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (field) => (event) => {
    setForm({ ...form, [field]: event.target.value });
    setErrors({ ...errors, [field]: '' });
    setServerError('');
  };

  async function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = 'Please enter a valid email address.';
    if (!form.password) nextErrors.password = 'Your password is required.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    try {
      const response = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      onSuccess(data.user);
    } catch (error) {
      setServerError(error.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  }

  return <main className="page-shell">
    <header className="topbar"><div className="brand">STREAMFLIX</div><span className="language">English <span>⌄</span></span></header>
    <section className="login-card" aria-label="Sign in">
      <h1>Sign In</h1>
      {serverError && <div className="server-error" role="alert">{serverError}</div>}
      <form onSubmit={submit} noValidate>
        <label className={errors.email ? 'field error' : 'field'}><input value={form.email} onChange={update('email')} type="email" placeholder="Email or mobile number" aria-label="Email or mobile number" />{errors.email && <small>{errors.email}</small>}</label>
        <label className={errors.password ? 'field error' : 'field'}><input value={form.password} onChange={update('password')} type="password" placeholder="Password" aria-label="Password" />{errors.password && <small>{errors.password}</small>}</label>
        <button className="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
      </form>
      <div className="or"><span>OR</span></div>
      <button className="code-button" type="button">Use a sign-in code</button>
      <a className="forgot" href="#forgot">Forgot password?</a>
      <p className="new-user">New to Streamflix? <a href="#signup">Sign up now.</a></p>
      <p className="recaptcha">This page is protected by Google reCAPTCHA to ensure you're not a bot. <a href="#learn">Learn more.</a></p>
      <p className="demo-hint">Demo: <strong>{DEMO_EMAIL}</strong> / <strong>password123</strong></p>
    </section>
    <footer><span>Questions? Call 000-800-919-1694</span><a href="#faq">FAQ</a><a href="#help">Help Centre</a><a href="#terms">Terms of Use</a><a href="#privacy">Privacy</a></footer>
  </main>;
}

function Dashboard({ user, onSignOut }) {
  return <main className="dashboard"><div className="topbar"><div className="brand">STREAMFLIX</div><button className="signout" onClick={onSignOut}>Sign out</button></div><div className="welcome"><div className="play">▶</div><p className="eyebrow">WELCOME BACK</p><h1>Ready to watch, {user.name}?</h1><p>Pick up where you left off or explore something new.</p><button className="browse">Browse titles</button></div></main>;
}

function App() { const [user, setUser] = useState(null); return user ? <Dashboard user={user} onSignOut={() => setUser(null)} /> : <Login onSuccess={setUser} />; }
createRoot(document.getElementById('root')).render(<App />);
