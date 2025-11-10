import { LayoutDashboard, Settings2, Siren } from "lucide-react";
import MedicalInformationTwoToneIcon from '@mui/icons-material/MedicalInformationTwoTone';
import HealthAndSafetyTwoToneIcon from '@mui/icons-material/HealthAndSafetyTwoTone';
import DepartureBoardTwoToneIcon from '@mui/icons-material/DepartureBoardTwoTone';
import VerifiedUserTwoToneIcon from '@mui/icons-material/VerifiedUserTwoTone';
import MedicalServicesTwoToneIcon from '@mui/icons-material/MedicalServicesTwoTone';
const useAdminSidebarLinks = (role) => {
  console.log(role)



  // Links for Super Admin


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


      ],
    },
  ];

  const doctorsAdminLinks = [
    { id: "1", icon: <LayoutDashboard />, label: "Doctor Dashboard", link: "/doctordashboard", dock: true },
    { id: "2", icon: <LayoutDashboard />, label: "Doctor Dashboard2", link: "/", dock: true },
  ];

  const hospitalAdminLinks = [
    { id: "1", icon: <LayoutDashboard />, label: "hospital dashboard", link: "/admin", dock: true },

  ];


  if (role === "Doctor") {
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
