import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import ErrorPage from "../pages/ErrorPage";


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) return <Navigate to="/login" replace />;

  if (user?.role !== "Doctor")
    return <Navigate to="/unauthorized" replace />;

  return children;
};

const DoctorRoutes = () => {
  return (
    <Routes>
      {/* Main Admin Layout */}
      <Route element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DoctorDashboard />} />
        {/* <Route path="test" element={<ProtectedRoute><h1>test</h1></ProtectedRoute>} /> */}


        {/* Catch-all */}
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
};

export default DoctorRoutes;
