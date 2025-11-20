// Route preloading utility for better performance
const preloadedRoutes = new Set<string>();

export const preloadRoute = (route: string) => {
  if (preloadedRoutes.has(route)) return;
  
  preloadedRoutes.add(route);
  
  // Preload route component
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = route;
  document.head.appendChild(link);
};

export const preloadRouteOnHover = (route: string) => {
  return {
    onMouseEnter: () => preloadRoute(route),
    onTouchStart: () => preloadRoute(route),
  };
};

// Preload critical routes on idle
export const preloadCriticalRoutes = () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      const criticalRoutes = [
        '/events',
        '/nearby',
        '/search',
        '/profile',
      ];
      
      criticalRoutes.forEach(route => preloadRoute(route));
    }, { timeout: 2000 });
  }
};
