import { useState, useEffect } from 'react';

const BASE = import.meta.env.VITE_API_URL ?? '';

export default function useExpenses(token, onAuthError) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchExpenses() {
    if (!token) {
      setExpenses([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}/api/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        onAuthError();
        return;
      }
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setExpenses(data.expenses);
    } catch (err) {
      setError(err.message || 'Failed to load expenses.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExpenses();
  }, [token]);

  async function addExpense(trip) {
    const res = await fetch(`${BASE}/api/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(trip),
    });
    if (res.status === 401) {
      onAuthError();
      return;
    }
    if (!res.ok) return;
    const data = await res.json();
    setExpenses((prev) => [data.expense, ...prev]);
  }

  async function removeExpense(id) {
    const res = await fetch(`${BASE}/api/expenses/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) {
      onAuthError();
      return;
    }
    if (!res.ok) return;
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  return { expenses, loading, error, addExpense, removeExpense, refetch: fetchExpenses };
}
