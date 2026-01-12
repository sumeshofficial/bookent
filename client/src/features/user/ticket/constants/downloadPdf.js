import toast from "react-hot-toast";
import { getInvoicePdf } from "../services/ticket.service";

export const handleDownloadInvoice = async (orderId) => {
  try {
    const data = await getInvoicePdf(orderId);

    const url = window.URL.createObjectURL(
      new Blob([data], { type: "application/pdf" })
    );

    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${orderId}.pdf`;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);

    toast.success("Invoice download success");
  } catch (err) {
    toast.error(`Invoice download failed ${err}`);
  }
};
