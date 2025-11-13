import React, { useEffect, useState } from "react";
import BankDetails from "../sub_forms/BankDetails";

function Bankdetails() {
  const [profile_sub_tab, setprofile_sub_tab] = useState("Bank Details");

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="flex justify-start mb-6 border-gray-200 rounded-lg overflow-auto">
        <button
          onClick={() => setprofile_sub_tab("Bank Details")}
          className={`px-2 md:px-4 py-3 rounded-tl-[10px] bg-[rgba(189,196,212,0.3)] text-center font-lora text-[18px] font-semibold leading-normal whitespace-nowrap transition-all duration-200 ${profile_sub_tab === "Bank Details"
              ? "underline webprimary"
              : "text-webprimary"
            }`}
        >
          Bank Details
        </button>
      </div>

      {/* Tab Content */}
      <div className="px-5 py-3">
        {profile_sub_tab === "Bank Details" && <BankDetails />}
      </div>
    </div>
  );
}

export default Bankdetails;
