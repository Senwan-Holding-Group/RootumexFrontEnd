import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AuthProvider from "./api/Auth/AuthProvider.tsx";
import Router from "./Router/Router.tsx";
import StateProvider from "./context/StateProvider.tsx";
import QueryClientWithMutationCache from "./components/QueryClientWithMutationCache.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <StateProvider>
        <QueryClientWithMutationCache>
          <ReactQueryDevtools position="top" initialIsOpen={false} />
          <Router />
        </QueryClientWithMutationCache>
      </StateProvider>
    </AuthProvider>
  </StrictMode>
);
