import React, { useState } from "react";
import AssetProfile from "../sub_forms/AssetProfile";
import SocialMediaAssets from "../sub_forms/SocialMediaAssets";
import ContactInformation from "../sub_forms/ContactInformation";

function Profiling() {
  const [profile_sub_tab, setprofile_sub_tab] = useState("Asset Profile");
  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="flex justify-start mb-6 border-gray-200 rounded-lg overflow-auto">
        {/* Asset Profile Tab */}
        <button
          onClick={() => setprofile_sub_tab("Asset Profile")}
          className={`px-2 md:px-4 py-3 rounded-tl-[10px] bg-[rgba(189,196,212,0.3)] text-center font-lora text-[18px] font-semibold leading-normal whitespace-nowrap transition-all duration-200 ${profile_sub_tab === "Asset Profile"
            ? "underline webprimary"
            : "text-webprimary"
            }`}
        >
          Assets Profile
        </button>

        {/* Social Media Assets Tab */}
        <button
          onClick={() => setprofile_sub_tab("Social Media Asset")}
          className={`px-2 md:px-4 py-3 bg-[rgba(189,196,212,0.3)] text-center font-lora text-[18px] font-semibold leading-normal whitespace-nowrap transition-all duration-200 ${profile_sub_tab === "Social Media Asset"
            ? "underline webprimary"
            : "text-webprimary"
            }`}
        >
          Social Media Assets
        </button>

        {/* Contact Details Tab */}
        <button
          onClick={() => setprofile_sub_tab("Contact Details")}
          className={`px-2 md:px-4 py-3 rounded-tr-[10px] bg-[rgba(189,196,212,0.3)] text-center font-lora text-[18px] font-semibold leading-normal whitespace-nowrap transition-all duration-200 ${profile_sub_tab === "Contact Details"
            ? "underline webprimary"
            : "text-webprimary"
            }`}
        >
          Contact Details
        </button>
      </div>

      {/* Tab Content */}
      <div className="px-5 py-3">
        {profile_sub_tab === "Asset Profile" && <AssetProfile />}
        {profile_sub_tab === "Social Media Asset" && <SocialMediaAssets />}
        {profile_sub_tab === "Contact Details" && <ContactInformation />}
      </div>
    </div>
  );
}

export default Profiling;
