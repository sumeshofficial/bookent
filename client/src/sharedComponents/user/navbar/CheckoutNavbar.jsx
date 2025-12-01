import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookentLogo from "../../BookentLogo";
import { useModal } from "../../../utils/constants";
import { useEffect } from "react";
import { useRef } from "react";

const CheckoutNavbar = ({ title, eventId }) => {
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();

  const hasPushed = useRef(false);

  useEffect(() => {
    if (!hasPushed.current) {
      window.history.pushState(null, null);
      hasPushed.current = true;
    }

    const handleBackButton = (e) => {
      e.preventDefault();

      openModal("checkout-back-modal", {
        open: true,
        onConfirm: () => {
          closeModal();
          navigate(`/event/${eventId}/seat-layout`);
        },
        onCancel: () => {
          closeModal();
          window.history.pushState(null, "");
        },
      });
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);

  return (
    <div className="w-full bg-white shadow-md select-none">
      <div className="relative flex items-center px-4 py-5">
        <div className="hidden sm:block absolute left-4">
          <BookentLogo />
        </div>

        <div className="flex items-center gap-2 mx-auto">
          <button onClick={() => window.history.back()}>
            <ChevronLeft size={26} className="text-gray-700" />
          </button>

          <h1 className="text-base lg:text-lg font-semibold text-center truncate max-w-[140px] sm:max-w-full">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default CheckoutNavbar;
