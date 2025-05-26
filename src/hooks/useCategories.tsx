
import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "@/services/categories";

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getAllCategories(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useCategoryNames = () => {
  return useQuery({
    queryKey: ['category-names'],
    queryFn: () => categoriesService.getCategoryNames(),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};
