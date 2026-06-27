import { useCallback, useEffect, useState } from 'react';

export function useAsync(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await fetchFn();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'Something went wrong');
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload, setData };
}
