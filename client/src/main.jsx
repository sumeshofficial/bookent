import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import store, { persistor } from "./redux/store.js";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import Loader from "./components/Loader.jsx";
import router from "./routes/Router.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryCliecnt = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <QueryClientProvider client={queryCliecnt}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
