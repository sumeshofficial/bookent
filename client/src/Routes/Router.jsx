import { createBrowserRouter, Navigate } from "react-router-dom";
import Protected from "../components/Protected";
import HomePage from "../features/user/HomePage";
import ProfilePage from "../features/user/profile/ProfilePage";
import GlobalLoader from "../components/GlobalLoader";
import App from "../App";
import ErrorPage from "../components/ErrorPage";
import UserNotFoundPage from "../features/user/UserNotFound";
import AdminProtected from "../components/admin/AdminProtected";
import AdminDashboard from "../features/admin/AdminDashboard";
import AdminLogin from "../features/admin/AdminLogin";
import AdminNotFoundPage from "../features/admin/AdminNotFoundPage";
import UsersList from "../features/admin/UsersList";
import OrganizersList from "../features/admin/OrganizersList";
import UserDetailsPage from "../features/admin/UserDetailsPage";
import OrganizerDetailsPage from "../features/admin/OrganizerDetailsPage";
import OrganizerProtected from "../components/organization/OrganizerProtected";
import OrganizerDashboard from "../features/organizer/OrganizerDashboard";
import OrganizerLayout from "../sharedComponents/organizer/OrganizerLayout";
import AdminLayout from "../sharedComponents/admin/AdminLayout";
import CreateEventForm from "../features/organizer/CreateEventForm";
import CreateStadium from "../features/organizer/CreateStadium";
import OrganizerEventsPage from "../features/organizer/OrganizerEventsPage";
import EventPreview from "../features/organizer/EventPreview";
import EventsPage from "../features/user/EventsPage";
import EventDetailPage from "../features/user/EventDetailPage";
import OrganizerProfilePage from "../features/organizer/OrganizerProfilePage";
import Stadiums from "../features/organizer/Stadiums";
import StadiumDetails from "../features/organizer/StadiumDetails";
import SeatSelectPage from "../features/user/seatSelect/SeatSelectPage";
import CheckoutPage from "../features/user/checkout/CheckoutPage";
import SessionTimeout from "../sharedComponents/user/error/SessionTimeout";
import PaymentPage from "../features/user/payment/PaymentPage";
import PaymentProcessing from "../features/user/payment/PaymentProcessing";
import TicketBooked from "../features/user/TicketBooked/TicketBooked";
import MyTickets from "../features/user/myTickets/MyTickets";
import Ticket from "../features/user/ticket/Ticket";
import AdminWallet from "../features/admin/wallet/AdminWallet";
import VerifyTicket from "../features/organizer/verifyTicket/VerifyTicket";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <GlobalLoader />,
        children: [
          // User route
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
            path: "session-expired",
            element: (
              <Protected>
                <SessionTimeout />
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

          // Organizer routes
          {
            path: "listmyshow",
            element: (
              <Protected>
                <OrganizerProtected />
              </Protected>
            ),
            children: [
              {
                element: <OrganizerLayout />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="dashboard" replace />,
                  },
                  {
                    path: "dashboard",
                    element: <OrganizerDashboard />,
                  },
                  {
                    path: "event/create",
                    element: <CreateEventForm />,
                  },
                  {
                    path: "organizer/:organizerId/event/:eventSlug/edit",
                    element: <CreateEventForm />,
                  },
                  {
                    path: "stadium/create",
                    element: <CreateStadium />,
                  },
                  {
                    path: "events",
                    element: <OrganizerEventsPage />,
                  },
                  {
                    path: "organizer/:organizerId/event/:eventSlug",
                    element: <EventPreview />,
                  },
                  {
                    path: "profile",
                    element: <OrganizerProfilePage />,
                  },
                  {
                    path: "stadiums",
                    element: <Stadiums />,
                  },
                  {
                    path: "stadium/:stadiumSlug",
                    element: <StadiumDetails />,
                  },
                  {
                    path: "stadium/:stadiumSlug/edit",
                    element: <CreateStadium />,
                  },
                  {
                    path: "verify-ticket",
                    element: <VerifyTicket />,
                  },
                ],
              },
            ],
          },

          // Admin routes
          {
            path: "admin",
            element: <AdminProtected />,
            children: [
              {
                element: <AdminLayout />,
                children: [
                  {
                    path: "dashboard",
                    element: <AdminDashboard />,
                  },
                  {
                    path: "users",
                    element: <UsersList />,
                  },
                  {
                    path: "organizers",
                    element: <OrganizersList />,
                  },
                  {
                    path: "users/:id",
                    element: <UserDetailsPage />,
                  },
                  {
                    path: "organizers/:id",
                    element: <OrganizerDetailsPage />,
                  },
                  {
                    path: "wallet",
                    element: <AdminWallet />,
                  },
                ],
              },
              {
                path: "login",
                element: <AdminLogin />,
              },
              {
                path: "*",
                element: <AdminNotFoundPage />,
              },
            ],
          },
        ],
      },
      {
        path: "*",
        element: <UserNotFoundPage />,
      },
    ],
  },
]);

export default router;
