// Performance optimization utilities for production apps

export const memoizedLength = (array: unknown[] | undefined) => {
  return array?.length || 0;
};

// Optimized array check - avoids .length > 0 pattern
export const hasItems = (array: unknown[] | undefined): boolean => {
  return Boolean(array?.length);
};

// Efficient component key generator for arrays without stable IDs
export const generateStableKey = (item: any, index: number, uniqueFields: string[] = ['id', 'slug', 'name']): string => {
  // Try to find a unique field first
  for (const field of uniqueFields) {
    if (item?.[field]) {
      return String(item[field]);
    }
  }
  
  // Fallback to generating a hash from content + index
  const content = JSON.stringify(item);
  return `${content.slice(0, 20)}-${index}`;
};

// Debounced search optimization
export const createDebouncedSearchHook = (delay = 300) => {
  return (value: string, callback: (debouncedValue: string) => void) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      
      return () => clearTimeout(timer);
    }, [value, delay]);
    
    useEffect(() => {
      callback(debouncedValue);
    }, [debouncedValue, callback]);
    
    return debouncedValue;
  };
};

// Memory leak prevention for component cleanup
export const useCleanupEffect = (cleanup: () => void, deps: any[] = []) => {
  useEffect(() => {
    return cleanup;
  }, deps);
};

import { useEffect, useState } from 'react';