import Clinic_details_forms from "./completeProfileMainForm/clinic_details_forms";
import Profiling from "./completeProfileMainForm/profiling_forms";
import Bankdetails from "./completeProfileMainForm/bank_details_form";
import ClinicSchedule from "./completeProfileMainForm/clinic_schedule_form";
import Specialties from "./completeProfileMainForm/specialties_charge";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState, useEffect } from "react";
const CompleteDoctorProfile = () => {
  // Add state for asset category
  const [assetCategory, setAssetCategory] = useState("");

  // ==============================clinic details forms===========================================

  const [isactive, setisactive] = useState("Clinic Details");

  const [showPreview, setShowPreview] = React.useState(false);

  const [showDetails, setShowDetails] = useState(false);

  // Get asset category on component mount
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const category = user?.AssetCategoryLevel1?.lookup_value;
      setAssetCategory(category);
    }
  }, []);

  // Get heading text based on asset category
  const getHeadingText = () => {
    if (assetCategory === "Hospital") {
      return {
        title: "Enter Details for Active Hospital Profile",
        subtitle:
          "Add or update the required details for the active hospital profile to keep records accurate and complete.",
      };
    }
    return {
      title: "Enter Details for Active Doctor Profile",
      subtitle:
        "Add or update the required details for the active doctor profile to keep records accurate and complete.",
    };
  };
  return (
    <div className="container mt-8">
      <div className="content-wrapper">
        <div className="main-content">
          <h2
            className="mb-2 text-2xl font-semibold"
            style={{ fontFamily: "Lora" }}
          >
            {getHeadingText().title}
          </h2>
          <p className="mb-6 text-gray-600" style={{ fontFamily: "Poppins" }}>
            {getHeadingText().subtitle}
          </p>

          <div
            className="grid grid-cols-12 gap-4"
            style={{ display: "block" }}
          >
            {/* Section 1 */}
            <div className="col-span-4 bg-white">
              <div className="flex items-center justify-between w-full gap-2 flex-nowrap">
                <h2 className="font-semibold text-xl font-[Lora] truncate">
                  {assetCategory === "Hospital"
                    ? "Hospital's Profiling"
                    : "Doctor's Profiling"}
                </h2>

                <button
                  onClick={() => setShowPreview(true)}
                  className="
          flex items-center gap-[10px]
          py-[11px] px-[22px]
          rounded-[5px] border border-[#52677D]
          text-[#52677D] font-[Lora] text-[14px] font-medium leading-normal
        "
                >
                  <FaEye className="text-[#52677D]" />
                  <span>Preview</span>
                </button>
              </div>

              <div
                className="flex gap-2 mt-10 overflow-x-auto flex-nowrap sm:overflow-visible"
                style={{ cursor: "pointer" }}
              >
                <div
                  onClick={() => setisactive("Clinic Details")}
                  style={{
                    display: "flex",
                    width: "230px",
                    height: "103px",
                    padding: "10px 20px",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "9px",
                    borderRadius: "10px",
                    background:
                      isactive === "Clinic Details"
                        ? "#52677D"
                        : "rgba(82, 103, 125, 0.15)",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      width: "48px",
                      height: "48px",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%", // ✅ perfect circle
                      background: "rgba(189, 196, 212, 0.30)",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color:
                        isactive === "Clinic Details" ? "white" : "black",
                      fontFamily: "Lora",
                    }}
                  >
                    1
                  </span>
                  <p
                    style={{
                      margin: 0,
                      color:
                        isactive === "Clinic Details" ? "white" : "black",
                      fontWeight: "600",
                      fontFamily: "Lora",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {assetCategory === "Hospital"
                      ? "Hospital Details"
                      : "Clinic Details"}
                  </p>
                </div>

                {/* =================================profiling ==============================================*/}
                <div
                  onClick={() => setisactive("Profiling")}
                  style={{
                    display: "flex",
                    width: "230px",
                    height: "103px",
                    padding: "10px 20px",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "9px",
                    borderRadius: "10px",
                    background:
                      isactive === "Profiling"
                        ? "#52677D"
                        : "rgba(82, 103, 125, 0.15)",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      width: "48px",
                      height: "48px",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%", // ✅ perfect circle
                      background: "rgba(189, 196, 212, 0.30)",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: isactive === "Profiling" ? "white" : "black",
                      fontFamily: "Lora",
                    }}
                  >
                    2
                  </span>
                  <p
                    style={{
                      margin: 0,
                      color: isactive === "Profiling" ? "white" : "black",
                      fontWeight: "600",
                      fontFamily: "Lora",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Profiling
                  </p>
                </div>

                {/* =================================specialties and charge ======================================*/}
                <div
                  onClick={() => setisactive("Specialties & Charge")}
                  style={{
                    display: "flex",
                    width: "230px",
                    height: "103px",
                    padding: "10px 20px",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "9px",
                    borderRadius: "10px",
                    background:
                      isactive === "Specialties & Charge"
                        ? "#52677D"
                        : "rgba(82, 103, 125, 0.15)",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      width: "48px",
                      height: "48px",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%", // ✅ perfect circle
                      background: "rgba(189, 196, 212, 0.30)",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color:
                        isactive === "Specialties & Charge"
                          ? "white"
                          : "black",
                      fontFamily: "Lora",
                    }}
                  >
                    3
                  </span>
                  <p
                    style={{
                      margin: 0,
                      color:
                        isactive === "Specialties & Charge"
                          ? "white"
                          : "black",
                      fontWeight: "600",
                      fontFamily: "Lora",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Specialties & Charge
                  </p>
                </div>

                {/*======================================= bank details======================================= */}
                <div
                  onClick={() => setisactive("Bank Details")}
                  style={{
                    display: "flex",
                    width: "230px",
                    height: "103px",
                    padding: "10px 20px",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "9px",
                    borderRadius: "10px",
                    background:
                      isactive === "Bank Details"
                        ? "#52677D"
                        : "rgba(82, 103, 125, 0.15)",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      width: "48px",
                      height: "48px",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%", // ✅ perfect circle
                      background: "rgba(189, 196, 212, 0.30)",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color: isactive === "Bank Details" ? "white" : "black",
                      fontFamily: "Lora",
                    }}
                  >
                    4
                  </span>
                  <p
                    style={{
                      margin: 0,
                      color: isactive === "Bank Details" ? "white" : "black",
                      fontWeight: "600",
                      fontFamily: "Lora",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Bank Details
                  </p>
                </div>

                {/*================================== clinic schedule========================================= */}
                <div
                  onClick={() => setisactive("Clinic Schedule")}
                  style={{
                    display: "flex",
                    width: "230px",
                    height: "103px",
                    padding: "10px 20px",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "9px",
                    borderRadius: "10px",
                    background:
                      isactive === "Clinic Schedule"
                        ? "#52677D"
                        : "rgba(82, 103, 125, 0.15)",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      width: "48px",
                      height: "48px",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "50%", // ✅ perfect circle
                      background: "rgba(189, 196, 212, 0.30)",
                      fontWeight: "bold",
                      fontSize: "16px",
                      color:
                        isactive === "Clinic Schedule" ? "white" : "black",
                      fontFamily: "Lora",
                    }}
                  >
                    5
                  </span>
                  <p
                    style={{
                      margin: 0,
                      color:
                        isactive === "Clinic Schedule" ? "white" : "black",
                      fontWeight: "600",
                      fontFamily: "Lora",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Clinic Schedule
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/*============================= second form section ===========================================*/}

          <div className="flex gap-2 mt-10 overflow-x-auto flex-nowrap sm:overflow-visible">
            <div
              style={{
                display: isactive === "Clinic Details" ? "flex" : "none",
                width: "100%",
                height: "auto",
                flexDirection: "column",
                gap: "9px",
                borderRadius: "10px",
                backgroundColor: "white",
                border: "1px solid black",
              }}
            >
              <Clinic_details_forms />
            </div>

            <div
              style={{
                display: isactive === "Profiling" ? "flex" : "none",
                width: "100%",
                height: "auto",
                flexDirection: "column",
                gap: "9px",
                borderRadius: "10px",
                backgroundColor: "white",
                border: "1px solid black",
              }}
            >
              <Profiling />
            </div>

            <div
              style={{
                display:
                  isactive === "Specialties & Charge" ? "flex" : "none",
                width: "100%",
                height: "auto",
                flexDirection: "column",
                gap: "9px",
                borderRadius: "10px",
                backgroundColor: "white",
                border: "1px solid black",
              }}
            >
              <Specialties />
            </div>

            <div
              style={{
                display: isactive === "Bank Details" ? "flex" : "none",
                width: "100%",
                height: "auto",
                flexDirection: "column",
                gap: "9px",
                borderRadius: "10px",
                backgroundColor: "white",
                border: "1px solid black",
              }}
            >
              <Bankdetails />
            </div>

            <div
              style={{
                display: isactive === "Clinic Schedule" ? "flex" : "none",
                width: "100%",
                height: "auto",
                flexDirection: "column",
                gap: "9px",
                borderRadius: "10px",
                backgroundColor: "white",
                border: "1px solid black",
              }}
            >
              <ClinicSchedule />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay (dim background) */}
      {showPreview && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setShowPreview(false)}
        />
      )}


      <div
        className={`
    fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-lg
    transform transition-transform duration-300 ease-in-out
    ${showPreview ? "translate-x-0" : "translate-x-full"}
  `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold font-[Lora]">Preview</h2>
          <button onClick={() => setShowPreview(false)} className="text-xl">
            ×
          </button>
        </div>

        {/* Body with dropdowns */}
        <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-60px)]">
          {/* Example dropdowns */}
          <div className="w-full">
            {/* Clickable label */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex justify-between items-center w-full text-left text-sm  font-[Lora] text-[20px] py-2 px-3 border border-gray-300 rounded-md bg-[rgba(189,196,212,0.30)]"
            >
              Incorporative Details
              <span className="text-gray-500">{showDetails ? "▲" : "▼"}</span>
            </button>

            {/* Collapsible content */}
            <div
              className={`overflow-hidden transition-all duration-300 ${showDetails
                ? "max-h-96 opacity-100 mt-2"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="border border-gray-300 rounded-md p-3  bg-[rgba(189,196,212,0.30)]">
                {/* Your clinic details content here */}
                <p className="text-sm font-[Lora]">Clinic Name: XYZ Clinic</p>
                <p className="text-sm font-[Lora]">Address: 123 Main St</p>
                <p className="text-sm font-[Lora]">Timings: 9 AM - 5 PM</p>
                <p className="text-sm font-[Lora]">Contact: 9876543210</p>
              </div>
            </div>
          </div>

          {/* Example dropdowns */}
          <div className="w-full">
            {/* Clickable label */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex justify-between items-center w-full text-left text-sm  font-[Lora] text-[20px] py-2 px-3 border border-gray-300 rounded-md bg-[rgba(189,196,212,0.30)]"
            >
              Hospital Size
              <span className="text-gray-500">{showDetails ? "▲" : "▼"}</span>
            </button>

            {/* Collapsible content */}
            <div
              className={`overflow-hidden transition-all duration-300 ${showDetails
                ? "max-h-96 opacity-100 mt-2"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="border border-gray-300 rounded-md p-3  bg-[rgba(189,196,212,0.30)]">
                {/* Your clinic details content here */}
                <p className="text-sm font-[Lora]">Clinic Name: XYZ Clinic</p>
                <p className="text-sm font-[Lora]">Address: 123 Main St</p>
                <p className="text-sm font-[Lora]">Timings: 9 AM - 5 PM</p>
                <p className="text-sm font-[Lora]">Contact: 9876543210</p>
              </div>
            </div>
          </div>

          <div className="w-full">
            {/* Clickable label */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex justify-between items-center w-full text-left text-sm  font-[Lora] text-[20px] py-2 px-3 border border-gray-300 rounded-md bg-[rgba(189,196,212,0.30)]"
            >
              Address
              <span className="text-gray-500">{showDetails ? "▲" : "▼"}</span>
            </button>

            {/* Collapsible content */}
            <div
              className={`overflow-hidden transition-all duration-300 ${showDetails
                ? "max-h-96 opacity-100 mt-2"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="border border-gray-300 rounded-md p-3  bg-[rgba(189,196,212,0.30)]">
                {/* Your clinic details content here */}
                <p className="text-sm font-[Lora]">Clinic Name: XYZ Clinic</p>
                <p className="text-sm font-[Lora]">Address: 123 Main St</p>
                <p className="text-sm font-[Lora]">Timings: 9 AM - 5 PM</p>
                <p className="text-sm font-[Lora]">Contact: 9876543210</p>
              </div>
            </div>
          </div>

          <div className="w-full">
            {/* Clickable label */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex justify-between items-center w-full text-left text-sm  font-[Lora] text-[20px] py-2 px-3 border border-gray-300 rounded-md bg-[rgba(189,196,212,0.30)]"
            >
              Assets Profile
              <span className="text-gray-500">{showDetails ? "▲" : "▼"}</span>
            </button>

            {/* Collapsible content */}
            <div
              className={`overflow-hidden transition-all duration-300 ${showDetails
                ? "max-h-96 opacity-100 mt-2"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="border border-gray-300 rounded-md p-3  bg-[rgba(189,196,212,0.30)]">
                {/* Your clinic details content here */}
                <p className="text-sm font-[Lora]">Clinic Name: XYZ Clinic</p>
                <p className="text-sm font-[Lora]">Address: 123 Main St</p>
                <p className="text-sm font-[Lora]">Timings: 9 AM - 5 PM</p>
                <p className="text-sm font-[Lora]">Contact: 9876543210</p>
              </div>
            </div>
          </div>

          <div className="w-full">
            {/* Clickable label */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex justify-between items-center w-full text-left text-sm  font-[Lora] text-[20px] py-2 px-3 border border-gray-300 rounded-md bg-[rgba(189,196,212,0.30)]"
            >
              Social Media Assets
              <span className="text-gray-500">{showDetails ? "▲" : "▼"}</span>
            </button>

            {/* Collapsible content */}
            <div
              className={`overflow-hidden transition-all duration-300 ${showDetails
                ? "max-h-96 opacity-100 mt-2"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="border border-gray-300 rounded-md p-3  bg-[rgba(189,196,212,0.30)]">
                {/* Your clinic details content here */}
                <p className="text-sm font-[Lora]">Clinic Name: XYZ Clinic</p>
                <p className="text-sm font-[Lora]">Address: 123 Main St</p>
                <p className="text-sm font-[Lora]">Timings: 9 AM - 5 PM</p>
                <p className="text-sm font-[Lora]">Contact: 9876543210</p>
              </div>
            </div>
          </div>

          <div className="w-full">
            {/* Clickable label */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex justify-between items-center w-full text-left text-sm  font-[Lora] text-[20px] py-2 px-3 border border-gray-300 rounded-md bg-[rgba(189,196,212,0.30)]"
            >
              Contact Details
              <span className="text-gray-500">{showDetails ? "▲" : "▼"}</span>
            </button>

            {/* Collapsible content */}
            <div
              className={`overflow-hidden transition-all duration-300 ${showDetails
                ? "max-h-96 opacity-100 mt-2"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="border border-gray-300 rounded-md p-3  bg-[rgba(189,196,212,0.30)]">
                {/* Your clinic details content here */}
                <p className="text-sm font-[Lora]">Clinic Name: XYZ Clinic</p>
                <p className="text-sm font-[Lora]">Address: 123 Main St</p>
                <p className="text-sm font-[Lora]">Timings: 9 AM - 5 PM</p>
                <p className="text-sm font-[Lora]">Contact: 9876543210</p>
              </div>
            </div>
          </div>

          <div className="w-full">
            {/* Clickable label */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex justify-between items-center w-full text-left text-sm  font-[Lora] text-[20px] py-2 px-3 border border-gray-300 rounded-md bg-[rgba(189,196,212,0.30)]"
            >
              Medical Specialties
              <span className="text-gray-500">{showDetails ? "▲" : "▼"}</span>
            </button>

            {/* Collapsible content */}
            <div
              className={`overflow-hidden transition-all duration-300 ${showDetails
                ? "max-h-96 opacity-100 mt-2"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="border border-gray-300 rounded-md p-3  bg-[rgba(189,196,212,0.30)]">
                {/* Your clinic details content here */}
                <p className="text-sm font-[Lora]">Clinic Name: XYZ Clinic</p>
                <p className="text-sm font-[Lora]">Address: 123 Main St</p>
                <p className="text-sm font-[Lora]">Timings: 9 AM - 5 PM</p>
                <p className="text-sm font-[Lora]">Contact: 9876543210</p>
              </div>
            </div>
          </div>

          <div className="w-full">
            {/* Clickable label */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex justify-between items-center w-full text-left text-sm  font-[Lora] text-[20px] py-2 px-3 border border-gray-300 rounded-md bg-[rgba(189,196,212,0.30)]"
            >
              Treatment Package
              <span className="text-gray-500">{showDetails ? "▲" : "▼"}</span>
            </button>

            {/* Collapsible content */}
            <div
              className={`overflow-hidden transition-all duration-300 ${showDetails
                ? "max-h-96 opacity-100 mt-2"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="border border-gray-300 rounded-md p-3  bg-[rgba(189,196,212,0.30)]">
                {/* Your clinic details content here */}
                <p className="text-sm font-[Lora]">Clinic Name: XYZ Clinic</p>
                <p className="text-sm font-[Lora]">Address: 123 Main St</p>
                <p className="text-sm font-[Lora]">Timings: 9 AM - 5 PM</p>
                <p className="text-sm font-[Lora]">Contact: 9876543210</p>
              </div>
            </div>
          </div>

          <div className="w-full">
            {/* Clickable label */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex justify-between items-center w-full text-left text-sm  font-[Lora] text-[20px] py-2 px-3 border border-gray-300 rounded-md bg-[rgba(189,196,212,0.30)]"
            >
              Fee & Charge
              <span className="text-gray-500">{showDetails ? "▲" : "▼"}</span>
            </button>

            {/* Collapsible content */}
            <div
              className={`overflow-hidden transition-all duration-300 ${showDetails
                ? "max-h-96 opacity-100 mt-2"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="border border-gray-300 rounded-md p-3  bg-[rgba(189,196,212,0.30)]">
                {/* Your clinic details content here */}
                <p className="text-sm font-[Lora]">Clinic Name: XYZ Clinic</p>
                <p className="text-sm font-[Lora]">Address: 123 Main St</p>
                <p className="text-sm font-[Lora]">Timings: 9 AM - 5 PM</p>
                <p className="text-sm font-[Lora]">Contact: 9876543210</p>
              </div>
            </div>
          </div>

          <div className="w-full">
            {/* Clickable label */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex justify-between items-center w-full text-left text-sm  font-[Lora] text-[20px] py-2 px-3 border border-gray-300 rounded-md bg-[rgba(189,196,212,0.30)]"
            >
              Bank Details
              <span className="text-gray-500">{showDetails ? "▲" : "▼"}</span>
            </button>

            {/* Collapsible content */}
            <div
              className={`overflow-hidden transition-all duration-300 ${showDetails
                ? "max-h-96 opacity-100 mt-2"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="border border-gray-300 rounded-md p-3  bg-[rgba(189,196,212,0.30)]">
                {/* Your clinic details content here */}
                <p className="text-sm font-[Lora]">Clinic Name: XYZ Clinic</p>
                <p className="text-sm font-[Lora]">Address: 123 Main St</p>
                <p className="text-sm font-[Lora]">Timings: 9 AM - 5 PM</p>
                <p className="text-sm font-[Lora]">Contact: 9876543210</p>
              </div>
            </div>
          </div>

          <div className="w-full">
            {/* Clickable label */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex justify-between items-center w-full text-left text-sm  font-[Lora] text-[20px] py-2 px-3 border border-gray-300 rounded-md bg-[rgba(189,196,212,0.30)]"
            >
              OPD Schedule
              <span className="text-gray-500">{showDetails ? "▲" : "▼"}</span>
            </button>

            {/* Collapsible content */}
            <div
              className={`overflow-hidden transition-all duration-300 ${showDetails
                ? "max-h-96 opacity-100 mt-2"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="border border-gray-300 rounded-md p-3  bg-[rgba(189,196,212,0.30)]">
                {/* Your clinic details content here */}
                <p className="text-sm font-[Lora]">Clinic Name: XYZ Clinic</p>
                <p className="text-sm font-[Lora]">Address: 123 Main St</p>
                <p className="text-sm font-[Lora]">Timings: 9 AM - 5 PM</p>
                <p className="text-sm font-[Lora]">Contact: 9876543210</p>
              </div>
            </div>
          </div>

          <div className="w-full">
            {/* Clickable label */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex justify-between items-center w-full text-left text-sm  font-[Lora] text-[20px] py-2 px-3 border border-gray-300 rounded-md bg-[rgba(189,196,212,0.30)]"
            >
              Online Clinic
              <span className="text-gray-500">{showDetails ? "▲" : "▼"}</span>
            </button>

            {/* Collapsible content */}
            <div
              className={`overflow-hidden transition-all duration-300 ${showDetails
                ? "max-h-96 opacity-100 mt-2"
                : "max-h-0 opacity-0"
                }`}
            >
              <div className="border border-gray-300 rounded-md p-3  bg-[rgba(189,196,212,0.30)]">
                {/* Your clinic details content here */}
                <p className="text-sm font-[Lora]">Clinic Name: XYZ Clinic</p>
                <p className="text-sm font-[Lora]">Address: 123 Main St</p>
                <p className="text-sm font-[Lora]">Timings: 9 AM - 5 PM</p>
                <p className="text-sm font-[Lora]">Contact: 9876543210</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompleteDoctorProfile;


