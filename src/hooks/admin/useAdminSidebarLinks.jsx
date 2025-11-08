import { LayoutDashboard, Settings2, Siren } from "lucide-react";
import MedicalInformationTwoToneIcon from '@mui/icons-material/MedicalInformationTwoTone';
import HealthAndSafetyTwoToneIcon from '@mui/icons-material/HealthAndSafetyTwoTone';
import DepartureBoardTwoToneIcon from '@mui/icons-material/DepartureBoardTwoTone';
import VerifiedUserTwoToneIcon from '@mui/icons-material/VerifiedUserTwoTone';
import MedicalServicesTwoToneIcon from '@mui/icons-material/MedicalServicesTwoTone';
const useAdminSidebarLinks = (role) => {


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
      ],
    },
  ];

  const doctorsAdmin = [
    { id: "1", icon: <LayoutDashboard />, label: "Doctor Dashboard", link: "/doctordashboard", dock: true },
  ];

  const hospitalAdmin = [
    { id: "1", icon: <LayoutDashboard />, label: "hospital dashboard", link: "/admin", dock: true },

  ];

  if (role === "Doctor") {
    return doctorsAdmin;
  }
  if (role === "Hospital") {
    return hospitalAdmin;

  }
  if (role === "Super Admin") {
    return superAdminLinks;
  }
  return [];

};

export default useAdminSidebarLinks;
