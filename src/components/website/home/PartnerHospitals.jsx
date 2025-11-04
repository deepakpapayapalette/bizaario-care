
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { GrLocation } from "react-icons/gr";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaClock, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';
import { useState, useEffect, use } from "react"
import { useNavigate } from "react-router-dom"
import { __postApiData } from '@utils/api';

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

const responsiveCardsList = {
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
const PartnerHospitals = () => {
  const [hospital_details, sethospital_details] = useState([]);
  const [activeTab, setActiveTab] = useState('Delhi NCR');



  const get_hospital_profile = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/assetList", {
        AssetCategoryLevel1: "68b00db063729ea39b28d0ef",
      });
      const formattedData = resp.data.list.map((doc, index) => ({
        id: doc._id || index + 1,
        name: doc.AssetName,
        exp: `${doc.MedicalSpecialties.map((item) => item.lookup_value)} | ${doc.experience || 5} Years Experience`,
        location: `${doc.AddressLine1} ${doc.AddressLine2} ${doc.PostalCode}` || "",
        Specializes: `${(doc.MedicalSpecialties || []).map((item) => item.lookup_value).join(", ")
          } `,
        image: doc.ProfilePicture || null,
        Website: doc.Website || "",
        Logo: doc.Logo || ""
      }));

      sethospital_details(formattedData);
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    }
  };

  useEffect(() => {
    get_hospital_profile();
  }, []);

  const navigate = useNavigate();
  const handleViewProfile = (hospitalId) => {
    navigate(`/hospital/${hospitalId}`);
  };

  return (
    <div className="container space-top">
      {/* Header Section */}
      <div className="flex md:flex-row flex-wrap flex-col  md:items-start  justify-between mb-4">
        <div className="mb-4">
          <h2 className="text-2xl md:text-4xl font-semibold mb-2">Partner Hospitals</h2>
          <p className="text-para">
            World-class healthcare institutions with advanced facilities and trusted care.
          </p>
        </div>
        <div>
          <Link
            className="theme-btn-fill px-15 py-3 inline-block "
            to="/view-all-hospitals"
          >
            View All <FaArrowRight size={18} className="inline" />
          </Link>
        </div>
      </div>

      {/* =========Tabs + Country=========== */}
      <div className="lg:flex    justify-between items-start">
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
              className={`border-2 py-3 pe-2 rounded-md text-webprimary hover:bg-webprimary hover:text-white w-full mb-3 ${activeTab === tab.label ? "activeTab bg-webprimary text-white" : ""
                }`}
              onClick={() => setActiveTab(tab.label)}
            >
              {tab.label}
            </button>
          ))}
        </Carousel>
        <div className=" lg:ps-4">
          <div className="  border-2 py-3 rounded-lg  px-3  flex gap-2 ">
            <span className="bg-white input-group-text border-end-0">
              <GrLocation size={24} className="text-[var(--primary)]" />
            </span>
            <select className=" w-full">
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
        <div className="relative mt-4 doctor-slider">
          <Carousel
            arrows={false}
            responsive={responsiveCardsList}
            containerClass="carousel-container"
            itemClass="px-1 sm:px-2 pb-3"
            infinite={true}
            renderDotsOutside={true}
            partialVisible={true}
          >
            {hospital_details?.map((item) => (

              <div
                key={item?.id}
                className="p-4  border-gray-200 border border-b-[6px] relative bg-white shadow-sm rounded-xl transition-all h-full flex flex-col trusted-medical-card"
              >
                <div className="w-full h-[170px] bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg">
                  <img
                    src={item?.image} // Use item.image or provide your image path
                    alt="NovaCare Hospital"
                    className="object-cover w-full h-full"
                  />
                  <img
                    src={item?.Logo}
                    alt="doctor"
                    className="absolute z-50 object-cover w-20 h-20 border-4 border-white rounded-full shadow top-[140px] left-4 sm:left-6 sm:w-24 sm:h-24"
                  />
                </div>
                {/* Details */}
                <div className="pt-16">
                  <div className="flex items-center gap-2 mb-2">

                    <div>
                      <h2 className="font-semibold text-xl mb-1">{item?.name}</h2>
                      <div className="text-gray-600 text-sm">{item?.exp}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700 text-base mb-2 gap-2 mt-3">
                    <FaMapMarkerAlt className="text-lg text-gray-600 mr-1" />
                    <span>{item?.location}</span>
                  </div>
                  <div className="flex items-center text-gray-700 text-base mb-2 gap-2">
                    <FaClock className="text-lg text-gray-600 mr-1" />
                    <span>{item?.hours || "24/7"}</span>
                  </div>
                  <div className="flex items-center text-gray-700 text-base mb-2 gap-2">
                    <FaGlobe className="text-lg text-gray-600 mr-1" />
                    <span>{item?.Website}</span>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className=''>
                  <button className="w-full theme-btn-fill"
                    onClick={() => handleViewProfile(item.id)}
                  >
                    Book an Appointment
                  </button>
                </div>
                <div className="py-4 flex gap-4 w-full">

                  <button className="w-full theme-btn-fill">
                    Send Medical Query
                  </button>
                  <button className="w-full theme-btn-ouline">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div >
  );
};

export default PartnerHospitals;


