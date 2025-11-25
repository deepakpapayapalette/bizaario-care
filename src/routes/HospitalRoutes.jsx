import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";
import HospitalDashboard from "../components/hospital/hospital-admin/HospitalDashboard";
import DigitalCME from "../pages/hospital/DigitalCME";
import NewsArticleHospital from "../pages/hospital/NewsArticleHospital";
import AwardsRecognitions from "../pages/hospital/AwardsRecognitions";
import PatientTestimonials2 from "../pages/hospital/PatientTestimonials2";
import OpdSurgicalCamps2 from "../pages/hospital/OpdSurgicalCamps2";
import WorkshopHospital from "../pages/hospital/WorkshopHospital";
import CompleteHospitalProfile from "../pages/hospital/doctor-details/CompleteHospitalProfile";
import ChangePassword from "../pages/auth/ChangePassword";


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user, "hospital admin");
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "Hospital")
    return <Navigate to="/unauthorized" replace />;
  return children;
};

const HospitalRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute> <AdminLayout /> </ProtectedRoute>}>
        <Route index element={<ProtectedRoute><HospitalDashboard /></ProtectedRoute>} />
        <Route path="digital-cme" element={<ProtectedRoute><DigitalCME /></ProtectedRoute>} />
        <Route path="news-article" element={<ProtectedRoute><NewsArticleHospital /></ProtectedRoute>} />
        <Route path="awards-recognitions" element={<ProtectedRoute><AwardsRecognitions /></ProtectedRoute>} />
        <Route path="patient-testimonials" element={<ProtectedRoute><PatientTestimonials2 /></ProtectedRoute>} />
        <Route path="opd-srugicla-camps" element={<ProtectedRoute><OpdSurgicalCamps2 /></ProtectedRoute>} />
        <Route path="workshop" element={<ProtectedRoute><WorkshopHospital /></ProtectedRoute>} />
        <Route path="complete-doctor-profile" element={<ProtectedRoute><CompleteHospitalProfile /></ProtectedRoute>} />
        <Route path="change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
};

export default HospitalRoutes;
