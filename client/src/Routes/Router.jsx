import { createBrowserRouter, Navigate } from "react-router-dom";
import Protected from "../components/Protected";
import HomePage from "../pages/user/HomePage";
import ProfilePage from "../pages/user/ProfilePage";
import GlobalLoader from "../components/GlobalLoader";
import App from "../App";
import ErrorPage from "../components/ErrorPage";
import UserNotFoundPage from "../pages/user/UserNotFound";
import AdminProtected from "../components/admin/AdminProtected";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminNotFoundPage from "../pages/admin/AdminNotFoundPage";
import UsersList from "../pages/admin/UsersList";
import OrganizersList from "../pages/admin/OrganizersList";
import UserDetailsPage from "../pages/admin/UserDetailsPage";
import OrganizerDetailsPage from "../pages/admin/OrganizerDetailsPage";
import OrganizerProtected from "../components/organization/OrganizerProtected";
import OrganizerAccountForm from "../pages/organizer/OrganizerAccountForm";
import OrganizerAccRequested from "../pages/organizer/OrganizerAccRequested";
import OrganizerAccRejected from "../pages/organizer/OrganizerAccRejected";
import OrganizerDashboard from "../pages/organizer/OrganizerDashboard";
import OrganizerLayout from "../sharedComponents/organizer/OrganizerLayout";
import AdminLayout from "../sharedComponents/admin/AdminLayout";
import CreateEventForm from "../pages/organizer/CreateEventForm";
import CreateStadium from "../pages/organizer/CreateStadium";

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
                    path: "create-event",
                    element: <CreateEventForm />,
                  },
                  {
                    path: "create-stadium",
                    element: <CreateStadium />,
                  },
                ],
              },
              {
                path: "register",
                element: <OrganizerAccountForm />,
              },
              {
                path: "requested",
                element: <OrganizerAccRequested />,
              },
              {
                path: "rejected",
                element: <OrganizerAccRejected />,
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
