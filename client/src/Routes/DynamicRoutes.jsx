import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Protected from "../sharedCompents/Protected";

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
    </Routes>
  );
};

export default DynamicRoutes;
