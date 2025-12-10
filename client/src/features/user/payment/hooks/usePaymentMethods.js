import { PAYMENT_METHODS } from "../constants/payment.constants.js";
// import {
//   capturePayPalOrder,
//   createPayPalOrder,
// } from "../services/payment.service.js";
// import { loadPayPalScript } from "../utils/loadPaypalScript.js";

export const usePaymentMethods = () => {
  // const handlePayPalClick = async () => {
  //   try {
      
  //   } catch (err) {
  //     console.error("PayPal payment failed:", err);
  //   }
  // };

  const methods = [
    {
      ...PAYMENT_METHODS.PAYPAL,
      // onClick: handlePayPalClick,
    },
  ];

  return { methods };
};
