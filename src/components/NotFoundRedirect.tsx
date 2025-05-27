
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const NotFoundRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Log the 404 for debugging
    console.warn(`404 - Page not found: ${location.pathname}`);
    
    // Redirect to home after a brief delay
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.pathname, navigate]);

  return null;
};
