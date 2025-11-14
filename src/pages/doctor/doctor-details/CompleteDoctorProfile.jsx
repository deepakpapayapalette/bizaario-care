import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";

import ClinicDetailsForm from "./completeProfileMainForm/clinic_details_forms";
import Profiling from "./completeProfileMainForm/Profiling";
import Specialties from "./completeProfileMainForm/Specialties";
import ClinicSchedule from "./completeProfileMainForm/ClinicSchedule";
import BankDetails from "./sub_forms/BankDetails";

const TabButton = ({ step, label, active, onClick }) => (
  <div className="">

    <div
      onClick={onClick}
      className={`flex flex-col justify-center items-center gap-2 rounded-xl w-[230px] h-[103px] p-3 cursor-pointer transition-all duration-200 ${active ? "bg-webprimary" : "bg-[rgba(82,103,125,0.15)]"
        }`}
    >
      <span
        className={`w-12 h-12 flex items-center justify-center rounded-full bg-[rgba(189,196,212,0.30)] font-semibold  ${active ? "text-white" : "text-black"
          }`}
      >
        {step}
      </span>
      <p
        className={`m-0  font-semibold ${active ? "text-white" : "text-black"
          }`}
      >
        {label}
      </p>
    </div>
  </div>
);

const CollapsibleSection = ({ title, isOpen, onToggle, children }) => (
  <div className="w-full">
    <button
      onClick={onToggle}
      className="flex justify-between items-center w-full text-left  text-[20px] py-2 px-3 border border-gray-300 rounded-md bg-[rgba(189,196,212,0.30)]"
    >
      {title}
      <span className="text-gray-500">{isOpen ? "▲" : "▼"}</span>
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
        }`}
    >
      <div className="border border-gray-300 rounded-md p-3 bg-[rgba(189,196,212,0.30)]">
        {children}
      </div>
    </div>
  </div>
);

const CompleteDoctorProfile = () => {
  const [assetCategory, setAssetCategory] = useState("");
  const [isActive, setIsActive] = useState("Clinic Details");
  const [showPreview, setShowPreview] = useState(false);
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const category = user?.AssetCategoryLevel1?.lookup_value;
      setAssetCategory(category || "");
    }
  }, []);

  const getHeadingText = () => {
    const isHospital = assetCategory === "Hospital";
    return {
      title: `Enter Details for Active ${isHospital ? "Hospital" : "Doctor"} Profile`,
      subtitle: `Add or update the required details for the active ${isHospital ? "hospital" : "doctor"} profile to keep records accurate and complete.`,
    };
  };

  const tabs = [
    { step: 1, label: assetCategory === "Hospital" ? "Hospital Details" : "Clinic Details", value: "Clinic Details" },
    { step: 2, label: "Profiling", value: "Profiling" },
    { step: 3, label: "Specialties & Charge", value: "Specialties & Charge" },
    { step: 4, label: "Bank Details", value: "Bank Details" },
    { step: 5, label: "Clinic Schedule", value: "Clinic Schedule" },
  ];

  const formSections = {
    "Clinic Details": <ClinicDetailsForm />,
    "Profiling": <Profiling />,
    "Specialties & Charge": <Specialties />,
    "Bank Details": <BankDetails />,
    "Clinic Schedule": <ClinicSchedule />,
  };

  // const previewSections = [
  //   "Incorporative Details",
  //   "Hospital Size",
  //   "Address",
  //   "Assets Profile",
  //   "Social Media Assets",
  //   "Contact Details",
  //   "Medical Specialties",
  //   "Treatment Package",
  //   "Fee & Charge",
  //   "Bank Details",
  //   "OPD Schedule",
  //   "Online Clinic",
  // ];

  return (
    <div className="container my-8 ">
      <div className="main-content">
        <h2 className="mb-2 text-3xl font-semibold">{getHeadingText().title}</h2>
        <p className="mb-6 text-gray-600">{getHeadingText().subtitle}</p>

        {/* Tabs */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-semibold text-xl">
            {assetCategory === "Hospital" ? "Hospital's Profiling" : "Doctor's Profiling"}
          </h2>
          {/* <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 py-2 px-5 rounded-md border border-[#52677D] text-[#52677D] text-sm font-medium"
          >
            <FaEye /> Preview
          </button> */}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4">
          {tabs.map((tab) => (
            <TabButton
              key={tab.value}
              {...tab}
              active={isActive === tab.value}
              onClick={() => setIsActive(tab.value)}
            />
          ))}
        </div>

        {/* Active Form */}
        <div className="mt-6 bg-white border border-gray-300 rounded-lg p-4">
          {formSections[isActive]}
        </div>
      </div>

      {/* Preview Drawer */}
      {/* {showPreview && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setShowPreview(false)} />
          <div
            className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-lg transform transition-transform duration-300 ${showPreview ? "translate-x-0" : "translate-x-full"
              }`}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold ">Preview</h2>
              <button onClick={() => setShowPreview(false)} className="text-xl">×</button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-60px)]">
              {previewSections.map((section, idx) => (
                <CollapsibleSection
                  key={idx}
                  title={section}
                  isOpen={openSection === idx}
                  onToggle={() => setOpenSection(openSection === idx ? null : idx)}
                >
                  <p className="text-sm ">Clinic Name: XYZ Clinic</p>
                  <p className="text-sm ">Address: 123 Main St</p>
                  <p className="text-sm ">Timings: 9 AM - 5 PM</p>
                  <p className="text-sm ">Contact: 9876543210</p>
                </CollapsibleSection>
              ))}
            </div>
          </div>
        </>
      )} */}
    </div>
  );
};

export default CompleteDoctorProfile;
