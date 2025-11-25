import { Route, Routes, Navigate } from "react-router-dom";

import ErrorPage from "../pages/ErrorPage";
import AdminLayout from "../layouts/AdminLayout";
import Admindashboard from "../pages/admin/dashboard/Admindashboard";
import ChangePassword from "../pages/auth/ChangePassword";

// Configuration Masters
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

// Other Masters
import StationMaster from "../pages/admin/StationMaster";
import AssetMaster from "../pages/admin/AssetMaster";
import LoginMaster from "../pages/admin/LoginMaster";
import ContentMaster from "../pages/admin/ContentMaster";
import EventMaster from "../pages/admin/EventMaster";

// Country Group Master details
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
import OccupationCategoryMaster from "../pages/admin/country-group-master/OccupationCategoryMaster";
import OccupationMaster from "../pages/admin/country-group-master/OccupationMaster";
import HabitCategoryMaster from "../pages/admin/country-group-master/HabitCategoryMaster";
import HabitMaster from "../pages/admin/country-group-master/HabitMaster";
import ReasonReferralMaster from "../pages/admin/country-group-master/ReasonReferralMaster";
import InvestigationCategoryMaster from "../pages/admin/country-group-master/InvestigationCategoryMaster";
import InvestigationMaster from "../pages/admin/country-group-master/InvestigationMaster";
import DiagnosisMaster from "../pages/admin/country-group-master/DiagnosisMaster";
import DiagnosisTypeMaster from "../pages/admin/country-group-master/DiagnosisTypeMaster";
import LifestyleInterventionMaster from "../pages/admin/country-group-master/LifestyleInterventionMaster";
import SecondOpinionQueryMaster from "../pages/admin/country-group-master/SecondOpinionQueryMaster";
import ComorbidityMaster from "../pages/admin/country-group-master/ComorbidityMaster";
import RiskFactorMaster from "../pages/admin/country-group-master/RiskFactorMaster";
import PatientConcernMaster from "../pages/admin/country-group-master/PatientConcernMaster";
import LogsticalConsiderationMaster from "../pages/admin/country-group-master/LogsticalConsiderationMaster";

import HealthProfillingQuestions from "../pages/admin/HealthProfillingQuestions";


// -------------------------------------------------------------------------
// ✅ CLEAN & FIXED PROTECTED ROUTE
// -------------------------------------------------------------------------
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/login" replace />;

  if (user?.role !== "Super Admin")
    return <Navigate to="/unauthorized" replace />;

  return children;
};

// -------------------------------------------------------------------------
// ✅ MAIN ADMIN ROUTES
// -------------------------------------------------------------------------
const AdminRoutes = () => (
  <Routes>
    {/* ADMIN LAYOUT WRAPPED IN PROTECTED ROUTE */}
    <Route
      path="/"
      element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }
    >

      {/* Dashboard */}
      <Route index element={<Admindashboard />} />
      <Route path="change-password" element={<ChangePassword />} />

      {/* ---------------- CONFIGURATION ROUTES ---------------- */}
      <Route path="configuration">
        <Route path="country-group-master" element={<CountryGroupMaster />} />
        <Route path="org-unit-master" element={<OrgUnitMaster />} />
        <Route path="medical-speciality" element={<MedicalSpeciality />} />
        <Route path="service-category" element={<ServiceCategory />} />
        <Route path="content-type" element={<ContentType />} />
        <Route path="event-type" element={<EventType />} />
        <Route path="asset-category-level1" element={<AssetCategoryLevel1 />} />
        <Route path="asset-category-level2" element={<AssetCategoryLevel2 />} />
        <Route path="asset-category-level3" element={<AssetCategoryLevel3 />} />
        <Route path="subscription-type-master" element={<SubscriptionTypeMaster />} />
        <Route path="relationship-master" element={<RelationshipMaster />} />
        <Route path="insurance-provider-master" element={<InsuranceProviderMaster />} />
      </Route>

      {/* ---------------- OTHER MASTERS ---------------- */}
      <Route path="station-master" element={<StationMaster />} />
      <Route path="assets-master" element={<AssetMaster />} />
      <Route path="login-master" element={<LoginMaster />} />
      <Route path="content-master" element={<ContentMaster />} />
      <Route path="event-master" element={<EventMaster />} />

      {/* ---------------- COUNTRY GROUP NESTED MASTERS ---------------- */}
      <Route path="bizaario-master">
        <Route path="patient-referral-type" element={<PatientReferralType />} />
        <Route path="symptom-class-master" element={<SymptomClassMaster />} />
        <Route path="symptom-master" element={<SymptomMaster />} />
        <Route path="aggravating-factor-master" element={<AggravatingFactorMaster />} />
        <Route path="pharmaceutical-salt-type-master" element={<PharmaceuticalSaltTypeMaster />} />
        <Route path="pharmaceutical-salt-master" element={<PharmaceuticalSaltMaster />} />
        <Route path="dosage-master" element={<DosageMaster />} />
        <Route path="medicine-frequency-master" element={<MedicineFrequencyMaster />} />
        <Route path="therapy-master" element={<TherapyMaster />} />
        <Route path="procedure-master" element={<ProcedureMaster />} />
        <Route path="disease-master" element={<DiseaseMaster />} />
        <Route path="allergy-category-master" element={<AllergyCategoryMaster />} />
        <Route path="allergy-master" element={<AllergyMaster />} />
        <Route path="truma-category-master" element={<TrumaCategoryMaster />} />
        <Route path="truma-master" element={<TraumaMaster />} />
        <Route path="occupation-category-master" element={<OccupationCategoryMaster />} />
        <Route path="occupation-master" element={<OccupationMaster />} />
        <Route path="habit-category-master" element={<HabitCategoryMaster />} />
        <Route path="habit-master" element={<HabitMaster />} />
        <Route path="reason-referral-master" element={<ReasonReferralMaster />} />
        <Route path="investigation-category-master" element={<InvestigationCategoryMaster />} />
        <Route path="investigation-master" element={<InvestigationMaster />} />
        <Route path="diagnosis-master" element={<DiagnosisMaster />} />
        <Route path="diagnosis-type-master" element={<DiagnosisTypeMaster />} />
        <Route path="lifestyle-intervention-master" element={<LifestyleInterventionMaster />} />
        <Route path="second-opinion-query-master" element={<SecondOpinionQueryMaster />} />
        <Route path="comorbidity-master" element={<ComorbidityMaster />} />
        <Route path="risk-factor-master" element={<RiskFactorMaster />} />
        <Route path="patient-concern-master" element={<PatientConcernMaster />} />
        <Route path="logstical-consideration-master" element={<LogsticalConsiderationMaster />} />
      </Route>

      {/* ---------------- HEALTH PROFILING ---------------- */}
      <Route path="health-profilling-questions" element={<HealthProfillingQuestions />} />

      {/* 404 INSIDE ADMIN */}
      <Route path="*" element={<ErrorPage />} />
    </Route>
  </Routes>
);

export default AdminRoutes;
