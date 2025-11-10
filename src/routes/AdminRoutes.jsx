import { Route, Routes, Navigate } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import AdminLayout from "../layouts/AdminLayout";
import Admindashboard from "../pages/admin/dashboard/Admindashboard";

import CountryGroupMaster from "../pages/admin/configuration/CountryGroupMaster";
import OrgUnitMaster from "../pages/admin/configuration/OrgUnitMaster";
import MedicalSpeciality from "../pages/admin/configuration/MedicalSpeciality";
import ServiceCategory from "../pages/admin/configuration/ServiceCategory";
import ContentType from "../pages/admin/configuration/ContentType";
import EventType from "../pages/admin/configuration/EventType";
import AssetCategoryLevel1 from "../pages/admin/configuration/AssetCategoryLevel1";
import AssetCategoryLevel2 from "../pages/admin/configuration/AssetCategoryLevel2";
import AssetCategoryLevel3 from "../pages/admin/configuration/AssetCategoryLevel3";
import SubscriptionTypeMaster from "../pages/admin/configuration/SubscriptionTypeMaster";
import RelationshipMaster from "../pages/admin/configuration/RelationshipMaster";
import InsuranceProviderMaster from "../pages/admin/configuration/InsuranceProviderMaster";
import StationMaster from "../pages/admin/StationMaster";
import AssetMaster from "../pages/admin/AssetMaster";


// ✅ ProtectedRoute inside same file
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) return <Navigate to="/login" replace />;

  if (user?.role !== "Super Admin")
    return <Navigate to="/unauthorized" replace />;

  return children;
};


const AdminRoutes = () => (
  <Routes>
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Admindashboard />} />

      <Route path="configuration/">
        <Route
          path="country-group-master"
          element={<ProtectedRoute><CountryGroupMaster /></ProtectedRoute>}
        />
        <Route
          path="org-unit-master"
          element={<ProtectedRoute><OrgUnitMaster /></ProtectedRoute>}
        />
        <Route
          path="medical-speciality"
          element={<ProtectedRoute><MedicalSpeciality /></ProtectedRoute>}
        />
        <Route
          path="service-category"
          element={<ProtectedRoute><ServiceCategory /></ProtectedRoute>}
        />
        <Route
          path="content-type"
          element={<ProtectedRoute><ContentType /></ProtectedRoute>}
        />
        <Route
          path="event-type"
          element={<ProtectedRoute><EventType /></ProtectedRoute>}
        />
        <Route
          path="asset-category-level1"
          element={<ProtectedRoute><AssetCategoryLevel1 /></ProtectedRoute>}
        />
        <Route
          path="asset-category-level2"
          element={<ProtectedRoute><AssetCategoryLevel2 /></ProtectedRoute>}
        />
        <Route
          path="asset-category-level3"
          element={<ProtectedRoute><AssetCategoryLevel3 /></ProtectedRoute>}
        />
        <Route
          path="subscription-type-master"
          element={<ProtectedRoute><SubscriptionTypeMaster /></ProtectedRoute>}
        />
        <Route
          path="relationship-master"
          element={<ProtectedRoute><RelationshipMaster /></ProtectedRoute>}
        />
        <Route
          path="insurance-provider-master"
          element={<ProtectedRoute><InsuranceProviderMaster /></ProtectedRoute>}
        />
      </Route>

      <Route
        path="station-master"
        element={<StationMaster />}
      />
      <Route
        path="assets-master"
        element={<AssetMaster />}
      />

      {/* Catch-all inside admin */}
      <Route path="*" element={<ErrorPage />} />
    </Route>
  </Routes>
);

export default AdminRoutes;

