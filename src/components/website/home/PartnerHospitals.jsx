
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { GrLocation } from "react-icons/gr";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaClock, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';
import { useState, useEffect, use } from "react"
import { useNavigate } from "react-router-dom"
import { __postApiData } from '@utils/api';
import SelectField from "@components/common/SelectField";
import ShimerLoader from "@components/common/ShimerLoader";
import PartnerHospitalCard from '@components/common/PartnerHospitalCard';

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
  mobile: { breakpoint: { max: 767, min: 0 }, items: 2, partialVisibilityGutter: 20 },
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
  const [selectContry, setSelectCountry] = useState('');



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
            to="/hospital-partners"
          >
            View All <FaArrowRight size={18} className="inline" />
          </Link>
        </div>
      </div>

      {/* =========Tabs + Country=========== */}
      <div className="lg:flex    justify-between items-start pb-6 md:pb-8">
        <Carousel
          arrows={false}
          responsive={responsive}
          containerClass="pe-1"
          itemClass="pe-4"
          infinite
          partialVisible
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`border-2 py-3  rounded-md text-webprimary hover:bg-webprimary hover:text-white w-full  ${activeTab === tab.label ? "activeTab bg-webprimary text-white" : ""
                }`}
              onClick={() => setActiveTab(tab.label)}
            >
              {tab.label}
            </button>
          ))}
        </Carousel>
        <SelectField value={selectContry} onChange={(e) => setSelectCountry(e.target.value)} />
      </div>

      {/* Hospital Content */}

      <div className="relative">
        {hospital_details.length > 0 ?

          <Carousel
            arrows={false}
            responsive={responsiveCardsList}
            containerClass="pb-6"
            itemClass="px-1 sm:px-2 pb-3"
            infinite={true}
            renderDotsOutside={true}
            partialVisible={true}
            showDots={true}
          >
            {hospital_details?.map((item) => (

              <PartnerHospitalCard key={item.id} item={item} />
            ))}
          </Carousel>
          :
          <div className="grid md:grid-cols-3 gap-4">
            <ShimerLoader />
            <ShimerLoader />
            <ShimerLoader />
          </div>
        }
      </div>
    </div>
  );
};

export default PartnerHospitals;


