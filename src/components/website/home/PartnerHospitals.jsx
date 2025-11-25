import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { GrLocation } from "react-icons/gr";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaClock, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { __postApiData } from "@utils/api";
import SelectField from "@components/common/SelectField";
import ShimerLoader from "@components/common/ShimerLoader";
import PartnerHospitalCard from "@components/common/PartnerHospitalCard";

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    partialVisibilityGutter: 20,
  },
  tablet: {
    breakpoint: { max: 1024, min: 767 },
    items: 3,
    partialVisibilityGutter: 10,
  },
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 2,
    partialVisibilityGutter: 20,
  },
};

const responsiveCardsList = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 3,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    partialVisibilityGutter: 20,
  },
  tablet: {
    breakpoint: { max: 1024, min: 767 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 767, min: 0 },
    items: 1,
  },
};

const PartnerHospitals = () => {
  const [activeTab, setActiveTab] = useState("");
  const [hospital_details, sethospital_details] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(""); // Will be set to India ID after fetching
  const [selectedCity, setSelectedCity] = useState("");

  // Fetch country list on component mount
  const getCountryList = async () => {
    try {
      setIsLoading(true);
      const resp = await __postApiData("/api/v1/admin/StationList", {
        OrgUnitLevel: "68affb6d874340d8d79dbea4", // country level
      });
      const countries = resp.data.list || [];
      setCountryList(countries);

      // Find India and set as default
      const indiaCountry = countries.find(
        (item) => item.StationName === "India"
      );
      if (indiaCountry) {
        setSelectedCountry(indiaCountry._id);
        // Fetch cities for India by default
        getCityList(indiaCountry._id);
      }
      console.log(resp, "country");
    } catch (error) {
      console.log("Error fetching countries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch city list based on selected country
  const getCityList = async (countryId) => {
    try {
      setIsLoading(true);
      const resp = await __postApiData("/api/v1/admin/StationList", {
        OrgUnitLevel: "68affb90874340d8d79dbeb6", // city level
        // ParentStationId: countryId || "6925507e99f6b6e735b26a82",
        // ParentStationId: "6925507e99f6b6e735b26a82",
      });
      setCityList(resp.data.list || []);
      setSelectedCity(""); // Reset city selection
      setActiveTab(""); // Reset active tab
      console.log(resp, "city");
    } catch (error) {
      console.log("Error fetching cities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const get_hospital_profile = async () => {
    try {
      setIsLoading(true);
      const resp = await __postApiData("/api/v1/admin/assetList", {
        AssetCategoryLevel1: "68b00db063729ea39b28d0ef",
      });
      const formattedData = resp.data.list.map((doc, index) => ({
        id: doc._id || index + 1,
        name: doc.AssetName,
        exp: `${doc.MedicalSpecialties.map((item) => item.lookup_value)} | ${
          doc.experience || 5
        } Years Experience`,
        location:
          [doc.AddressLine1, doc.AddressLine2, doc.PostalCode]
            .filter(Boolean)
            .join(" ") || "",
        Specializes: `${(doc.MedicalSpecialties || [])
          .map((item) => item.lookup_value)
          .join(", ")} `,
        image: doc.ProfilePicture || null,
        Website: doc.Website || "",
        Logo: doc.Logo || "",
      }));

      sethospital_details(formattedData);
    } catch (error) {
      console.error("Error fetching hospital profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    get_hospital_profile();
    getCountryList(); // This will set India as default and fetch its cities
  }, []);

  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);
    if (countryId) {
      getCityList(countryId);
    } else {
      setCityList([]);
    }
  };

  const handleCityTabClick = (cityId, cityName) => {
    setSelectedCity(cityId);
    setActiveTab(cityName);
  };

  const navigate = useNavigate();
  const handleViewProfile = (hospitalId) => {
    navigate(`/hospital/${hospitalId}`);
  };

  return (
    <div className="container space-top">
      {/* Header Section */}
      <div className="flex flex-col flex-wrap justify-between mb-4 md:flex-row md:items-start">
        <div className="mb-4">
          <h2 className="mb-2 text-2xl font-semibold md:text-4xl">
            Partner Hospitals
          </h2>
          <p className="text-para">
            World-class healthcare institutions with advanced facilities and
            trusted care.
          </p>
        </div>
        <div>
          <Link
            className="inline-block py-3 theme-btn-fill px-15 "
            to="/hospital-partners"
          >
            View All <FaArrowRight size={18} className="inline" />
          </Link>
        </div>
      </div>

      {/* =========Country Select + City Tabs=========== */}
      <div className="items-start justify-between mb-6 lg:flex">
        {/* City Tabs Carousel */}
        {selectedCountry && cityList.length > 0 && (
          <Carousel
            arrows={false}
            responsive={responsive}
            containerClass="pe-1 flex-1"
            itemClass="pe-4"
            infinite
            partialVisible
          >
            {cityList.map((tab) => (
              <button
                key={tab._id}
                className={`border-2 py-3 px-4 rounded-md text-webprimary hover:bg-webprimary hover:text-white w-full whitespace-nowrap transition-all ${
                  activeTab === tab.StationName
                    ? "bg-webprimary text-white border-webprimary"
                    : "border-webprimary"
                }`}
                onClick={() => handleCityTabClick(tab._id, tab.StationName)}
              >
                {tab.StationName}
              </button>
            ))}
          </Carousel>
        )}

        {/* Country Select */}
        <div className="mt-6 mb-6 lg:ps-4 lg:mt-0 lg:mb-0">
          <div className="border-2 rounded-lg px-3 flex items-center gap-2 sm:w-[180px] me-3 md:me-0 bg-white">
            <span className="bg-white input-group-text border-end-0">
              <GrLocation size={24} className="text-webprimary" />
            </span>
            <select
              className="py-3.5 lg:w-[100px] w-full bg-white border-0 focus:ring-0 focus:outline-0 md:text-md font-medium text-webprimary"
              value={selectedCountry}
              onChange={handleCountryChange}
            >
              <option value="">Select Country</option>
              {countryList?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.StationName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hospital Content */}
      <div className="relative">
        {hospital_details.length > 0 ? (
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
              <PartnerHospitalCard
                key={item.id}
                item={item}
                handleViewProfile={handleViewProfile}
              />
            ))}
          </Carousel>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <ShimerLoader />
            <ShimerLoader />
            <ShimerLoader />
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerHospitals;
