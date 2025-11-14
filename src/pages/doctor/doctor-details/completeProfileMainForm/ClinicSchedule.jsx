import React, { useState } from "react";
import OpdSchedule from "../sub_forms/OpdSchedule";
import OnlineClinicLink from "../sub_forms/OnlineClinicLink";

function ClinicSchedule() {
  const [profile_sub_tab, setprofile_sub_tab] = useState("OPD Schedule");

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="flex justify-start mb-6 border-gray-200 rounded-lg overflow-auto">
        {/* OPD Schedule Tab */}
        <button
          onClick={() => setprofile_sub_tab("OPD Schedule")}
          className={`px-2 md:px-4 py-3 rounded-tl-[10px] bg-[rgba(189,196,212,0.3)] text-center montserrat font-semibold leading-normal whitespace-nowrap transition-all duration-200 ${profile_sub_tab === "OPD Schedule"
            ? "underline webprimary"
            : "text-webprimary"
            }`}
        >
          OPD Schedule
        </button>

        {/* Online Clinic Tab */}
        <button
          onClick={() => setprofile_sub_tab("Online Clinic")}
          className={`px-2 md:px-4 py-3 rounded-tr-[10px] bg-[rgba(189,196,212,0.3)] text-center montserrat font-semibold leading-normal whitespace-nowrap transition-all duration-200 ${profile_sub_tab === "Online Clinic"
            ? "underline webprimary"
            : "text-webprimary"
            }`}
        >
          Online Clinic
        </button>
      </div>

      {/* Tab Content */}
      <div className="px-5 py-3">
        {profile_sub_tab === "OPD Schedule" && <OpdSchedule />}
        {profile_sub_tab === "Online Clinic" && <OnlineClinicLink />}
      </div>
    </div>
  );
}

export default ClinicSchedule;
