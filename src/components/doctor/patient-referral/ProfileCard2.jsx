import React from 'react';
import { useState } from 'react';
import { Phone, Mail, Printer } from 'lucide-react';
// import qr from '../assets/images/qr.png';
import { Plus, Edit } from 'lucide-react';
// import PatientDetails from '../PatientDetails';
import { Paper } from '@mui/material';
// import QRCodeGenerator from './generate_qr.code';
import { BsQrCode } from "react-icons/bs";


const ProfileCard2 = (selected_patient_details) => {

  const PatientDetails = selected_patient_details.patient_details


  const [isOpen, setIsOpen] = useState(false);


  return (
    <div className="h-full flex flex-col p">
      <h4 style={{ visibility: "hidden" }}>Patient ID:{PatientDetails?.PatientId ? PatientDetails.PatientId : "N/A"}</h4>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: "100%" }} >
        <div className="bg-white ">
          {/* Header */}
          <h2 className="text-xl font-semibold text-gray-900 mb-6 lora">
            Contact Details
          </h2>

          <div className="flex justify-between items-start">
            {/* Left Side - Contact Information */}
            <div className="flex-1 space-y-4">
              {/* Primary Phone and Email Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* <Phone className="w-5 h-5 text-gray-600" /> */}
                  <span className="text-sm light-text font-medium">Primary Mobile No.:</span>
                  <span className="text-sm text-gray-900 font-semibold">{PatientDetails?.PhoneNumber ? PatientDetails.PhoneNumber : ""}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* <Phone className="w-5 h-5 text-gray-600" /> */}
                  <span className="text-sm light-text font-medium">Email ID:</span>
                  <span className="text-sm text-gray-900 font-semibold">{PatientDetails?.EmailAddress ? PatientDetails.EmailAddress : ""}</span>
                </div>
              </div>

              {/* Other Contact Details Section */}
              <div>
                <h3 className="text-sm text-gray-900 font-medium font-semibold mb-3">
                  <span className="text-sm text-gray-900 font-medium font-semibold">SECONDARY CONTACT</span>
                </h3>

                <div className="space-y-3">
                  {/* Secondary Phone */}
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-700 font-medium">Name:</span>
                    <span className="text-sm text-gray-900 font-medium font-semibold">
                      {PatientDetails?.SecondaryContactName || "-"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-gray-700 font-medium">Relation:</span>
                    <span className="text-sm text-gray-900 font-medium font-semibold">
                      {PatientDetails?.Relationship?.lookup_value || "-"}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-sm light-text font-medium">Secondary Mobile No.:</span>
                    <span className="text-sm text-gray-900 font-semibold">{PatientDetails?.SecondaryContactNumber}</span>
                  </div>

                  {/* Printer/Fax */}
                  {/* <div className="flex items-center space-x-3">
                <Printer className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-900 font-medium">+91 2345-6789</span>
              </div> */}
                </div>
              </div>
            </div>

            {/* Right Side - QR Code */}
            <div className=" ml-8">

              {/* QR Code Pattern */}
              <div className="w-44 h-44 bg-white relative border-2 border-gray-800 rounded-lg p-4 " onClick={() => setIsOpen(true)}>
                <img src={PatientDetails?.QRCode} alt="QR Code" className="w-full h-full object-cover" />
                {/* <QRCodeGenerator value={PatientDetails?.PatientId} size={124.19}/> */}
              </div>

            </div>
          </div>
        </div>
      </Paper>

      {/* Fullscreen Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="relative">
            <img src={PatientDetails?.QRCode} alt="QR Code" className="w-full h-full object-cover" />
            {/* <QRCodeGenerator  value={PatientDetails?.PatientId} size={300}/> */}
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-black text-3xl font-bold"
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

export default ProfileCard2;
