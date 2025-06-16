
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import production utilities
import "./utils/errorReporting";
import { performanceMonitor } from "./utils/performanceMonitor";

// Initialize performance monitoring in production
if (import.meta.env.PROD) {
  performanceMonitor.monitorWebVitals();
}

// Measure initial app load time
const startTime = performance.now();

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Record app initialization time
window.addEventListener('load', () => {
  const loadTime = performance.now() - startTime;
  performanceMonitor.recordMetric('app_initialization', loadTime);
});
