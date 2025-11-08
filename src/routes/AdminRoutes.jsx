import { Route, Routes } from "react-router-dom";
import ErrorPage from "../pages/ErrorPage";
import AdminLayout from "../layouts/AdminLayout";
import Admindashboard from "../pages/admin/dashboard/Admindashboard";

import CountryGroupMaster from "../pages/admin/configuration/CountryGroupMaster";
import OrgUnitMaster from "../pages/admin/configuration/OrgUnitMaster";
import MedicalSpeciality from "../pages/admin/configuration/MedicalSpeciality";

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminLayout />}>

      <Route index element={<Admindashboard />} />
      <Route path="configuration/">
        <Route path="country-group-master" element={<CountryGroupMaster />} />
        <Route path="org-unit-master" element={<OrgUnitMaster />} />
        <Route path="medical-speciality" element={<MedicalSpeciality />} />
      </Route>


      {/* Catch-all inside admin */}

      <Route path="*" element={<ErrorPage />} />
    </Route>
  </Routes>
);

export default AdminRoutes;
