import AdminProtected from "../components/admin/AdminProtected";
import AdminLayout from "../sharedComponents/admin/AdminLayout";

import AdminDashboard from "../features/admin/AdminDashboard";
import AdminLogin from "../features/admin/AdminLogin";
import AdminNotFoundPage from "../features/admin/AdminNotFoundPage";
import UsersList from "../features/admin/UsersList";
import OrganizersList from "../features/admin/OrganizersList";
import UserDetailsPage from "../features/admin/UserDetailsPage";
import OrganizerDetailsPage from "../features/admin/OrganizerDetailsPage";
import AdminWallet from "../features/admin/wallet/AdminWallet";
import Coupons from "../features/admin/coupons/Coupons";
import Events from "../features/admin/events/Events";
import Event from "../features/admin/event/Event";

const adminRoutes = [
  {
    path: "admin",
    element: <AdminProtected />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <AdminDashboard /> },
          { path: "users", element: <UsersList /> },
          { path: "organizers", element: <OrganizersList /> },
          { path: "users/:id", element: <UserDetailsPage /> },
          { path: "organizers/:id", element: <OrganizerDetailsPage /> },
          { path: "wallet", element: <AdminWallet /> },
          { path: "coupons", element: <Coupons /> },
          { path: "events", element: <Events /> },
          { path: "events/:slug", element: <Event /> },
        ],
      },
      { path: "login", element: <AdminLogin /> },
      { path: "*", element: <AdminNotFoundPage /> },
    ],
  },
];

export default adminRoutes;
