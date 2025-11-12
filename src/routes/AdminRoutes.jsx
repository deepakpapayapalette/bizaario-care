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
import LoginMaster from "../pages/admin/LoginMaster";
import ContentMaster from "../pages/admin/ContentMaster";
import EventMaster from "../pages/admin/EventMaster";
import PatientReferralType from "../pages/admin/country-group-master/PatientReferralType";
import SymptomClassMaster from "../pages/admin/country-group-master/SymptomClassMaster";
import SymptomMaster from "../pages/admin/country-group-master/SymptomMaster";
import AggravatingFactorMaster from "../pages/admin/country-group-master/AggravatingFactorMaster";
import PharmaceuticalSaltTypeMaster from "../pages/admin/country-group-master/PharmaceuticalSaltTypeMaster";
import PharmaceuticalSaltMaster from "../pages/admin/country-group-master/PharmaceuticalSaltMaster";
import DosageMaster from "../pages/admin/country-group-master/DosageMaster";
import MedicineFrequencyMaster from "../pages/admin/country-group-master/MedicineFrequencyMaster";
import TherapyMaster from "../pages/admin/country-group-master/TherapyMaster";
import ProcedureMaster from "../pages/admin/country-group-master/ProcedureMaster";
import DiseaseMaster from "../pages/admin/country-group-master/DiseaseMaster";
import AllergyCategoryMaster from "../pages/admin/country-group-master/AllergyCategoryMaster";
import AllergyMaster from "../pages/admin/country-group-master/AllergyMaster";
import TrumaCategoryMaster from "../pages/admin/country-group-master/TrumaCategoryMaster";
import TraumaMaster from "../pages/admin/country-group-master/TraumaMaster";


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
      <Route
        path="login-master"
        element={<LoginMaster />}
      />
      <Route
        path="content-master"
        element={<ContentMaster />}
      />
      <Route
        path="event-master"
        element={<EventMaster />}
      />
      <Route path="bizaario-master/">
        <Route
          path="patient-referral-type"
          element={<ProtectedRoute><PatientReferralType /></ProtectedRoute>}
        />
        <Route
          path="symptom-class-master"
          element={<ProtectedRoute><SymptomClassMaster /></ProtectedRoute>}
        />
        <Route
          path="symptom-master"
          element={<ProtectedRoute><SymptomMaster /></ProtectedRoute>}
        />
        <Route
          path="aggravating-factor-master"
          element={<ProtectedRoute><AggravatingFactorMaster /></ProtectedRoute>}
        />
        <Route
          path="pharmaceutical-salt-type-master"
          element={<ProtectedRoute><PharmaceuticalSaltTypeMaster /></ProtectedRoute>}
        />
        <Route
          path="pharmaceutical-salt-master"
          element={<ProtectedRoute><PharmaceuticalSaltMaster /></ProtectedRoute>}
        />
        <Route
          path="dosage-master"
          element={<ProtectedRoute><DosageMaster /></ProtectedRoute>}
        />
        <Route
          path="medicine-frequency-master"
          element={<ProtectedRoute><MedicineFrequencyMaster /></ProtectedRoute>}
        />
        <Route
          path="therapy-master"
          element={<ProtectedRoute><TherapyMaster /></ProtectedRoute>}
        />
        <Route
          path="procedure-master"
          element={<ProtectedRoute><ProcedureMaster /></ProtectedRoute>}
        />
        <Route
          path="disease-master"
          element={<ProtectedRoute><DiseaseMaster /></ProtectedRoute>}
        />
        <Route
          path="allergy-category-master"
          element={<ProtectedRoute><AllergyCategoryMaster /></ProtectedRoute>}
        />
        <Route
          path="allergy-master"
          element={<ProtectedRoute><AllergyMaster /></ProtectedRoute>}
        />
        <Route
          path="truma-category-master"
          element={<ProtectedRoute><TrumaCategoryMaster /></ProtectedRoute>}
        />
        <Route
          path="truma-master"
          element={<ProtectedRoute><TraumaMaster /></ProtectedRoute>}
        />
      </Route>

      {/* Catch-all inside admin */}
      <Route path="*" element={<ErrorPage />} />
    </Route>
  </Routes>
);

export default AdminRoutes;

