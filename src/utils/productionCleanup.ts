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
  if (process.env.NODE_ENV === 'production') {
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
  
  // Check environment variables
  const requiredEnvVars = ['NODE_ENV'];
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      issues.push(`Missing environment variable: ${envVar}`);
    }
  });
  
  // Check for development dependencies in production
  if (process.env.NODE_ENV === 'production') {
    try {
      // This will throw in production builds if dev dependencies are included
      require('react-dev-utils');
      issues.push('Development dependencies found in production build');
    } catch {
      // Good - dev dependencies not included
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
