import { useState, useEffect } from 'react';

const TOKEN_KEY = 'fuel_token';
const BASE = import.meta.env.VITE_API_URL ?? '';

function decodePayload(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored) {
      const payload = decodePayload(stored);
      if (payload && payload.exp * 1000 > Date.now()) {
        setUser({ id: payload.id, username: payload.username });
        setToken(stored);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setAuthLoading(false);
  }, []);

  async function login(username, password) {
    setAuthError(null);
    try {
      const res = await fetch(`${BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Login failed');
        return false;
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch {
      setAuthError('Could not reach server. Please try again.');
      return false;
    }
  }

  async function register(username, password) {
    setAuthError(null);
    try {
      const res = await fetch(`${BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Registration failed');
        return false;
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch {
      setAuthError('Could not reach server. Please try again.');
      return false;
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setAuthError(null);
  }

  return { user, token, authLoading, authError, login, register, logout };
}
