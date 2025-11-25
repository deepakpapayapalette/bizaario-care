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
  const [hospital_details, sethospital_details] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Fetch country list on component mount
  const getCountryList = async () => {
    try {
      setIsLoading(true);
      const resp = await __postApiData("/api/v1/admin/StationList", {
        OrgUnitLevel: "68affb6d874340d8d79dbea4", // country level
      });
      setCountryList(resp.data.list || []);
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
        ParentStationId: countryId,
        OrgUnitLevel: "68affb90874340d8d79dbeb6", // city level
      });
      setCityList(resp.data.list || []);
      console.log(resp, "city");
      setSelectedCity(""); // Reset city selection when country changes
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
    getCountryList();
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

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
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

      {/* =========Country & City Select=========== */}
      <div className="items-start justify-between pb-6 lg:flex md:pb-8">
        <SelectField
          countryList={countryList}
          cityList={cityList}
          selectedCountry={selectedCountry}
          selectedCity={selectedCity}
          onCountryChange={handleCountryChange}
          onCityChange={handleCityChange}
        />
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
