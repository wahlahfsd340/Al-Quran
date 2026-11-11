import { useEffect, useState } from 'react';
import { api } from './api.js';

let cache = null;

export function useSurahs() {
  const [surahs, setSurahs] = useState([]);
  const [error, setError] = useState(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let off = false;
    if (!cache) cache = api('/api/surahs');
    cache
      .then((d) => { if (!off) { setSurahs(d); setError(null); } })
      .catch((e) => { cache = null; if (!off) setError(e); });
    return () => { off = true; };
  }, [tick]);

  return { surahs, error, retry: () => { setError(null); setTick((x) => x + 1); } };
}
