import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { GrLocation } from "react-icons/gr";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import PartnerHospitalsCard from "../../ui/PartnerHospitalsCard";

const TABS = [
  { id: "tab1", label: "Delhi NCR" },
  { id: "tab2", label: "Mumbai" },
  { id: "tab3", label: "Bengaluru" },
  { id: "tab4", label: "Noida" },
  { id: "tab5", label: "Chennai" },
  { id: "tab6", label: "Hyderabad" },
  { id: "tab7", label: "Pune" },
];

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5, partialVisibilityGutter: 20 },
  tablet: { breakpoint: { max: 1024, min: 767 }, items: 3, partialVisibilityGutter: 10 },
  mobile: { breakpoint: { max: 767, min: 0 }, items: 2 },
};

const PartnerHospitals = () => {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <div className="container space-top">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="mb-4">
          <h2 className="text-2xl md:text-4xl font-semibold mb-2">Partner Hospitals</h2>
          <p className="text-para">
            World-class healthcare institutions with advanced facilities and trusted care.
          </p>
        </div>

        <Link
          className="theme-btn-fill px-15 py-3 flex items-center gap-2"
          to="/view-all-hospitals"
        >
          View All <FaArrowRight size={18} className="inline" />
        </Link>
      </div>

      {/* Tabs + Country */}
      <div className="flex justify-between items-start">
        {/* Tabs */}
        {/* <div className=""> */}

        <Carousel
          arrows={false}
          responsive={responsive}
          containerClass=" pe-6 "
          itemClass="pe-4 pb-3"
          infinite
          partialVisible
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`border-2 py-3 pe-2 rounded-md text-webprimary hover:bg-webprimary hover:text-white w-full mb-3 ${activeTab === tab ? "activeTab bg-webprimary text-white" : ""
                }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </Carousel>
        {/* </div> */}

        {/* Country filter */}
        <div className=" ps-4">
          <div className=" border-2 py-3 rounded-lg  px-3  flex gap-2 ">
            <span className="bg-white input-group-text border-end-0">
              <GrLocation size={24} className="text-[var(--primary)]" />
            </span>
            <select className=" ">
              <option disabled>Select Country</option>
              <option>India</option>
              <option>USA</option>
              <option>Sri Lanka</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hospital Content */}
      <div className="ps-0">
        <PartnerHospitalsCard activeCity={activeTab} />
      </div>
    </div>
  );
};

export default PartnerHospitals;
