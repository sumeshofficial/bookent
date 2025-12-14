import QRCode from "qrcode";

export const generateQRCode = async (qrData) => {
  return QRCode.toBuffer(qrData, {
    type: "png",
    width: 200,
    errorCorrectionLevel: "H",
  });
};