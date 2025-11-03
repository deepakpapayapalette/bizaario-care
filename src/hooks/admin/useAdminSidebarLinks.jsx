import { LayoutDashboard, Settings2, Siren } from "lucide-react";
import MedicalInformationTwoToneIcon from '@mui/icons-material/MedicalInformationTwoTone';
import HealthAndSafetyTwoToneIcon from '@mui/icons-material/HealthAndSafetyTwoTone';
import DepartureBoardTwoToneIcon from '@mui/icons-material/DepartureBoardTwoTone';
import VerifiedUserTwoToneIcon from '@mui/icons-material/VerifiedUserTwoTone';
import MedicalServicesTwoToneIcon from '@mui/icons-material/MedicalServicesTwoTone';
const useAdminSidebarLinks = (role) => {
  // Links for Service Manager
  const serviceManagerLinks = [
    { id: "1", icon: <LayoutDashboard />, label: "Dashboard", link: "/dashboard", dock: true },
    { id: "2", icon: <HealthAndSafetyTwoToneIcon />, label: "Command Center", link: "/dashboard/command-center", dock: true },
    {
      id: "3", icon: <MedicalInformationTwoToneIcon />, label: "Fleet Management", link: "/dashboard/fleet-management", dock: false, subList: [
        { id: "3-1", icon: <MedicalInformationTwoToneIcon />, path: "/dashboard/fleet-management/driver", title: "Driver Dashboard" },
        { id: "3-2", icon: <MedicalServicesTwoToneIcon />, path: "/dashboard/fleet-management/vehicle", title: "Vehicle Dashboard" },
      ]
    },
    { id: "4", icon: <DepartureBoardTwoToneIcon />, label: "Duty Allocation", link: "/dashboard/duty-allocation", dock: true },
    { id: "5", icon: <Siren />, label: "Incident Master", link: "/dashboard/incident-master", dock: true },
  ];

  // Links for Super Admin
  const superAdminLinks = [
    { id: "1", icon: <LayoutDashboard />, label: "Dashboard", link: "/admin", dock: true },
    {
      id: "2",
      icon: <Settings2 />,
      label: "Configuration",
      link: "/admin/configuration",
      dock: false,
      subList: [
        { id: "2-1", icon: <VerifiedUserTwoToneIcon />, path: "/admin/configuration/unit-type", title: "Unit Type" },
      ],
    },

  ];

  if (role === "Service Manager") {
    return serviceManagerLinks;
  }
  if (role === "Super Admin") {
    return superAdminLinks;
  }
  return [];

};

export default useAdminSidebarLinks;
