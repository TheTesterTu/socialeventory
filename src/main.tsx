import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker in production only
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  import("./pwa-register").then(({ registerServiceWorker }) => {
    registerServiceWorker();
  });
}

