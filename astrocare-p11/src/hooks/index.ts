// AstroCare P11 — Custom Hooks

import { useState, useEffect, useCallback } from 'react';
import type { AsyncState } from '../types';
import { getISONow } from '../utils';

// Generic async data hook
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = []
): AsyncState<T> & { refetch: () => void } {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    status: 'idle',
    error: null,
    lastUpdated: null,
  });

  const fetch = useCallback(async () => {
    setState((s) => ({ ...s, status: 'loading', error: null }));
    try {
      const data = await fetcher();
      setState({ data, status: 'success', error: null, lastUpdated: getISONow() });
    } catch (err) {
      setState((s) => ({
        ...s,
        status: 'error',
        error: err instanceof Error ? err.message : 'Unknown error',
      }));
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refetch: fetch };
}

// Hook for window size (responsive layouts)
export function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return size;
}

// Hook for localStorage values
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [key]
  );

  return [value, set] as const;
}

// Hook for countdown timer (cognitive tests)
export function useTimer(durationMs: number) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const start = useCallback(() => {
    setStartTime(Date.now());
    setElapsed(0);
    setRunning(true);
  }, []);

  const stop = useCallback(() => {
    setRunning(false);
    return elapsed;
  }, [elapsed]);

  const reset = useCallback(() => {
    setRunning(false);
    setElapsed(0);
    setStartTime(null);
  }, []);

  useEffect(() => {
    if (!running || !startTime) return;
    const id = setInterval(() => {
      const e = Date.now() - startTime;
      setElapsed(e);
      if (e >= durationMs) {
        setRunning(false);
        clearInterval(id);
      }
    }, 50);
    return () => clearInterval(id);
  }, [running, startTime, durationMs]);

  return { elapsed, running, start, stop, reset, remaining: Math.max(0, durationMs - elapsed) };
}
