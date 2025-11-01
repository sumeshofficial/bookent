import { createBrowserRouter, Navigate } from "react-router-dom";
import Protected from "../sharedCompents/Protected";
import HomePage from "../pages/user/HomePage";
import ProfilePage from "../pages/user/ProfilePage";
import GlobalLoader from "../componets/GlobalLoader";
import App from "../App";
import ErrorPage from "../componets/ErrorPage";
import UserNotFoundPage from "../pages/user/UserNotFound";
import AdminProtected from "../componets/Admin/AdminProtected";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminNotFoundPage from "../pages/Admin/AdminNotFoundPage";
import UsersList from "../pages/Admin/UsersList";
import OrganizersList from "../pages/Admin/OrganizersList";
import UserDetailsPage from "../pages/Admin/UserDetailsPage";
import OrganizerDetailsPage from "../pages/Admin/OrganizerDetailsPage";
import OrganizerProtected from "../componets/Organization/OrganizerProtected";
import OrganizerAccountForm from "../pages/organizer/OrganizerAccountForm";
import OrganizerAccRequested from "../pages/organizer/OrganizerAccRequested";
import OrganizerAccRejected from "../pages/organizer/OrganizerAccRejected";
import OrganizerDashboard from "../pages/organizer/OrganizerDashboard";
import CreateEventForm from "../pages/organizer/CreateEvent/CreateEventForm";
import OrganizerLayout from "../sharedCompents/Organizer/OrganizerLayout";
import AdminLayout from "../sharedCompents/Admin/AdminLayout";

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
            element: <OrganizerProtected />,
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
