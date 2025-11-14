import React, { useEffect, useState } from "react";
import MedicalSpecialties from "../sub_forms/MedicalSpecialties";
import TreatmentPackages from "../sub_forms/TreatmentPackages";
import FeeCharges from "../sub_forms/FeeCharges";

function Specialties() {
  const [profile_sub_tab, setprofile_sub_tab] = useState("Medical Specialties");

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="flex justify-start mb-6 border-gray-200 rounded-lg overflow-auto">
        {/* Medical Specialties Tab */}
        <button
          onClick={() => setprofile_sub_tab("Medical Specialties")}
          className={`px-2 md:px-4 py-3 rounded-tl-[10px] bg-[rgba(189,196,212,0.3)] text-center montserrat font-semibold leading-normal whitespace-nowrap transition-all duration-200 ${profile_sub_tab === "Medical Specialties"
            ? "underline webprimary"
            : "text-webprimary"
            }`}
        >
          Medical Specialties
        </button>

        {/* Treatment Package Tab */}
        <button
          onClick={() => setprofile_sub_tab("Treatment Package")}
          className={`px-2 md:px-4 py-3 bg-[rgba(189,196,212,0.3)] text-center montserrat font-semibold leading-normal whitespace-nowrap transition-all duration-200 ${profile_sub_tab === "Treatment Package"
            ? "underline webprimary"
            : "text-webprimary"
            }`}
        >
          Treatment Package
        </button>

        {/* Fees & Charge Tab */}
        <button
          onClick={() => setprofile_sub_tab("Fees & Charge")}
          className={`px-2 md:px-4 py-3 rounded-tr-[10px] bg-[rgba(189,196,212,0.3)] text-center montserrat font-semibold leading-normal whitespace-nowrap transition-all duration-200 ${profile_sub_tab === "Fees & Charge"
            ? "underline webprimary"
            : "text-webprimary"
            }`}
        >
          Fees & Charge
        </button>
      </div>

      {/* Tab Content */}
      <div className="px-5 py-3">
        {profile_sub_tab === "Medical Specialties" && <MedicalSpecialties />}
        {profile_sub_tab === "Treatment Package" && <TreatmentPackages />}
        {profile_sub_tab === "Fees & Charge" && <FeeCharges />}
      </div>
    </div>
  );
}

export default Specialties;
