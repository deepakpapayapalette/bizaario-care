import React, { useEffect, useState } from "react";
import DoctorIncorporationDetails from "../sub_forms/DoctorIncorporationDetails";
import { __postApiData, __getApiData } from "@utils/api";
// import api from "../../../../api"
import Swal from "sweetalert2";
import HospitalSizeDetails from "../sub_forms/HospitalSizeDetails";
import AddressDetails from "../sub_forms/AddressDetails";
//

function Clinic_details_forms() {
  const [clinic_details_sub_tab, setclinic_details_sub_tab] = useState(
    "Incorporative Details"
  );
  const doctor_details = JSON.parse(localStorage.getItem("user"));
  // console.log(doctor_details, "doctor_details")
  const [incorporationdetails, setincorporationdetails] = useState({
    RegistrationBody: "",
    RegistrationCertificate: "",
    RegistrationYear: "",
    RegistrationNumber: "",
    ValidityExpiry: "",
  });
  // console.log(incorporationdetails, "incorporationdetails")

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setincorporationdetails({
      ...incorporationdetails,
      [name]: files ? files[0] : value,
    });
  };

  //========================== fetch incorporationdetails ==========================

  const get_incorporation_details = async () => {
    try {
      const resp = await __getApiData(`/api/v1/asset-sections/incorporation-details/${doctor_details._id}`);
      // console.log(resp, "resp 38")
      if (resp.data) {
        const { _id, ...rest } = resp.data;
        setincorporationdetails(rest);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    get_incorporation_details();
  }, []);

  return (
    <div className="w-full">
      {/* Tabs Header */}
      <div className="flex justify-start mb-6 border-gray-200 rounded-lg overflow-auto">
        {/* Incorporative Details Tab */}
        <button
          onClick={() => setclinic_details_sub_tab("Incorporative Details")}
          className={`px-2 md:px-4 py-3 rounded-tl-[10px] bg-[rgba(189,196,212,0.3)] text-center montserrat font-semibold leading-normal whitespace-nowrap transition-all duration-200 ${clinic_details_sub_tab === "Incorporative Details"
            ? "underline webprimary"
            : "text-webprimary"
            }`}
        >
          Incorporative Details
        </button>

        {/* Hospital Size Tab */}
        <button
          onClick={() => setclinic_details_sub_tab("Hospital Size")}
          className={`px-2 md:px-4 py-3 bg-[rgba(189,196,212,0.3)] text-center montserrat font-semibold leading-normal whitespace-nowrap transition-all duration-200 ${clinic_details_sub_tab === "Hospital Size"
            ? "underline webprimary"
            : "text-webprimary"
            }`}
        >
          Hospital Size
        </button>

        {/* Address Tab */}
        <button
          onClick={() => setclinic_details_sub_tab("Address")}
          className={`px-2 md:px-4 py-3 rounded-tr-[10px] bg-[rgba(189,196,212,0.3)] text-center montserrat font-semibold leading-normal whitespace-nowrap transition-all duration-200 ${clinic_details_sub_tab === "Address"
            ? "underline webprimary"
            : "text-webprimary"
            }`}
        >
          Address
        </button>
      </div>

      {/* Tab Content */}
      <div className="px-5 py-3">
        {clinic_details_sub_tab === "Incorporative Details" && (
          <DoctorIncorporationDetails
            handleChange={handleChange}
            incorporationdetails={incorporationdetails}
          />
        )}

        {clinic_details_sub_tab === "Hospital Size" && <HospitalSizeDetails />}

        {clinic_details_sub_tab === "Address" && <AddressDetails />}
      </div>
    </div>
  );
}

export default Clinic_details_forms;
