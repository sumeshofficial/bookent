import ModalManager from "./sharedComponents/modal/ModalManager";
import ModalProvider from "./context/ModalContext";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/FormContext";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import useOfflineTracker from "./hooks/useOfflineTracker";
import useGlobalSeatEvents from "./hooks/useGlobalSeatEvents";

function App() {
  useOfflineTracker();
  useGlobalSeatEvents();

  return (
    <>
      <AuthProvider>
        <ModalProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <ModalManager />
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </ModalProvider>
      </AuthProvider>
    </>
  );
}

export default App;
