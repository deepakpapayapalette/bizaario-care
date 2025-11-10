import React from "react";
import { Route, Routes } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import ErrorPage from "../pages/ErrorPage";

const DoctorRoutes = () => {
  return (
    <Routes>
      {/* Main Admin Layout */}
      <Route element={<AdminLayout />}>
        <Route index element={<DoctorDashboard />} />
        <Route path="test" element={<h1>test</h1>} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default DoctorRoutes;
