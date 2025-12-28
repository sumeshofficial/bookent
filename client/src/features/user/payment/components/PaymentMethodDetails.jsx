import { PayPalButtons } from "@paypal/react-paypal-js";
import { usePaypalLogic } from "../hooks/usePaypalLogic";
import PaymentOptionCard from "./PaymentOptionCard";
import { PAYMENT_METHODS } from "../constants/payment.constants";
import WalletButton from "./WalletButton";
import { useSelector } from "react-redux";

const PaymentMethodDetails = ({ method, eventSlug, grandTotal }) => {
  const { user } = useSelector((store) => store.user);
  const { createOrder, onApprove, onError, onCancel, styles } =
    usePaypalLogic(eventSlug);

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">{method.title}</h2>
      {method.id === "paypal" && (
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onCancel={onCancel}
          onError={onError}
          style={styles}
        />
      )}

      {method.id === "wallet" && (
        <WalletButton
          balance={user.wallet}
          amount={grandTotal}
          onPay={method.onClick}
          isLoading={method.isLoading}
          isDisabled={method.isDisabled}
          error={method.error}
        />
      )}
    </div>
  );
};

export default PaymentMethodDetails;
