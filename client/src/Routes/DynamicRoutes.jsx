import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/user/HomePage";
import Protected from "../sharedCompents/Protected";
import ProfilePage from "../pages/user/ProfilePage";
import OrganizerAccountForm from "../pages/organizer/OrganizerAccountForm";
import OrganizerAccRequested from "../pages/organizer/OrganizerAccRequested";
import OrganizerDashboard from "../pages/organizer/OrganizerDashboard";
import OrganizerProtected from "../sharedCompents/Organization/OrganizerProtected";

const DynamicRoutes = () => {
  return (
    <Routes>
      <Route
        path={"/"}
        element={
          <Protected>
            <HomePage />
          </Protected>
        }
      />
      <Route
        path={"/profile"}
        element={
          <Protected>
            <ProfilePage />
          </Protected>
        }
      />
      <Route
        path={"/listmyShow"}
        element={
          <Protected>
            <OrganizerProtected />
          </Protected>
        }
      >
        <Route path="register" element={<OrganizerAccountForm />} />
        <Route path="requested" element={<OrganizerAccRequested />} />
        <Route path="dashboard" element={<OrganizerDashboard />} />
      </Route>
    </Routes>
  );
};

export default DynamicRoutes;
