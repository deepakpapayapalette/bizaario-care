import React, { useEffect, useState, useCallback } from "react";
import { FaArrowRight } from "react-icons/fa6";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import api from "../../../api";
import { __getCommenApiDataList } from "../../../utils/api/commonApi";

import { Link } from "react-router-dom";
import DoctorCard from "../../common/DoctorCard";


const TABS = [
  { key: "tab1", label: "Cardiology" },
  { key: "tab2", label: "Orthopedics" },
  { key: "tab3", label: "Pediatrics" },
  { key: "tab4", label: "Neurology" },
  { key: "tab5", label: "Obstetrics & Gynecology" },
  { key: "tab6", label: "Otorhinolaryngology" },
  { key: "tab7", label: "Plast Reconstr Surg" }
];

const TrustedMedicalExperts = () => {
  const [activeTab, setActiveTab] = useState("Cardiology");
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
      items: 1,
      partialVisibilityGutter: 20,
    },
  };
  const responsiveCardList = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 3
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      partialVisibilityGutter: 20
    },
    tablet: {
      breakpoint: { max: 1024, min: 767 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 767, min: 0 },
      items: 1,

    }
  };

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
  }, []);


  // const fetchSpecialties = async () => {
  //   try {
  //     const data = await __getCommenApiDataList({
  //       lookup_type: ["medical_speciality"],
  //     });
  //     setMedicalSpecialties(data);
  //   } catch (error) {
  //     console.error("Error fetching specialties:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchSpecialties();
  // }, []);

  useEffect(() => {
    getDoctorProfile();
  }, [getDoctorProfile]);

  // useEffect(() => {
  //   setSelectedSpecialty(medicalSpecialties.find((item) => item.lookup_value === activeTab));
  // }, [activeTab, medicalSpecialties]);


  return (
    <div className="container space-top">
      <div className="flex md:flex-row flex-wrap flex-col  md:items-start  justify-between mb-4">
        <div className="mb-4">
          <h2 className="text-2xl md:text-4xl font-semibold mb-2">Trusted Medical Experts</h2>
          <p className="text-para ">
            Bringing global experience, compassionate care, and proven results.
          </p>
        </div>
        <div>
          <Link className="theme-btn-fill px-15 py-3 inline-block  " to="/view-all-doctors">
            View All <FaArrowRight size="18" className="inline  " />
          </Link>
        </div>
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
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`border-2 py-3 pe-2 rounded-md text-webprimary hover:bg-webprimary hover:text-white w-full  ${activeTab === tab.label ? "activeTab bg-webprimary text-white" : ""
              }`}
            onClick={() => setActiveTab(tab.label)}
          >
            {tab.label}
          </button>
        ))}
      </Carousel>

      {/* ---------------- Content Section ---------------- */}
      <div className="">
        <Carousel
          arrows={false}
          responsive={responsiveCardList}
          containerClass=" pe-2 pt-6"
          itemClass="pe-4 pb-3"
          infinite
          partialVisible
        >
          {doctorArr?.map((item) => (
            <DoctorCard key={item.id} item={item} handleViewProfile={null} />
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default TrustedMedicalExperts;
