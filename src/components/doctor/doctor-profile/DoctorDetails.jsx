import React, { useEffect, useState } from 'react'
// import { __postApiData, } from '@utils/api';
import api from "../../../api";
import { useParams } from 'react-router-dom';
import DocProfileCard from './DocProfileCard';
import DocTabs from './DocTabs';
const DoctorDetails = () => {
  const { id } = useParams();
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getDoctorDetails = async () => {
    try {
      setLoading(true);
      const resp = await api.get(`api/v1/admin/GetAsset/${id}`);
      // console.log(resp, "resp from doctor detail - 18");
      if (resp.data && resp.data.data) {
        const doctor = resp.data.data;
        const formattedData = {
          id: doctor._id, // asset id
          name: doctor.AssetName,
          location:
            `${doctor.AddressLine1} ${doctor.AddressLine2} ${doctor.PostalCode}` ||
            "",
          specialties: doctor.MedicalSpecialties || [],
          image: doctor.ProfilePicture || null,
          website: doctor.Website || "",
          logo: doctor.Logo || "",
          description:
            doctor.Description ||
            "Leading healthcare provider committed to excellence in patient care.",
          stationName: doctor.StationId?.StationName || "",
          subscriptionType: doctor.SubscriptionType?.lookup_value || "",
          assetCategory: doctor.AssetCategoryLevel1?.lookup_value || "",
          assetSubCategory: doctor.AssetCategoryLevel2?.lookup_value || "",
          // numberOfBeds: doctor.NumberOfBeds || 0,
          // numberOfDoctors: doctor.NumberOfDoctors || 0,
          // numberOfICUBeds: doctor.NumberOfICUBeds || 0,
          // numberOfOTs: doctor.NumberOfOTs || 0,
          // numberOfConsultingPhysicians:
          //   doctor.NumberOfConsultingPhysicians || 0,
          // numberOfNursingStaff: doctor.NumberOfNursingStaff || 0,
          // numberOfDepartments: doctor.NumberOfDepartments || 0,
          registrationNumber: doctor.RegistrationNumber || "",
          registrationYear: doctor.RegistrationYear || "",
          validityExpiry: doctor.ValidityExpiry || "",
          verificationCertificate: doctor.VerificationCertificate || "",
          verificationDate: doctor.VerificationDate || "",
          geoLocation: doctor.GeoLocation || null,
          // Social media and contact fields
          facebookPage: doctor.FacebookPage || "",
          instagramAccount: doctor.InstagramAccount || "",
          linkedInAccount: doctor.LinkedInAccount || "",
          telegramChannel: doctor.TelegramChannel || "",
          whatsAppCommunity: doctor.WhatsAppCommunity || "",
          youTubeChannel: doctor.YouTubeChannel || "",
          // Additional registration and verification fields
          registrationBody: doctor.RegistrationBody || "",
          registrationCertificate: doctor.RegistrationCertificate || "",
          verifiedBy: doctor.VerifiedBy || "",
          // Gallery fields
          pictureGallery: doctor.PictureGallery || [],
          videoGallery: doctor.VideoGallery || [],
          // New fields from API response - using correct field names
          awardsRecognitions: doctor.AwardsRecognitions || [],
          patientTestimonials: doctor.PatientTestimonials || [],
          digitalCME: doctor.DigitalCME || [],
          events: doctor.Events || [],
          // Additional data fields
          treatmentPackages: doctor.TreatmentPackages || [],
          feesAndCharges: doctor.FeesAndCharges || [],
          opdSchedule: doctor.OPDSchedule || [],
          specialization: doctor.Specialization || [],
          fellowships: doctor.Fellowships || [],
          // Verification checks
          incorporationCredentialCheck:
            doctor.IncorporationCredentialCheck || false,
          employmentCheck: doctor.EmploymentCheck || false,
          educationalCredentialCheck:
            doctor.EducationalCredentialCheck || false,
          criminalRecordCheck: doctor.CriminalRecordCheck || false,
          patientTestimonyCheck: doctor.PatientTestimonyCheck || false,
          onlineReputationCheck: doctor.OnlineReputationCheck || false,
        };
        setDoctorData(formattedData);
      } else {
        setError("Doctor not found");
      }
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      setError("Failed to load doctor details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getDoctorDetails();
    }
  }, [id]);
  return (
    <>{!error ? (
      <>
        <DocProfileCard doctorData={doctorData} />
        <DocTabs doctorData={doctorData} />
      </>
    )
      :
      <div className='p-4 '>{error}</div>
    }
    </>
  )
}

export default DoctorDetails

