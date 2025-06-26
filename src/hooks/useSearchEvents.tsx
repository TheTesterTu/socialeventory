
import { useUnifiedEvents } from "./useUnifiedEvents";

interface SearchParams {
  query?: string;
  categories?: string[];
  location?: [number, number];
  radius?: number;
  dateRange?: [string, string];
}

export const useSearchEvents = (params: SearchParams) => {
  return useUnifiedEvents({
    searchQuery: params.query,
    category: params.categories,
    // Note: location and dateRange filtering would need to be implemented
    // in the unified events hook if needed
  });
};
