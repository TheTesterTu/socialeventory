
/**
 * Unified category color system
 * Single source of truth for all category-related colors
 */

export const categoryColorMap = {
  'Music': 'music',
  'Technology': 'tech', 
  'Food & Drink': 'food',
  'Art & Culture': 'art',
  'Sports': 'sports',
  'Business': 'business',
  'Entertainment': 'music',
  'Education': 'tech',
  'Health': 'food',
  'Community': 'art',
  'Family': 'food',
  'Networking': 'business',
  'Workshop': 'tech',
  'Conference': 'business',
  'Festival': 'music',
  'Exhibition': 'art',
  'Outdoor': 'sports',
  'Fitness': 'sports',
  'Gaming': 'tech',
  'Travel': 'art',
} as const;

export type CategoryColorKey = keyof typeof categoryColorMap;
export type CategoryColorValue = typeof categoryColorMap[CategoryColorKey];

/**
 * Get category color class for a given category
 */
export const getCategoryColor = (category: string): CategoryColorValue => {
  return categoryColorMap[category as CategoryColorKey] || 'default';
};

/**
 * Get category text color class
 */
export const getCategoryTextColor = (category: string): string => {
  const colorKey = getCategoryColor(category);
  return `category-${colorKey}`;
};

/**
 * Get category background color class
 */
export const getCategoryBgColor = (category: string): string => {
  const colorKey = getCategoryColor(category);
  return `bg-category-${colorKey}`;
};

/**
 * Get category border color class
 */
export const getCategoryBorderColor = (category: string): string => {
  const colorKey = getCategoryColor(category);
  return `border-category-${colorKey}`;
};

/**
 * Get Tailwind color class for categories (fallback for compatibility)
 */
export const getCategoryTailwindColor = (category: string): string => {
  const colorMap = {
    'music': 'bg-purple-500',
    'tech': 'bg-blue-500', 
    'food': 'bg-green-500',
    'art': 'bg-pink-500',
    'sports': 'bg-orange-500',
    'business': 'bg-gray-500',
    'default': 'bg-primary',
  };
  
  const colorKey = getCategoryColor(category);
  return colorMap[colorKey] || colorMap.default;
};
