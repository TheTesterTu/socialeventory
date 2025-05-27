
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { analytics } from "@/services/analytics";

export const NotFoundRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Log the 404 for analytics and debugging
    console.warn(`404 - Page not found: ${location.pathname}`);
    analytics.track('404_error', { 
      path: location.pathname,
      referrer: document.referrer,
      user_agent: navigator.userAgent
    });
    
    // Redirect to home after a brief delay
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.pathname, navigate]);

  return null;
};
