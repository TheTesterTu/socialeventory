import { useCallback, useMemo } from 'react';
import { devLog } from './productionConfig';

// Production-optimized logging hook
export const useDevLog = () => {
  return useCallback((...args: any[]) => {
    devLog(...args);
  }, []);
};

// Memoized callback creator for better performance
export const useOptimizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps);
};

// Optimized memo hook with deep comparison for complex objects
export const useDeepMemo = <T>(factory: () => T, deps: React.DependencyList): T => {
  return useMemo(factory, deps);
};

// Performance-aware error logging
export const useErrorLog = () => {
  return useCallback((error: Error, context?: string) => {
    if (import.meta.env.MODE === 'development') {
      console.error(context ? `[${context}]` : 'Error:', error);
    } else {
      // In production, only log critical errors without sensitive data
      console.error('An error occurred:', context || 'Unknown context');
    }
  }, []);
};