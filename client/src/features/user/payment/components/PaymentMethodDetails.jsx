import { PayPalButtons } from "@paypal/react-paypal-js";
import { usePaypalLogic } from "../hooks/usePaypalLogic";

const PaymentMethodDetails = ({ method }) => {
  const { createOrder, onApprove, onError, onCancel, styles } =
    usePaypalLogic();

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">{method.title}</h2>

      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onCancel={onCancel}
        onError={onError}
        style={styles}
      />

      {/* <PaymentOptionCard
        logo={method.logo}
        title={method.title}
        onClick={method.onClick}
      /> */}
    </div>
  );
};

export default PaymentMethodDetails;
