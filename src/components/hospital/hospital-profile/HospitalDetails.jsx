import React, { useEffect, useState } from 'react'
// import { __postApiData, } from '@utils/api';
import api from "../../../api";
import { useParams } from 'react-router-dom';
import DocProfileCard from '../../doctor/doctor-profile/DocProfileCard';
import DocTabs from '../../doctor/doctor-profile/DocTabs';
import HospitalTabs from './HospitalTabs';
import HospitalProfileCard from './HospitalProfileCard';


const HospitalProfile = () => {
  const { id } = useParams();
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  const getHospitalDetails = async () => {
    try {
      setLoading(true);
      const resp = await api.get(`api/v1/admin/GetAsset/${id}`);


      if (resp.data && resp.data.data) {
        const hospital = resp.data.data;



        const formattedData = {
          id: hospital._id, // asset id
          name: hospital.AssetName,
          location:
            `${hospital.AddressLine1} ${hospital.AddressLine2} ${hospital.PostalCode}` ||
            "",
          specialties: hospital.MedicalSpecialties || [],
          image: hospital.ProfilePicture || null,
          website: hospital.Website || "",
          logo: hospital.Logo || "",
          description:
            hospital.Description ||
            "Leading healthcare provider committed to excellence in patient care.",
          stationName: hospital.StationId?.StationName || "",
          subscriptionType: hospital.SubscriptionType?.lookup_value || "",
          assetCategory: hospital.AssetCategoryLevel1?.lookup_value || "",
          assetSubCategory: hospital.AssetCategoryLevel2?.lookup_value || "",
          numberOfBeds: hospital.NumberOfBeds || 0,
          numberOfDoctors: hospital.NumberOfDoctors || 0,
          numberOfICUBeds: hospital.NumberOfICUBeds || 0,
          numberOfOTs: hospital.NumberOfOTs || 0,
          numberOfConsultingPhysicians:
            hospital.NumberOfConsultingPhysicians || 0,
          numberOfNursingStaff: hospital.NumberOfNursingStaff || 0,
          numberOfDepartments: hospital.NumberOfDepartments || 0,
          registrationNumber: hospital.RegistrationNumber || "",
          registrationYear: hospital.RegistrationYear || "",
          validityExpiry: hospital.ValidityExpiry || "",
          verificationCertificate: hospital.VerificationCertificate || "",
          verificationDate: hospital.VerificationDate || "",
          geoLocation: hospital.GeoLocation || null,
          // Social media and contact fields
          facebookPage: hospital.FacebookPage || "",
          instagramAccount: hospital.InstagramAccount || "",
          linkedInAccount: hospital.LinkedInAccount || "",
          telegramChannel: hospital.TelegramChannel || "",
          whatsAppCommunity: hospital.WhatsAppCommunity || "",
          youTubeChannel: hospital.YouTubeChannel || "",
          // Additional registration and verification fields
          registrationBody: hospital.RegistrationBody || "",
          registrationCertificate: hospital.RegistrationCertificate || "",
          verifiedBy: hospital.VerifiedBy || "",
          // Gallery fields
          pictureGallery: hospital.PictureGallery || [],
          videoGallery: hospital.VideoGallery || [],
          // New fields from API response - using correct field names
          awardsRecognitions: hospital.AwardsRecognitions || [],
          patientTestimonials: hospital.PatientTestimonials || [],
          digitalCME: hospital.DigitalCME || [],
          events: hospital.Events || [],
          // Additional data fields
          treatmentPackages: hospital.TreatmentPackages || [],
          feesAndCharges: hospital.FeesAndCharges || [],
          opdSchedule: hospital.OPDSchedule || [],
          specialization: hospital.Specialization || [],
          fellowships: hospital.Fellowships || [],
          // Verification checks
          incorporationCredentialCheck:
            hospital.IncorporationCredentialCheck || false,
          employmentCheck: hospital.EmploymentCheck || false,
          educationalCredentialCheck:
            hospital.EducationalCredentialCheck || false,
          criminalRecordCheck: hospital.CriminalRecordCheck || false,
          patientTestimonyCheck: hospital.PatientTestimonyCheck || false,
          onlineReputationCheck: hospital.OnlineReputationCheck || false,
          doctors: hospital.HospitalDoctors || [],
        };
        setHospitalData(formattedData);
      } else {
        setError("Hospital not found");
      }
    } catch (error) {
      console.error("Error fetching hospital details:", error);
      setError("Failed to load hospital details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getHospitalDetails();
    }
  }, [id]);
  return (
    <>{!error ? (
      <>
        <div className=''>
          <HospitalProfileCard doctorData={hospitalData} />
          <HospitalTabs hospitalData={hospitalData} />
        </div>
      </>
    )
      :
      <div className='p-4 '>{error}</div>
    }
    </>
  )
}

export default HospitalProfile

