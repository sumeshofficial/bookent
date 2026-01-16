import PropTypes from "prop-types";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PaymentSectionNavbar = ({ tickets }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white shadow-md select-none">
      <div className="relative flex items-center px-12 py-5">
        <div className="flex items-start gap-5">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft size={26} className="text-gray-700" />
          </button>

          <div>
            <h1 className="text-base lg:text-md font-semibold truncate max-w-[140px] sm:max-w-full">
              {tickets?.title}
            </h1>
            <p className="text-xs lg:text-sm truncate max-w-[140px] sm:max-w-full">
              {tickets?.venue}
            </p>
            <p className="text-xs lg:text-xs truncate max-w-[140px] sm:max-w-full">
              {tickets?.section} ( {tickets?.count} tickets )
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

PaymentSectionNavbar.propTypes = {
  tickets: PropTypes.shape({
    title: PropTypes.string,
    venue: PropTypes.string,
    section: PropTypes.string,
    count: PropTypes.number,
  }),
};

export default PaymentSectionNavbar;
