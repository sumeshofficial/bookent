import ModalManager from "./sharedCompents/Modal/ModalManager";
import ModalProvider from "./context/ModalContext";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/FormContext";
import { Outlet } from "react-router-dom";
import ErrorBoundary from "./componets/ErrorBoundary";

function App() {
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
