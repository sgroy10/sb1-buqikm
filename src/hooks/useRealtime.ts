import { useEffect, useState } from 'react';
import { ref, onValue, off, Database } from 'firebase/database';
import { rtdb } from '../lib/firebase';

export function useRealtime<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!path) {
      setLoading(false);
      return;
    }

    try {
      const dbRef = ref(rtdb, path);

      const unsubscribe = onValue(
        dbRef,
        (snapshot) => {
          setData(snapshot.val());
          setLoading(false);
        },
        (error) => {
          console.error('Realtime Database Error:', error);
          setError(error);
          setLoading(false);
        }
      );

      return () => {
        unsubscribe();
      };
    } catch (err) {
      console.error('Error setting up realtime listener:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setLoading(false);
    }
  }, [path]);

  return { data, loading, error };
}