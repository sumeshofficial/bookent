import ModalManager from "./sharedComponents/modal/ModalManager";
import ModalProvider from "./context/ModalContext";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/FormContext";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import useOfflineTracker from "./hooks/useOfflineTracker";
import useGlobalSeatEvents from "./hooks/useGlobalSeatEvents";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function App() {
  useOfflineTracker();
  useGlobalSeatEvents();

  return (
    <AuthProvider>
      <ModalProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <ModalManager />
        <ErrorBoundary>
          <PayPalScriptProvider
            options={{ clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID }}
          >
            <Outlet />
          </PayPalScriptProvider>
        </ErrorBoundary>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
