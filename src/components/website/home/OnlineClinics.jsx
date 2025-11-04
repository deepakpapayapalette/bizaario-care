import React, { useState } from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { GrLocation } from "react-icons/gr";
import OnlineClinicsCard from '../../ui/OnlineClinicsCard';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserMd } from 'react-icons/fa';
import doctorImage from '@assets/images/website/home/online-clinic.png';

const TABS = [
  { key: "tab1", label: "Cardiology" },
  { key: "tab2", label: "Orthopedics" },
  { key: "tab3", label: "Pediatrics" },
  { key: "tab4", label: "Neurology" },
  { key: "tab5", label: "Obstetrics & Gynecology" },
  { key: "tab6", label: "Otorhinolaryngology" },
  { key: "tab7", label: "Plastic & Reconstructive Surgery" }
];
const OnlineClinics = () => {
  const [activeTab, setActiveTab] = useState("Cardiology");

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5, partialVisibilityGutter: 20 },
    tablet: { breakpoint: { max: 1024, min: 767 }, items: 3, partialVisibilityGutter: 10 },
    mobile: { breakpoint: { max: 767, min: 0 }, items: 2 },
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

  return (
    <div className="container space-top">
      <div className="flex  items-center justify-between">
        <div className="mb-4">
          <h2 className="text-2xl md:text-4xl font-semibold mb-2">Online Clinics</h2>
          <p className="text-para ">
            Learn from leading doctors and specialists through focused, digestible video content.
          </p>
        </div>
        {/* <Link className="theme-btn-fill px-15 py-3 flex items-center gap-2 " to="/view-all-doctors">
          View All <FaArrowRight size="18" className="inline  " />
        </Link> */}
      </div>

      {/* =========Tabs + Country=========== */}
      <div className="flex justify-between items-start">
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
              key={tab.key}
              className={`border-2 py-3 pe-2 rounded-md text-webprimary hover:bg-webprimary hover:text-white w-full  ${activeTab === tab.label ? "activeTab bg-webprimary text-white" : ""
                }`}
              onClick={() => setActiveTab(tab.label)}
            >
              {tab.label}
            </button>
          ))}
        </Carousel>
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

      {/* ----------------cards listing Content Section ---------------- */}
      <div>
        <Carousel
          arrows={false}
          responsive={responsiveCardList}
          containerClass=" pe-2 "
          itemClass="pe-4 pb-3"
          infinite
          partialVisible
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="pe-2 pb-3">
              <OnlineClinicsCard />
            </div>
          ))}
        </Carousel>

      </div>



    </div>
  )
}

export default OnlineClinics;







