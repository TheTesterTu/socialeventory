
// Application constants
export const APP_CONFIG = {
  name: 'SocialEventory',
  description: 'Discover and share amazing events in your community',
  version: '1.0.0',
  domain: 'socialeventory.com',
  support_email: 'support@socialeventory.com',
  social: {
    twitter: '@socialeventory',
    instagram: '@socialeventory',
    facebook: 'socialeventory'
  }
};

export const API_ENDPOINTS = {
  events: '/api/events',
  users: '/api/users',
  auth: '/api/auth',
  upload: '/api/upload'
};

export const PAGINATION = {
  default_page_size: 20,
  max_page_size: 100
};

export const CACHE_KEYS = {
  events: 'events',
  user_profile: 'user_profile',
  categories: 'categories',
  blog_posts: 'blog_posts'
};

export const EVENT_CATEGORIES = [
  'Music',
  'Technology', 
  'Food & Drink',
  'Art & Culture',
  'Sports',
  'Business',
  'Health & Wellness',
  'Education',
  'Fashion',
  'Travel'
];

export const ACCESSIBILITY_FEATURES = [
  'wheelchairAccessible',
  'familyFriendly',
  'signLanguageInterpreted',
  'audioDescribed',
  'largePrint'
];

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' }
];
