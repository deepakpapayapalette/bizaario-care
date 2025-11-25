import React from 'react'
import Banner from '../../components/common/Banner'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { __postApiData } from '@utils/api';
import PartnerHospitalCard from '../../components/common/PartnerHospitalCard';
import SelectField from '../../components/common/SelectField';
import ShimerLoader from '../../components/common/ShimerLoader';

const bannerData = {
  title: "Hospitals Partners",
  description:
    "Empowering hospitals, physicians, and patients with real-time communication and clinical collaboration—because better care starts with better connection.",
};

const HospitalPartner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [hospital_details, sethospital_details] = useState([]);
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
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    get_hospital_profile();
    getCountryList();
  }, []);

  const handleCountryChange = (e) => {
    const countryId = e.target.value;
    setSelectedCountry(countryId);
    if (countryId) {
      getCityList(countryId);
    }
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
  };

  const navigate = useNavigate();
  const handleViewProfile = (hospitalId) => {
    navigate(`/hospital-partners/${hospitalId}`);
  };

  return (
    <>
      <Banner data={bannerData} />
      <div className="container space-top">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="mb-6 md:w-4/5 md:mb-0">
            <h2 className="mb-2 text-2xl font-semibold md:text-4xl">
              Meet Our Hospitals Partners
            </h2>
            <p className="text-para">
              Empowering hospitals, physicians, and patients with real-time
              communication and clinical collaboration—because better care
              starts with better connection.
            </p>
          </div>
          <SelectField
            countryList={countryList}
            cityList={cityList}
            selectedCountry={selectedCountry}
            selectedCity={selectedCity}
            onCountryChange={handleCountryChange}
            onCityChange={handleCityChange}
          />
        </div>

        {hospital_details.length === 0 && (
          <div className="grid gap-4 mt-6 md:grid-cols-3">
            <ShimerLoader />
            <ShimerLoader />
            <ShimerLoader />
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
          {hospital_details.map((item) => (
            <PartnerHospitalCard
              key={item.id}
              item={item}
              handleViewProfile={handleViewProfile}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default HospitalPartner
