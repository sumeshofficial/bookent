import PropTypes from "prop-types";
import { handleDownloadInvoice } from "../constants/downloadPdf";

const InvoiceActions = ({ orderId }) => {
  return (
    <div className="mt-6 flex gap-4">
      <button
        onClick={() => handleDownloadInvoice(orderId)}
        className="bg-black text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700"
      >
        Download Invoice
      </button>
    </div>
  );
};

InvoiceActions.propTypes = {
  orderId: PropTypes.string.isRequired,
};

export default InvoiceActions;
