import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  color?: string;
  description?: string;
  is_active: boolean;
  sort_order?: number;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      console.log('🔄 Fetching categories from Supabase...');
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('❌ Error fetching categories:', error);
        throw error;
      }

      console.log('✅ Categories fetched:', data);
      return data || [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
};

export const useCategoryNames = () => {
  const query = useCategories();
  return {
    data: query.data?.map(cat => cat.name) || [],
    isLoading: query.isLoading,
    error: query.error
  };
};