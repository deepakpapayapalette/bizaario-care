import React from 'react'
import Banner from '../../components/common/Banner'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { __postApiData } from '@utils/api';
import PartnerHospitalCard from '../../components/common/PartnerHospitalCard';
import SelectField from '../../components/common/SelectField';
import ShimerLoader from '../../components/common/ShimerLoader';

const bannerData = {
  // image: bannerImage,
  title: 'Hospitals Partners',
  description: "Empowering hospitals, physicians, and patients with real-time communication and clinical collaboration—because better care starts with better connection."
}
const HospitalPartner = () => {
  const [hospital_details, sethospital_details] = useState([]);
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
    window.scrollTo({ top: 0, behavior: "smooth", });
    get_hospital_profile();
  }, []);

  const navigate = useNavigate();
  const handleViewProfile = (hospitalId) => {
    navigate(`/hospital-partners/${hospitalId}`);
  };


  return (
    <>
      <Banner data={bannerData} />
      <div className='container space-top'>
        <div className='flex flex-col md:flex-row md:justify-between '>
          <div className='md:w-4/5 mb-6 md:mb-0'>
            <h2 className='text-2xl md:text-4xl font-semibold mb-2'>Meet Our Hospitals Partners</h2>
            <p className='text-para'>Empowering hospitals, physicians, and patients with real-time communication and clinical collaboration—because better care starts with better connection.</p>
          </div>
          <SelectField value={selectContry} onChange={(e) => setSelectCountry(e.target.value)} />
        </div>

        {hospital_details.length === 0 && (
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <ShimerLoader />
            <ShimerLoader />
            <ShimerLoader />
          </div>)}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {hospital_details.map((item) => (
            <PartnerHospitalCard key={item.id} item={item} handleViewProfile={handleViewProfile} />
          ))}
        </div>
      </div>
    </>
  )
}

export default HospitalPartner
