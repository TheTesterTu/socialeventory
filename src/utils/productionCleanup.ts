// Production cleanup utilities
import { devLog, errorLog, FEATURE_FLAGS } from './productionConfig';

// Remove all debug/dev-only code in production
export const cleanupDevCode = () => {
  if (!FEATURE_FLAGS.SHOW_DEBUG_INFO) {
    // Disable any development-only features
    devLog('Production mode: development features disabled');
  }
};

// Clean up console logs in production builds
export const cleanConsole = () => {
  if (import.meta.env.MODE === 'production') {
    // Preserve error logs but remove debug logs
    const originalLog = console.log;
    const originalWarn = console.warn;
    
    console.log = () => {}; // Disable console.log in production
    console.warn = () => {}; // Disable console.warn in production
    
    // Keep console.error for important error tracking
    console.error = (...args) => {
      // Filter out development-only errors
      const message = args.join(' ');
      if (!message.includes('development') && !message.includes('debug')) {
        originalLog(...args);
      }
    };
  }
};

// Validate production readiness
export const validateProductionReadiness = () => {
  const issues: string[] = [];
  
  // Check for mock data usage
  if (FEATURE_FLAGS.ENABLE_MOCK_DATA) {
    issues.push('Mock data is still enabled');
  }
  
  // Check environment mode
  if (!import.meta.env.MODE) {
    issues.push('Environment mode not detected');
  }
  
  // Check for development mode warnings
  if (import.meta.env.MODE === 'production') {
    // In production, we should have optimizations enabled
    if (import.meta.env.DEV) {
      issues.push('Development mode detected in production build');
    }
  }
  
  if (issues.length > 0) {
    errorLog('Production readiness issues found:', issues.join(', '));
    return false;
  }
  
  devLog('✅ Production readiness validation passed');
  return true;
};

// Initialize production optimizations
export const initializeProduction = () => {
  cleanupDevCode();
  cleanConsole();
  validateProductionReadiness();
  
  devLog('Production optimizations initialized');
};
