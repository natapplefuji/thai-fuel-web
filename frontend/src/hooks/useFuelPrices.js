import { useState, useEffect } from 'react';

export default function useFuelPrices() {
  const [prices, setPrices] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrices = async () => {
    setLoading(true);
    setError(null);
    try {
      const base = import.meta.env.VITE_API_URL ?? '';
      const res = await fetch(`${base}/api/fuel-prices`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setPrices(data.prices);
      setMeta({ lastUpdated: data.lastUpdated, currency: data.currency, unit: data.unit, source: data.source });
    } catch (err) {
      setError(err.message || 'Failed to load fuel prices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  return { prices, meta, loading, error, refetch: fetchPrices };
}
