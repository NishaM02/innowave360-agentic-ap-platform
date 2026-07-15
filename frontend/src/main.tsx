import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { Toaster } from "sonner";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <ThemeProvider>
      <App />
      </ThemeProvider>
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  </React.StrictMode>
);