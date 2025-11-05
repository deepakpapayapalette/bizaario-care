import React, { useState } from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { GrLocation } from "react-icons/gr";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserMd } from 'react-icons/fa';
import doctorImage from '@assets/images/website/home/online-clinic.png';
import { Link } from 'react-router-dom';
import SelectField from '@components/common/SelectField';

const TABS = [
  { key: "tab1", label: "Cardiology" },
  { key: "tab2", label: "Orthopedics" },
  { key: "tab3", label: "Pediatrics" },
  { key: "tab4", label: "Neurology" },
  { key: "tab5", label: "Obstetrics & Gynecology" },
  { key: "tab6", label: "Otorhinolaryngology" },
  { key: "tab7", label: "Plast Reconstr Surg" }
];
const OnlineClinics = () => {
  const [activeTab, setActiveTab] = useState("Cardiology");
  const [selectContry, setSelectCountry] = useState('');

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5, partialVisibilityGutter: 20 },
    tablet: { breakpoint: { max: 1024, min: 767 }, items: 3, partialVisibilityGutter: 10 },
    mobile: { breakpoint: { max: 767, min: 0 }, items: 1, partialVisibilityGutter: 20 },
  };
  const responsiveCardList = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 3,
      partialVisibilityGutter: 20
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      partialVisibilityGutter: 20
    },
    tablet: {
      breakpoint: { max: 1024, min: 767 },
      items: 2,
      partialVisibilityGutter: 20
    },
    mobile: {
      breakpoint: { max: 767, min: 0 },
      items: 1,
      partialVisibilityGutter: 10

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
      <div className="lg:flex  justify-between items-star  mb-4">
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
        <SelectField value={selectContry} onChange={(e) => setSelectCountry(e.target.value)} />
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
            <div key={item} >
              <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200 w-full  mx-auto">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="border border-gray-500 rounded-lg py-2 flex flex-col items-center">
                    <span className="text-lg font-semibold">06</span>
                    <span className="text-gray-700 text-sm">Days</span>
                  </div>
                  <div className="border border-gray-500 rounded-lg py-2 flex flex-col items-center">
                    <span className="text-lg font-semibold">12</span>
                    <span className="text-gray-700 text-sm">Hours</span>
                  </div>
                  <div className="border border-gray-500 rounded-lg py-2 flex flex-col items-center">
                    <span className="text-lg font-semibold">18</span>
                    <span className="text-gray-700 text-sm">Minutes</span>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="flex flex-col sm:flex-row gap-4 items-start mb-4">
                  <div>

                    <img
                      src={doctorImage}
                      alt="Dr. Dominic Stonehart"
                      className="rounded-lg object-cover w-28 h-28 bg-gray-100"
                    />
                  </div>
                  <div>
                    <a
                      href="#"
                      className="font-semibold text-webprimary text-lg leading-tight mb-1 block"
                    >
                      Dr. Dominic Stonehart
                    </a>
                    <div className="text-gray-600 text-xs mb-2 flex items-center gap-2">
                      <FaUserMd className="text-gray-700" /> Cardiologist | 15+ Years Experience
                    </div>
                    <div className="flex items-center text-gray-700 text-sm mb-1 gap-2">
                      <FaCalendarAlt className="text-gray-700" />
                      <span>20/12/2025</span>
                      <FaClock className="ml-3 text-gray-700" />
                      <span>02:30 AM</span>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm gap-2">
                      <FaMapMarkerAlt className="text-gray-700" />
                      <span>Noida, Delhi NCR</span>
                    </div>
                  </div>
                </div>

                {/* Slot Info */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="border border-gray-500 rounded-lg py-2 flex flex-col items-center">
                    <span className="text-lg font-semibold">20</span>
                    <span className="text-gray-700 text-xs">Total Slots</span>
                  </div>
                  <div className="border border-gray-500 rounded-lg py-2 flex flex-col items-center">
                    <span className="text-lg font-semibold">18</span>
                    <span className="text-gray-700 text-xs">Available Slots</span>
                  </div>
                </div>

                {/* Book Button */}
                <Link to="/appointment-form" className="w-full">
                  <button className="w-full py-3 bg-webprimary text-white font-semibold rounded-lg mt-2 hover:bg-webhoverprimary transition-all">
                    Book Appointment
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </Carousel>

      </div>



    </div>
  )
}

export default OnlineClinics;







