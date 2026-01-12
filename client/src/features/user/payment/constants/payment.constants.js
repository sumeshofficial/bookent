import paypalLogo from "../../../../assets/paypal-logo.png";
import walletlogo from "../../../../assets/wallet-png-25148.png";

export const PAYMENT_METHODS = {
  PAYPAL: {
    id: "paypal",
    title: "Pay by Paypal",
    logo: paypalLogo,
  },
  WALLET: {
    id: "wallet",
    title: "Pay by Wallet",
    logo: walletlogo,
  },
};

export const PAYMENT_LABELS = {
  SECTION_TITLE: "Payment options",
};
