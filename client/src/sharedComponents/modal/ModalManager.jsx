import { useModal } from "../../utils/constants";
import AuthModal from "../../components/auth/AuthModal";
import OTPInputForm from "../../components/auth/OTPVerify/OTPInputForm";
import Modal from "./Modal";
import EmailInputFormModal from "../../components/auth/EmailAuth/EmailInputModal";
import EmailVerification from "../EmailVerification";
import ForgotPasswordInput from "../../components/auth/EmailAuth/ForgotPassword/ForgotPasswordInput";
import ForgotPasswordEmail from "../../components/auth/EmailAuth/ForgotPassword/ForgotPasswordEmail";
import EditUserProfile from "../../pages/user/EditUserProfile";
import CropImageModal from "../../components/CropImageModal";

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
        case "crop-image":
            content = <CropImageModal {...modalData}/>
            break;
        default:
            return null;
    }

    return <Modal isOpen={!!modalType} onClose={closeModal} >{ content }</Modal>

}

export default ModalManager;
