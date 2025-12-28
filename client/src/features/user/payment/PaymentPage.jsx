import { useState } from "react";
import { usePaymentMethods } from "./hooks/usePaymentMethods";
import { PAYMENT_LABELS } from "./constants/payment.constants";
import PaymentMethodList from "./components/PaymentMethodList";
import PaymentMethodDetails from "./components/PaymentMethodDetails";
import { useCheckoutGuard } from "../checkout/hooks/useCheckoutGuard";
import PaymentSectionNavbar from "./components/PaymentSectionNavbar";
import { usePaymentLogic } from "./hooks/usePaymentLogic";
import { useParams } from "react-router-dom";

const PaymentPage = () => {
  const { methods } = usePaymentMethods();
  const [selected, setSelected] = useState(methods[0]);
  const { eventSlug } = useParams();

  const { tickets, grandTotal } = usePaymentLogic(eventSlug);
  useCheckoutGuard();

  return (
    <div className="w-full min-h-screen bg-gray-100">
      <PaymentSectionNavbar title="Malappuram" tickets={tickets} />
      <div className="max-w-5xl mx-auto pt-10">
        <div className="bg-white rounded-xl shadow">
          <h1 className="text-xl font-semibold p-6 border-b">
            {PAYMENT_LABELS.SECTION_TITLE}
          </h1>

          <div className="grid grid-cols-3 min-h-[400px]">
            <div className="border-r">
              <PaymentMethodList
                methods={methods.map((method) => ({
                  ...method,
                  onClick: () => setSelected(method),
                }))}
              />
            </div>

            <div className="col-span-2">
              <PaymentMethodDetails method={selected} eventSlug={eventSlug} grandTotal={grandTotal} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
