import { useModal } from "../../utils/constants";
import AuthModal from "../../components/auth/AuthModal";
import OTPInputForm from "../../components/auth/OTPVerify/OTPInputForm";
import Modal from "./Modal";
import EmailInputFormModal from "../../sharedComponents/user/EmailVerification";
import ForgotPasswordInput from "../../components/auth/EmailAuth/ForgotPassword/ForgotPasswordInput";
import ForgotPasswordEmail from "../../components/auth/EmailAuth/ForgotPassword/ForgotPasswordEmail";
import EditUserProfile from "../../features/user/profile/components/modal/EditUserProfile";
import CropImageModal from "../../components/modal/CropImageModal";
import DeleteConfirmationModal from "../../components/modal/DeleteConfirmationModal";
import ConfirmationModal from "../../components/modal/ConfirmationModal";
import UserBlockModal from "../../components/modal/UserBlockModal";

const ModalManager = () => {
  const { modalType, modalData, closeModal } = useModal();

  if (!modalType) return null;

  let content;
  switch (modalType) {
    case "auth":
      content = <AuthModal />;
      break;
    case "signup":
      content = <EmailInputFormModal {...modalData} />;
      break;
    case "email":
      content = <EmailInputFormModal {...modalData} />;
      break;
    case "otp":
      content = <OTPInputForm {...modalData} />;
      break;
    case "forgot":
      content = <ForgotPasswordEmail {...modalData} />;
      break;
    case "forgot-password":
      content = <ForgotPasswordInput {...modalData} />;
      break;
    case "email-verify":
      content = <EmailVerification {...modalData} />;
      break;
    case "edit-profile":
      content = <EditUserProfile {...modalData} />;
      break;
    case "crop-image":
      content = <CropImageModal {...modalData} />;
      break;
    case "delete-confirmation":
      content = <DeleteConfirmationModal {...modalData} />;
      break;
    case "confirmation":
      content = <ConfirmationModal {...modalData} />;
      break;
    case "user-status-confirmation":
      content = <UserBlockModal {...modalData} />;
      break;
    default:
      return null;
  }

  return (
    <Modal isOpen={!!modalType} onClose={closeModal}>
      {content}
    </Modal>
  );
};

export default ModalManager;
