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
    { id: "4", icon: <TbDeviceDesktopCog />, label: "Assets Master", link: "/admindashboard/assets-master", dock: true },
    { id: "5", icon: <TbDeviceDesktopCog />, label: "Login Master", link: "/admindashboard/login-master", dock: true },
    { id: "6", icon: <TbDeviceDesktopCog />, label: "Content Master", link: "/admindashboard/content-master", dock: true },
    { id: "7", icon: <TbDeviceDesktopCog />, label: "Event Master", link: "/admindashboard/event-master", dock: true },
    {
      id: "8",
      icon: <Settings2 />,
      label: "Bizaario Master Section",
      link: "/admindashboard/bizaario-master",
      dock: false,
      subList: [
        { id: "8-1", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/patient-referral-type", title: "Country Group Maste" },
        { id: "8-2", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/symptom-class-master", title: "Symptom Class Master" },
        { id: "8-3", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/symptom-master", title: "Symptom Master" },
        { id: "8-4", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/aggravating-factor-master", title: "Aggravating Factor Master" },
        { id: "8-5", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/pharmaceutical-salt-type-master", title: "Pharmaceutical Salt Type Master" },
        { id: "8-6", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/pharmaceutical-salt-master", title: "Pharmaceutical Salt Master" },
        { id: "8-7", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/dosage-master", title: "Dosage Master" },
        { id: "8-8", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/medicine-frequency-master", title: "Medicine Frequency Master" },
        { id: "8-9", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/therapy-master", title: "Therapy Master" },
        { id: "8-10", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/procedure-master", title: "Procedure Master" },
        { id: "8-11", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/disease-master", title: "Disease Master" },
        { id: "8-12", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/allergy-category-master", title: "Allergy Category Master" },
        { id: "8-13", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/allergy-master", title: "Allergy  Master" },
        { id: "8-14", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/truma-category-master", title: "Truma Category Master" },
        { id: "8-15", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/truma-master", title: "Truma  Master" },
        { id: "8-16", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/occupation-category-master", title: "Occupation Category Master" },
        { id: "8-17", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/occupation-master", title: "Occupation  Master" },
        { id: "8-18", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/habit-category-master", title: "Habit Category Master" },
        { id: "8-19", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/habit-master", title: "Habit Master" },
        { id: "8-20", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/reason-referral-master", title: "Reason For Referral Master" },
        { id: "8-21", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/investigation-category-master", title: "Investigation Category Master" },
        { id: "8-22", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/investigation-master", title: "Investigation Master" },
        { id: "8-23", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/diagnosis-master", title: "Diagnosis Master" },
        { id: "8-24", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/diagnosis-type-master", title: "Diagnosis Type Master" },
        { id: "8-25", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/lifestyle-intervention-master", title: "Lifestyle Intervention Master" },
        { id: "8-26", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/second-opinion-query-master", title: "Second Opinion Query Master" },
        { id: "8-27", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/comorbidity-master", title: " Comorbidity Master" },
        { id: "8-28", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/risk-factor-master", title: "Risk Factor Master" },
        { id: "8-29", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/patient-concern-master", title: "Patient Concern Master" },
        { id: "8-30", icon: <VerifiedUserTwoToneIcon />, path: "/admindashboard/bizaario-master/logstical-consideration-master", title: "Logstical Consideration Master" },
      ],
    },
    { id: "9", icon: <TbDeviceDesktopCog />, label: "Health Profilling Questions", link: "/admindashboard/health-profilling-questions", dock: true },
  ];
  const doctorsAdminLinks = [
    { id: "1", icon: <LayoutDashboard />, label: "Dashboard", link: "/doctordashboard", dock: true },
    { id: "2", icon: <TbDeviceDesktopCog />, label: "Digital CME", link: "/doctordashboard/digital-cme", dock: true },
    { id: "3", icon: <TbDeviceDesktopCog />, label: "News Article", link: "/doctordashboard/news-article", dock: true },
    { id: "4", icon: <TbDeviceDesktopCog />, label: "Awards & Recognitions", link: "/doctordashboard/awards-recognitions", dock: true },
    { id: "5", icon: <TbDeviceDesktopCog />, label: "Patient Testimonials", link: "/doctordashboard/patient-testimonials", dock: true },
    { id: "6", icon: <TbDeviceDesktopCog />, label: "OPD Surgical Camps", link: "/doctordashboard/opd-srugicla-camps", dock: true },
    { id: "7", icon: <TbDeviceDesktopCog />, label: "Workshop", link: "/doctordashboard/workshop", dock: true },
    // { id: "8", icon: <TbDeviceDesktopCog />, label: "Complete Doctor Profileshop", link: "/doctordashboard/complete-doctor-profile", dock: true },
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
