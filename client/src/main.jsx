import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import store, { persistor } from "./app/store.js";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import Loader from "./components/Loader.jsx";
import router from "./routes/index.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SocketProvider } from "./context/SocketProvider.jsx";

const queryClient = new QueryClient();

if (typeof window !== "undefined") {
  window.__REACT_QUERY_DEVTOOLS_GLOBAL_HOOK__ = {
    queryClient,
  };
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <PersistGate loading={<Loader />} persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </PersistGate>
      </SocketProvider>
    </Provider>
  </StrictMode>
);
