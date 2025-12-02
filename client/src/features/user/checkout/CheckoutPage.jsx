import TicketCard from "./components/tickets/TicketCard";
import OffersSection from "./components/offer/OffersSection";
import PaymentSummary from "./components/payment/PaymentSummary";
import GrandTotal from "./components/payment/GrandTotal";
import ContinueButton from "./components/footer/ContinueButton";
import { useCheckoutLogic } from "./hooks/useCheckoutLogic";
import CheckoutNavbar from "../../../sharedComponents/user/navbar/CheckoutNavbar";
import { useParams } from "react-router-dom";
import useReleaseSeatLock from "../../../hooks/useReleaseSeatLock";
import { useCheckoutGuard } from "./hooks/useCheckoutGuard";

const CheckoutPage = () => {
  const { tickets, fees, grandTotal } = useCheckoutLogic();
  const { eventId } = useParams();

  useReleaseSeatLock(eventId);
  useCheckoutGuard();
  
  return (
    <>
      <CheckoutNavbar title="Ticket options" eventId={eventId} />
      <div className="my-10 max-w-3xl mx-auto px-5 py-6 space-y-6 border-2 rounded-xl border-gray-200 select-none">
        <TicketCard data={tickets} />

        <OffersSection />

        <PaymentSummary fees={fees} />

        <GrandTotal amount={grandTotal} />

        <ContinueButton />
      </div>
    </>
  );
};

export default CheckoutPage;
