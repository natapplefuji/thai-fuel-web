import { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import styles from './AuthModal.module.css';

export default function AuthModal({ authError, onLogin, onRegister, onClose }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (mode === 'register' && password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    if (mode === 'login') {
      await onLogin(username, password);
    } else {
      await onRegister(username, password);
    }
    setSubmitting(false);
  };

  const displayError = localError || authError;
  const canSubmit = username.trim() && password && !submitting;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <Card className={styles.modal}>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>

          <div className={styles.header}>
            <span className={styles.icon}>⛽</span>
            <h2 className={styles.title}>Thai Fuel Calc</h2>
          </div>

          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
              onClick={() => { setMode('login'); setLocalError(null); }}
            >
              Log In
            </button>
            <button
              className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
              onClick={() => { setMode('register'); setLocalError(null); }}
            >
              Register
            </button>
          </div>

          {displayError && (
            <div className={styles.error}>{displayError}</div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="auth-username">Username</label>
              <input
                id="auth-username"
                className={styles.input}
                type="text"
                autoComplete="username"
                placeholder="e.g. somchai_99"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                className={styles.input}
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {mode === 'register' && (
              <div className={styles.field}>
                <label className={styles.label} htmlFor="auth-confirm">Confirm Password</label>
                <input
                  id="auth-confirm"
                  className={styles.input}
                  type="password"
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}

            <Button type="submit" disabled={!canSubmit} size="lg">
              {submitting ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
