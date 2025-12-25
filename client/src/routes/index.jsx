import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import GlobalLoader from "../components/GlobalLoader";
import ErrorPage from "../components/ErrorPage";
import UserNotFoundPage from "../features/user/UserNotFound";

import userRoutes from "./user.routes";
import organizerRoutes from "./organizer.routes";
import adminRoutes from "./admin.routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <GlobalLoader />,
        children: [
          ...userRoutes,
          ...organizerRoutes,
          ...adminRoutes,
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