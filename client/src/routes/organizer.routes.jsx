import { Navigate } from "react-router-dom";
import Protected from "../components/Protected";
import OrganizerProtected from "../components/organization/OrganizerProtected";

import OrganizerLayout from "../sharedComponents/organizer/OrganizerLayout";
import CreateEventForm from "../features/organizer/CreateEventForm";
import CreateStadium from "../features/organizer/CreateStadium";
import OrganizerEventsPage from "../features/organizer/OrganizerEventsPage";
import EventPreview from "../features/organizer/EventPreview";
import OrganizerProfilePage from "../features/organizer/OrganizerProfilePage";
import Stadiums from "../features/organizer/Stadiums";
import StadiumDetails from "../features/organizer/StadiumDetails";
import VerifyTicket from "../features/organizer/verifyTicket/VerifyTicket";
import BookingHistory from "../features/organizer/bookings/BookingHistory";
import SalesReport from "../features/organizer/sales/SalesReport";
import Dashboard from "../features/organizer/dashboard/Dashboard";

const organizerRoutes = [
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
          { index: true, element: <Navigate to="dashboard" replace /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "event/create", element: <CreateEventForm /> },
          {
            path: "organizer/:organizerId/event/:eventSlug/edit",
            element: <CreateEventForm />,
          },
          { path: "stadium/create", element: <CreateStadium /> },
          { path: "events", element: <OrganizerEventsPage /> },
          {
            path: "organizer/:organizerId/event/:eventSlug",
            element: <EventPreview />,
          },
          { path: "profile", element: <OrganizerProfilePage /> },
          { path: "stadiums", element: <Stadiums /> },
          { path: "stadium/:stadiumSlug", element: <StadiumDetails /> },
          {
            path: "stadium/:stadiumSlug/edit",
            element: <CreateStadium />,
          },
          {
            path: "event/:eventId/tickets/verify",
            element: <VerifyTicket />,
          },
          {
            path: "event/:eventSlug/bookings",
            element: <BookingHistory />,
          },
          {
            path: "sales",
            element: <SalesReport />,
          },
        ],
      },
    ],
  },
];

export default organizerRoutes;
