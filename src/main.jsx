import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

// Initialize i18n before React mounts
import "./i18n";

// Global styles (design system)
import "./style.css";

// Provide auth context to the whole app
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter basename="/esm-repo-jdid">
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);