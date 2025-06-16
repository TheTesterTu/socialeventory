
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { errorReporter } from '@/utils/errorReporting';

interface ProductionSafeQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryFn'> {
  queryFn: () => Promise<T>;
  fallbackData?: T;
  silentFail?: boolean;
}

export function useProductionSafeQuery<T>({
  queryFn,
  fallbackData,
  silentFail = false,
  ...options
}: ProductionSafeQueryOptions<T>) {
  const wrappedQueryFn = async (): Promise<T> => {
    try {
      return await queryFn();
    } catch (error) {
      // Report error for monitoring
      errorReporter.reportError(
        error as Error,
        { 
          queryKey: options.queryKey,
          context: 'react-query'
        }
      );

      if (silentFail && fallbackData !== undefined) {
        return fallbackData;
      }
      
      throw error;
    }
  };

  return useQuery({
    ...options,
    queryFn: wrappedQueryFn,
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors (client errors)
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      // Retry up to 2 times for other errors
      return failureCount < 2;
    },
    staleTime: options.staleTime || 5 * 60 * 1000, // 5 minutes default
    gcTime: options.gcTime || 10 * 60 * 1000, // 10 minutes default
  });
}
