import { useState } from "react";
import { ModalContext } from "../utils/constants";

const ModalProvider = ({ children }) => {
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);

  const openModal = (type, data = null) => {
    setModalData(data);
    setModalType(type);
  };

  const closeModal = () => {
    setModalData(null);
    setModalType(null);
  };

  return (
    <ModalContext.Provider
      value={{
        modalData,
        modalType,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
