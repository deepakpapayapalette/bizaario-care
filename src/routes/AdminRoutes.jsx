import { Route, Routes } from "react-router-dom";
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

const AdminRoutes = () => (
  <Routes>
    <Route path="/" element={<AdminLayout />}>

      <Route index element={<Admindashboard />} />
      <Route path="configuration/">
        <Route path="country-group-master" element={<CountryGroupMaster />} />
        <Route path="org-unit-master" element={<OrgUnitMaster />} />
        <Route path="medical-speciality" element={<MedicalSpeciality />} />
        <Route path="service-category" element={<ServiceCategory />} />
        <Route path="content-type" element={<ContentType />} />
        <Route path="event-type" element={<EventType />} />
        <Route path="asset-category-level1" element={<AssetCategoryLevel1 />} />
        <Route path="asset-category-level2" element={<AssetCategoryLevel2 />} />
      </Route>


      {/* Catch-all inside admin */}

      <Route path="*" element={<ErrorPage />} />
    </Route>
  </Routes>
);

export default AdminRoutes;
