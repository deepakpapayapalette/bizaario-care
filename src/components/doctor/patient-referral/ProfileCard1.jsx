import React, { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
// import user1 from '../assets/images/user1.svg';
import { Paper } from '@mui/material';
// import patientdefaultimage from '../../AllSubForms/assets/images/patient default image.png'
import { FaUser } from "react-icons/fa6";
import image from '@assets/images/admin/doctor/patient.png';
const ProfileCard1 = (selected_patient_details) => {


  const PatientDetails = selected_patient_details.patient_details

  const [isOpen, setIsOpen] = useState(false)




  return (
    <div className="h-full flex flex-col">

      <h4>Patient ID:{PatientDetails?.PatientId ? PatientDetails.PatientId : "N/A"}</h4>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: "100%" }} >
        <div className="bg-white">

          <div className="flex items-start justify-between space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 lora">
              Patient Card
            </h2>

            <h2 className="text-xl font-semibold text-gray-900 mb-6 lora">
              {PatientDetails?.Name}
            </h2>
          </div>


          <div className="flex items-start space-x-4">
            {/* Profile Image */}
            <div className="w-44 h-44 border-2 border-gray-800 rounded-lg p-4 bg-white">
              <div className="w-full h-full bg-white relative ">
                <img
                  src={PatientDetails?.ProfilePic ? PatientDetails.ProfilePic : image}
                  alt="no image"
                  className="w-full h-full object-cover"
                  onClick={() => setIsOpen(true)}
                />
              </div>
            </div>

            {/* Profile Information */}
            <div className="flex-1 min-w-0">
              {/* Name */}
              {/* <h2 className="text-3xl font-semibold text-gray-900 mb-3 lora">
           {PatientDetails?.Name}
          </h2> */}

              {/* Date and Status */}
              <div className="flex items-center space-x-4 mb-3">

                {/* <Calendar className="w-4 h-4 text-gray-500" /> */}
                <span className="text-sm light-text font-medium">DOB:</span>
                <span className="text-sm text-gray-900 font-semibold">
                  {PatientDetails?.DateOfBirth
                    ? new Date(PatientDetails?.DateOfBirth).toLocaleDateString()
                    : "-"}
                </span>





              </div>

              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-start mb-0">
                  <span className="text-sm light-text font-medium">Gender:</span>
                  <span className="text-sm text-gray-900 font-semibold ml-2">{PatientDetails?.Gender}</span>
                </div>

              </div>

              <div className="flex items-center space-x-4 mb-3">

                <span className="text-sm light-text font-medium flex-shrink-0">Nationality:</span>
                <span className="text-sm text-gray-900 font-semibold"> {PatientDetails?.Nationality?.StationName}</span>


              </div>




              {/* Country of Residence */}
              <div className="flex items-center space-x-4 mb-3">
                <span className="text-sm light-text font-medium  flex-shrink-0">Country Of Residence: </span>
                <span className="text-sm text-gray-900 font-semibold"> {PatientDetails?.CountryOfResidence?.StationName}</span>
              </div>


              <div className="flex items-center space-x-4 mb-3 ">
                {/* <MapPin className="w-4 h-4 text-gray-500" /> */}
                <span className="text-sm light-text font-medium">Address:</span>
                <span className="text-sm text-gray-900 font-semibold">{PatientDetails?.AddressLine1}
                  {PatientDetails?.AddressLine2 ? (PatientDetails.AddressLine2) : ""}</span>
              </div>

              <div className="flex items-center space-x-4 mb-0">
                <span className="text-sm light-text font-medium">Blood Group:</span>
                <span className="text-sm text-gray-900 font-semibold ml-2">{PatientDetails?.BloodGroup ? PatientDetails.BloodGroup : ""}</span>
              </div>



            </div>
          </div>
        </div>
      </Paper>

      {/* Fullscreen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="relative">
            <img
              src={PatientDetails?.ProfilePic ? PatientDetails.ProfilePic : patientdefaultimage}
              alt="Full screen"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-lg"
            />
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-white text-3xl font-bold"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}



    </div>
  );
};

export default ProfileCard1;
