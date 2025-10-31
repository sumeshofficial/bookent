import ModalManager from "./sharedCompents/Modal/ModalManager";
import ModalProvider from "./context/ModalContext";
import DynamicRoutes from "./Routes/DynamicRoutes";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/FormContext";

function App() {
  return (
    <>
      <AuthProvider>
        <ModalProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <ModalManager />
          <DynamicRoutes />
        </ModalProvider>
      </AuthProvider>
    </>
  );
}

export default App;
