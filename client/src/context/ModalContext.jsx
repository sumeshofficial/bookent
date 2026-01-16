import { useState } from "react";
import { ModalContext } from "../utils/constants";
import { useDispatch } from "react-redux";
import { clearError } from "../app/userSlice";
import PropTypes from "prop-types";

const ModalProvider = ({ children }) => {
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);

  const dispatch = useDispatch();

  const openModal = (type, data = null) => {
    setModalData(data);
    setModalType(type);
  };

  const closeModal = () => {
    setModalData(null);
    setModalType(null);
    dispatch(clearError());
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

ModalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ModalProvider;
