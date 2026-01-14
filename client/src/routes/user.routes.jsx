import Protected from "../components/Protected";

import HomePage from "../features/user/HomePage";
import ProfilePage from "../features/user/profile/ProfilePage";
import EventsPage from "../features/user/EventsPage";
import EventDetailPage from "../features/user/EventDetailPage";
import SeatSelectPage from "../features/user/seatSelect/SeatSelectPage";
import CheckoutPage from "../features/user/checkout/CheckoutPage";
import PaymentPage from "../features/user/payment/PaymentPage";
import PaymentProcessing from "../features/user/payment/PaymentProcessing";
import MyTickets from "../features/user/myTickets/MyTickets";
import Ticket from "../features/user/ticket/Ticket";
import SessionTimeout from "../sharedComponents/user/error/SessionTimeout";
import Wallet from "../features/user/wallet/Wallet";
import TicketBooked from "../features/user/ticketBooked/TicketBooked";

const userRoutes = [
  {
    index: true,
    element: (
      <Protected>
        <HomePage />
      </Protected>
    ),
  },
  {
    path: "profile",
    element: (
      <Protected>
        <ProfilePage />
      </Protected>
    ),
  },
  {
    path: "events/:category",
    element: (
      <Protected>
        <EventsPage />
      </Protected>
    ),
  },
  {
    path: "event/:eventSlug",
    element: (
      <Protected>
        <EventDetailPage />
      </Protected>
    ),
  },
  {
    path: "event/:eventSlug/seat-layout",
    element: (
      <Protected>
        <SeatSelectPage />
      </Protected>
    ),
  },
  {
    path: "event/:eventSlug/checkout",
    element: (
      <Protected>
        <CheckoutPage />
      </Protected>
    ),
  },
  {
    path: "event/:eventSlug/payment-method",
    element: (
      <Protected>
        <PaymentPage />
      </Protected>
    ),
  },
  {
    path: "payment-processing",
    element: (
      <Protected>
        <PaymentProcessing />
      </Protected>
    ),
  },
  {
    path: "ticket",
    element: (
      <Protected>
        <TicketBooked />
      </Protected>
    ),
  },
  {
    path: "ticket/:orderId",
    element: (
      <Protected>
        <Ticket />
      </Protected>
    ),
  },
  {
    path: "my-tickets",
    element: (
      <Protected>
        <MyTickets />
      </Protected>
    ),
  },
  {
    path: "session-expired",
    element: (
      <Protected>
        <SessionTimeout />
      </Protected>
    ),
  },
  {
    path: "wallet",
    element: (
      <Protected>
        <Wallet />
      </Protected>
    ),
  },
];

export default userRoutes;
