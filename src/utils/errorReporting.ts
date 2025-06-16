interface ErrorReport {
  id: string;
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  userId?: string;
  sessionId?: string;
}

class ErrorReportingService {
  private maxStoredErrors = 50;
  private storageKey = 'error_reports';

  reportError(error: Error, context?: Record<string, any>) {
    try {
      const errorReport: ErrorReport = {
        id: this.generateErrorId(),
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        userId: this.getUserId(),
        sessionId: this.getSessionId(),
        ...context
      };

      this.storeError(errorReport);
      
      // In development, also log to console
      if (import.meta.env.DEV) {
        console.error('Error reported:', errorReport);
      }

      return errorReport.id;
    } catch (reportingError) {
      // If error reporting fails, at least log to console in dev
      if (import.meta.env.DEV) {
        console.error('Failed to report error:', reportingError);
        console.error('Original error:', error);
      }
      return null;
    }
  }

  getStoredErrors(): ErrorReport[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  clearStoredErrors() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      // Silently fail
    }
  }

  exportErrors(): string {
    const errors = this.getStoredErrors();
    return JSON.stringify(errors, null, 2);
  }

  private storeError(errorReport: ErrorReport) {
    try {
      const existingErrors = this.getStoredErrors();
      existingErrors.push(errorReport);
      
      // Keep only the most recent errors
      const recentErrors = existingErrors.slice(-this.maxStoredErrors);
      localStorage.setItem(this.storageKey, JSON.stringify(recentErrors));
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUserId(): string | undefined {
    try {
      return sessionStorage.getItem('user_id') || undefined;
    } catch {
      return undefined;
    }
  }

  private getSessionId(): string {
    try {
      let sessionId = sessionStorage.getItem('session_id');
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        sessionStorage.setItem('session_id', sessionId);
      }
      return sessionId;
    } catch {
      return 'unknown';
    }
  }
}

export const errorReporter = new ErrorReportingService();

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  errorReporter.reportError(
    new Error(`Unhandled promise rejection: ${event.reason}`),
    { type: 'unhandled_promise_rejection' }
  );
});

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  errorReporter.reportError(
    new Error(event.message),
    { 
      type: 'uncaught_error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    }
  );
});
