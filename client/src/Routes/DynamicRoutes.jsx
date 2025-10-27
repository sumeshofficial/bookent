import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/user/HomePage";
import Protected from "../sharedCompents/Protected";
import ProfilePage from "../pages/user/ProfilePage";
import OrganizerAccountForm from "../pages/organizer/OrganizerAccountForm";
import OrganizerAccRequested from "../pages/organizer/OrganizerAccRequested";
import OrganizerDashboard from "../pages/organizer/OrganizerDashboard";
import OrganizerProtected from "../componets/Organization/OrganizerProtected";
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminProtected from "../componets/Admin/AdminProtected";
import UsersList from "../pages/Admin/UsersList";
import AdminNotFoundPage from "../pages/Admin/AdminNotFoundPage";
import NormalizeSlash from "../sharedCompents/NormalizeSlash";
import UserDetailsPage from "../pages/Admin/UserDetailsPage";
import OrganizersList from "../pages/Admin/OrganizersList";
import OrganizerAccRejected from "../pages/organizer/OrganizerAccRejected";

const DynamicRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<NormalizeSlash />} />
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
        <Route path="rejected" element={<OrganizerAccRejected />} />
        <Route path={"organizers/:id"} element={<UserDetailsPage />} />
      </Route>

      <Route path={"/admin"} element={<AdminProtected />}>
        <Route index element={<AdminDashboard />} />
        <Route path={"login"} element={<AdminLogin />} />
        <Route path={"dashboard"} element={<AdminDashboard />} />
        <Route path={"users"} element={<UsersList />} />
        <Route path={"organizers"} element={<OrganizersList />} />
        <Route path={"users/:id"} element={<UserDetailsPage />} />
        <Route path="*" element={<AdminNotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default DynamicRoutes;
