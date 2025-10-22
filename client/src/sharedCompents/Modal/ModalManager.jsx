import { useModal } from "../../utils/constants";
import AuthModal from "../../componets/Auth/AuthModal";
import OTPInputForm from "../../componets/Auth/OTPVerify/OTPInputForm";
import Modal from "./Modal";
import EmailInputFormModal from "../../componets/Auth/EmailAuth/EmailInputModal";
import ForgotPasswordEmailVerification from "../../componets/Auth/EmailAuth/ForgotPasswordEmailVerification";
import ForgotPasswordInput from "../../componets/Auth/EmailAuth/ForgotPasswordInput";

const ModalManager = () => {

    const { modalType, modalData, closeModal } = useModal();

    if(!modalType) return null;

    let content;
    switch(modalType) {
        case "auth":
            content = <AuthModal />
            break;
        case "signup":
            content = <EmailInputFormModal {...modalData} />
            break;
        case "email":
            content = <EmailInputFormModal {...modalData} />
            break;
        case "otp":
            content = <OTPInputForm {...modalData} />
            break;
        case "forgot":
            content = <ForgotPasswordEmailVerification {...modalData}/>
            break;
        case "forgot-password":
            content = <ForgotPasswordInput {...modalData}/>
            break;
        default:
            return null;
    }

    return <Modal isOpen={!!modalType} onClose={closeModal}>{ content }</Modal>

}

export default ModalManager;
