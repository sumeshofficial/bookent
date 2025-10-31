import { useModal } from "../../utils/constants";
import AuthModal from "../../componets/Auth/AuthModal";
import OTPInputForm from "../../componets/Auth/OTPVerify/OTPInputForm";
import Modal from "./Modal";
import EmailInputFormModal from "../../componets/Auth/EmailAuth/EmailInputModal";
import EmailVerification from "../EmailVerification";
import ForgotPasswordInput from "../../componets/Auth/EmailAuth/ForgotPassword/ForgotPasswordInput";
import ForgotPasswordEmail from "../../componets/Auth/EmailAuth/ForgotPassword/ForgotPasswordEmail";
import EditUserProfile from "../../pages/user/EditUserProfile";

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
            content = <ForgotPasswordEmail {...modalData}/>
            break;
        case "forgot-password":
            content = <ForgotPasswordInput {...modalData}/>
            break;
        case "email-verify":
            content = <EmailVerification {...modalData}/>
            break;
        case "edit-profile":
            content = <EditUserProfile {...modalData}/>
            break;
        default:
            return null;
    }

    return <Modal isOpen={!!modalType} onClose={closeModal}>{ content }</Modal>

}

export default ModalManager;
