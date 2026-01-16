import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../utils/constants";
import { useEffect, useRef } from "react";
import { useSectionLock } from "../../../features/user/seatSelect/hooks/useSeatLock";
import PropTypes from "prop-types"; 

const CheckoutNavbar = ({ title, eventId, eventSlug }) => {
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();

  const blockBack = useRef(true);
  const pushed = useRef(false);

  const lockId = sessionStorage.getItem("lockId");

  const { releaseSection } = useSectionLock(eventId);

  useEffect(() => {
    if (!pushed.current) {
      window.history.pushState({ checkout: true }, "");
      pushed.current = true;
    }

    const handlePop = (e) => {
      if (!blockBack.current) return;

      e.preventDefault();

      window.history.pushState({ checkout: true }, "");

      openModal("checkout-back-modal", {
        open: true,
        onConfirm: () => {
          releaseSection(lockId);
          sessionStorage.removeItem("lockId");
          sessionStorage.removeItem("appliedCoupon");
          blockBack.current = false;
          closeModal();
          navigate(`/event/${eventSlug}/seat-layout`);
        },
        onCancel: () => {
          closeModal();
          window.history.pushState({ checkout: true }, "");
        },
      });
    };

    window.addEventListener("popstate", handlePop);

    return () => {
      window.removeEventListener("popstate", handlePop);
    };
  }, [closeModal, eventSlug, lockId, navigate, openModal, releaseSection]);

  const askBackConfirmation = () => {
    openModal("checkout-back-modal", {
      open: true,
      onConfirm: () => {
        releaseSection(lockId);
        sessionStorage.removeItem("lockId");
        sessionStorage.removeItem("appliedCoupon");
        blockBack.current = false;
        closeModal();
        navigate(`/event/${eventSlug}/seat-layout`);
      },
      onCancel: () => {
        closeModal();
      },
    });
  };

  return (
    <div className="w-full bg-white shadow-md select-none">
      <div className="relative flex items-center px-4 py-5">
        <div className="flex items-center gap-2 mx-auto">
          <button onClick={askBackConfirmation}>
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

CheckoutNavbar.propTypes = {
  title: PropTypes.string.isRequired,
  eventId: PropTypes.string.isRequired,
  eventSlug: PropTypes.string.isRequired,
};

export default CheckoutNavbar;
