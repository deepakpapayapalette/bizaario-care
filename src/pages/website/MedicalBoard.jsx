import React, { useEffect, useState } from 'react'
import Banner from '@components/common/Banner'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import SelectField from '@components/common/SelectField';
import { __postApiData, __getApiData } from '../../utils/api';
import DoctorCard from '../../components/common/DoctorCard';
import ShimerLoader from '../../components/common/ShimerLoader';


const bannerData = {
  // image: bannerImage,
  title: 'Hospitals Partners',
  description: "Empowering hospitals, physicians, and patients with real-time communication and clinical collaboration—because better care starts with better connection."
}
const TABS = [
  { key: "tab1", label: "Cardiology" },
  { key: "tab2", label: "Orthopedics" },
  { key: "tab3", label: "Pediatrics" },
  { key: "tab4", label: "Neurology" },
  { key: "tab5", label: "Obstetrics & Gynecology" },
  { key: "tab6", label: "Otorhinolaryngology" },
  { key: "tab7", label: "Plast Reconstr Surg" }
];
const MedicalBoard = () => {
  const [selectContry, setSelectCountry] = useState('');
  const [activeTab, setActiveTab] = useState("Cardiology");
  const [doctorArr, setDoctorArr] = useState([]);
  const [loading, setLoading] = useState(false);


  const getDoctorProfile = async () => {
    try {
      setLoading(true);
      const resp = await __postApiData("/api/v1/admin/assetList", {
        AssetCategoryLevel1: "68b0104063729ea39b28d0fb",
        // MedicalSpecialties: selectedSpecialty?._id || null,
      });
      const formattedData =
        resp?.data?.list?.map((doc, index) => ({
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
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth", });
    getDoctorProfile();
  }, []);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5, partialVisibilityGutter: 20 },
    tablet: { breakpoint: { max: 1024, min: 767 }, items: 3, partialVisibilityGutter: 10 },
    mobile: { breakpoint: { max: 767, min: 0 }, items: 2, partialVisibilityGutter: 20 },
  };
  return (
    <>
      <Banner data={bannerData} />
      <div className='container space-top'>
        <div className='flex flex-col md:flex-row md:justify-between '>
          <div className='md:w-4/5 mb-6 md:mb-0'>
            <h2 className='text-2xl md:text-4xl font-semibold mb-2'>Meet Our Doctor Team</h2>
            <p className='text-para'>Empowering hospitals, physicians, and patients with real-time communication and clinical collaboration—because better care starts with better connection.</p>
          </div>
          {/* <SelectField value={selectContry} onChange={(e) => setSelectCountry(e.target.value)} /> */}
        </div>
      </div>
      <div className='container mt-6 md:mt-8'>
        <Carousel
          arrows={false}
          responsive={responsive}
          containerClass="w-full"
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

        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {doctorArr.length === 0 && (<ShimerLoader />)}
          {doctorArr?.map((item, index) => (
            <DoctorCard key={index} item={item} handleViewProfile={() => { }} />
          ))}
        </div>
      </div>

    </>
  )
}

export default MedicalBoard

