
// Security utility functions for production
export const securityUtils = {
  // Content Security Policy configuration
  getCSPDirectives(): string {
    const directives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://afdkepzhghdoeyjncnah.supabase.co wss://afdkepzhghdoeyjncnah.supabase.co",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ];
    
    return directives.join('; ');
  },

  // Sanitize user input
  sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocols
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  },

  // Validate URLs
  isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:', 'mailto:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  },

  // Rate limiting for client-side actions
  createRateLimiter(maxRequests: number, windowMs: number) {
    const requests: number[] = [];
    
    return () => {
      const now = Date.now();
      const windowStart = now - windowMs;
      
      // Remove old requests outside the window
      while (requests.length > 0 && requests[0] < windowStart) {
        requests.shift();
      }
      
      // Check if we've exceeded the limit
      if (requests.length >= maxRequests) {
        return false;
      }
      
      // Add current request
      requests.push(now);
      return true;
    };
  },

  // Generate secure random strings
  generateSecureId(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  },

  // Validate file uploads
  validateFileUpload(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain'
    ];

    if (file.size > maxSize) {
      return { valid: false, error: 'File size exceeds 10MB limit' };
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'File type not allowed' };
    }

    return { valid: true };
  }
};

// Apply security headers if possible (for static hosting)
if (typeof document !== 'undefined') {
  // Add CSP meta tag if not already present
  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = securityUtils.getCSPDirectives();
    document.head.appendChild(cspMeta);
  }
}
