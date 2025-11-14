import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import DoctorDashboard from "../pages/doctor/DoctorDashboard";
import ErrorPage from "../pages/ErrorPage";
import DigitalCME from "../pages/doctor/DigitalCME";
import NewsArticleDoctor from "../pages/doctor/NewsArticleDoctor";
import AwardsRecognitions from "../pages/doctor/AwardsRecognitions";
import PatientTestimonials from "../pages/doctor/PatientTestimonials";
import OpdSurgicalCamps from "../pages/doctor/OpdSurgicalCamps";
import Workshop from "../pages/doctor/Workshop";
import CompleteDoctorProfile from "../pages/doctor/doctor-details/CompleteDoctorProfile";
import PatientReferral from "../pages/doctor/PatientReferral";


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
        <Route path="digital-cme" element={<ProtectedRoute><DigitalCME /></ProtectedRoute>} />
        <Route path="news-article" element={<ProtectedRoute><NewsArticleDoctor /></ProtectedRoute>} />
        <Route path="awards-recognitions" element={<ProtectedRoute><AwardsRecognitions /></ProtectedRoute>} />
        <Route path="patient-testimonials" element={<ProtectedRoute><PatientTestimonials /></ProtectedRoute>} />
        <Route path="opd-srugicla-camps" element={<ProtectedRoute><OpdSurgicalCamps /></ProtectedRoute>} />
        <Route path="workshop" element={<ProtectedRoute><Workshop /></ProtectedRoute>} />
        <Route path="complete-doctor-profile" element={<ProtectedRoute><CompleteDoctorProfile /></ProtectedRoute>} />
        {/* <Route path="patient-referral" element={<ProtectedRoute><PatientReferral /></ProtectedRoute>} /> */}


        {/* Catch-all */}
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
};

export default DoctorRoutes;
