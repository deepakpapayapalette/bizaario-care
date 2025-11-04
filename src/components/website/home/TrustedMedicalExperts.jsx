import React, { useEffect, useState, useCallback } from "react";
import { FaArrowRight } from "react-icons/fa6";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

// import responsive from "../../../Utils/responsive_carousel";
import api from "../../../api";
import { __getCommenApiDataList } from "../../../utils/api/commonApi";

import MedicalExpertCard from "../../ui/MedicalExpertCard";
import { Link } from "react-router-dom";

const TAB_LIST = [
  "Orthopedics",
  "Pediatrics",
  "Neurology",
  "Obstetrics & Gynecology",
  "Otorhinolaryngology",
  "Plastic & Reconstructive Surgery",
];

const TrustedMedicalExperts = () => {
  const [activeTab, setActiveTab] = useState(TAB_LIST[0]);
  const [doctorArr, setDoctorArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [medicalSpecialties, setMedicalSpecialties] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  // console.log("Selected Specialty:", activeTab);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      partialVisibilityGutter: 20,
    },
    tablet: {
      breakpoint: { max: 1024, min: 767 },
      items: 2,
      partialVisibilityGutter: 20,
    },
    mobile: {
      breakpoint: { max: 767, min: 0 },
      items: 2,
      partialVisibilityGutter: 20,
    },
  };



  /** --------------------------
   ✅ Fetch Doctors
   ---------------------------**/
  const getDoctorProfile = useCallback(async () => {
    try {
      setLoading(true);

      const resp = await api.post("api/v1/admin/assetList", {
        AssetCategoryLevel1: "68b0104063729ea39b28d0fb",
        MedicalSpecialties: selectedSpecialty?._id || null,
      });

      const formattedData =
        resp?.data?.data?.list?.map((doc, index) => ({
          id: doc?._id || index + 1,
          name: doc?.AssetName,
          exp: `${doc?.MedicalSpecialties?.[0]?.lookup_value || ""} | ${doc?.experience || 5} Years Experience`,
          location: `${doc?.AddressLine1 || ""} ${doc?.AddressLine2 || ""}${doc?.PostalCode || ""}`,
          specialties: doc?.MedicalSpecialties?.map((i) => i.lookup_value).join(", "),
          image: doc?.ProfilePicture,
        })) || [];

      setDoctorArr(formattedData);
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedSpecialty]);

  /** --------------------------
   ✅ Load Specialties List
   ---------------------------**/
  const fetchSpecialties = async () => {
    try {
      const data = await __getCommenApiDataList({
        lookup_type: ["medical_speciality"],
      });
      setMedicalSpecialties(data);
    } catch (error) {
      console.error("Error fetching specialties:", error);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    getDoctorProfile();
  }, [getDoctorProfile]);

  useEffect(() => {
    setSelectedSpecialty(medicalSpecialties.find((item) => item.lookup_value === activeTab));
  }, [activeTab, medicalSpecialties]);


  return (
    <div className="container space-top">
      <div className="flex  items-center justify-between">
        <div className="mb-4">
          <h2 className="text-2xl md:text-4xl font-semibold mb-2">Trusted Medical Experts</h2>
          <p className="text-para ">
            Bringing global experience, compassionate care, and proven results.
          </p>
        </div>
        <Link className="theme-btn-fill px-15 py-3 flex items-center gap-2 " to="/view-all-doctors">
          View All <FaArrowRight size="18" className="inline  " />
        </Link>
      </div>

      {/* ---------------- TAB CAROUSEL ---------------- */}
      <Carousel
        arrows={false}
        responsive={responsive}
        containerClass="carousel-container w-full"
        itemClass="pe-4"
        infinite
        partialVisible
      >
        {TAB_LIST.map((tab) => (
          <button
            key={tab}
            className={`border-2 py-3 pe-2 rounded-md text-webprimary hover:bg-webprimary hover:text-white w-full mb-3 ${activeTab === tab ? "activeTab bg-webprimary text-white" : ""
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </Carousel>

      {/* ---------------- Content Section ---------------- */}
      <div className="">
        {loading ? (
          <p>Loading doctors...</p>
        ) : (
          <MedicalExpertCard doctors={doctorArr} />
        )}
      </div>
    </div>
  );
};

export default TrustedMedicalExperts;
