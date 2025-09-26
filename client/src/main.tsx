import { createRoot } from "react-dom/client";
import { Suspense, lazy } from "react";
import "./index.css";

// Lazy load App for instant initial loading
const App = lazy(() => import('./App'));

// Minimal loading spinner for microsecond perceived performance
const LoadingSpinner = () => (
  <div className="min-h-screen bg-blue-50 flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

createRoot(document.getElementById("root")!).render(
  <Suspense fallback={<LoadingSpinner />}>
    <App />
  </Suspense>
);
