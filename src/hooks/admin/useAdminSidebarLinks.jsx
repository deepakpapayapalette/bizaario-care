import { LayoutDashboard, Settings2, Siren } from "lucide-react";
import MedicalInformationTwoToneIcon from '@mui/icons-material/MedicalInformationTwoTone';
import HealthAndSafetyTwoToneIcon from '@mui/icons-material/HealthAndSafetyTwoTone';
import DepartureBoardTwoToneIcon from '@mui/icons-material/DepartureBoardTwoTone';
import VerifiedUserTwoToneIcon from '@mui/icons-material/VerifiedUserTwoTone';
import MedicalServicesTwoToneIcon from '@mui/icons-material/MedicalServicesTwoTone';
import { TbDeviceDesktopCog } from "react-icons/tb";
const useAdminSidebarLinks = (role) => {

  const cleanRole = role?.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();



  const superAdminLinks = [
    { id: "1", icon: <LayoutDashboard />, label: "Dashboard", link: "/admindashboard", dock: true },
    {
      id: "2",
      icon: <Settings2 />,
      label: "Configuration",
      link: "/admindashboard/configuration",
      dock: false,
      subList: [
        { id: "2-1", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/configuration/country-group-master", title: "Country Group Maste" },
        { id: "2-2", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/configuration/org-unit-master", title: "Org Unit Master" },
        { id: "2-3", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/configuration/medical-speciality", title: "Medical Speciality" },
        { id: "2-4", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/configuration/service-category", title: "Service Category" },
        { id: "2-5", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/configuration/content-type", title: "Content Type" },
        { id: "2-6", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/configuration/event-type", title: "Event Type" },
        { id: "2-7", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/configuration/asset-category-level1", title: "Asset Category Level 1" },
        { id: "2-8", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/configuration/asset-category-level2", title: "Asset Category Level 2" },
        { id: "2-9", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/configuration/asset-category-level3", title: "Asset Category Level 3" },
        { id: "2-10", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/configuration/subscription-type-master", title: "Subscription Type Master" },
        { id: "2-11", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/configuration/relationship-master", title: "Relationship Master" },
        { id: "2-12", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/configuration/insurance-provider-master", title: "Insurance Provider Master" },


      ],
    },
    { id: "3", icon: <TbDeviceDesktopCog />, label: "Station Master", link: "/admindashboard/station-master", dock: true },
    { id: "3", icon: <TbDeviceDesktopCog />, label: "Assets Master", link: "/admindashboard/assets-master", dock: true },
  ];
  const doctorsAdminLinks = [
    { id: "1", icon: <LayoutDashboard />, label: "Doctor Dashboard", link: "/doctordashboard", dock: true },
    { id: "2", icon: <LayoutDashboard />, label: "Doctor Dashboard", link: "/doctordashboard/test", dock: true },
  ];

  const hospitalAdminLinks = [
    { id: "1", icon: <LayoutDashboard />, label: "hospital dashboard", link: "/admin", dock: true },

  ];

  if (role === "Doctor") {
    console.log(role)
    return doctorsAdminLinks;
  }
  if (role === "Hospital") {
    return hospitalAdminLinks;

  }
  if (role === "Super Admin") {
    return superAdminLinks;
  }
  return [];

};

export default useAdminSidebarLinks;
