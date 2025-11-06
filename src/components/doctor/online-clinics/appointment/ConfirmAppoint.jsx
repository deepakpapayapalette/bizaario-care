import React, { use } from "react";
import { X } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { BsCopy } from "react-icons/bs";
import { CiCalendar } from "react-icons/ci";
import { GoClock } from "react-icons/go";

const ConfirmAppoint = ({ onClose }) => {

  const copiedLink = "/online-meeting";
  const copiedPassword = "sojaY^^$56";
  const handleCopylink = () => {
    navigator.clipboard.writeText(copiedLink);
    alert("Copied!");
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(copiedPassword);
    alert("Copied!");
  }


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
      <div className="relative bg-white rounded-xl shadow-xl p-8 w-[420px] max-w-full">
        {/* Close Button */}
        <button
          onClick={() => onClose(false)}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        {/* Title */}
        <h1 className="text-2xl font-semibold text-center mb-1">
          Appointment Confirmed!
        </h1>
        <p className="text-center text-gray-600 mb-5 text-sm">
          Your appointment has been successfully booked.
        </p>

        {/* Appointment Details */}
        <div className="mb-4">
          <h2 className="font-semibold text-lg mb-2">Appointment Details</h2>
          <div className="text-base text-gray-800 mb-1">
            Doctor Name: Dr. Dominic Stonehart
          </div>
          <div className="text-base text-gray-800 mb-4">
            Consultations Mode : <span className="font-medium">Online</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="flex items-center px-2 py-1 bg-gray-100 rounded-lg text-gray-700 text-sm">
              <CiCalendar />
              20/02/2025
            </span>
            <div className="flex gap-2 items-center px-2 py-1 bg-gray-100 rounded-lg text-gray-700 text-sm">
              <GoClock />
              <div>
                03:30 - 04:00 PM
              </div>
            </div>
            <span className="flex items-center px-2 py-1 bg-gray-100 rounded-lg text-gray-700 text-sm">
              <svg
                className="w-4 h-4 mr-1 text-gray-700"
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <path d="M8 8h8v8H8z" />
              </svg>
              BC6356296654C
            </span>
          </div>
        </div>

        {/* Joining Details */}
        <div className="mb-6">
          <h2 className="font-semibold text-md mb-2">Joining Details</h2>
          <div className="mb-2">
            Meeting Link :
            <Link
              to={`/online-meeting`}

              className="text-blue-700 ml-2 break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://skocldmo.knnlvd.com
            </Link>
            <button
              onClick={handleCopylink}
              className="inline-block align-middle ml-1 bg-blue-500 text-white px-1 py-1 rounded">
              <BsCopy />
            </button>


          </div>
          <div>
            Joining Password:
            <span className="ml-2 bg-gray-100 p-1 rounded select-all">sojaY^^$56</span>
            <button
              onClick={handleCopyPassword}
              className="inline-block align-middle ml-1 bg-blue-500 text-white px-1 py-1 rounded">
              <BsCopy />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-md font-medium text-gray-800 mt-2">
          All details will send on your registered email Id
        </div>
      </div>
    </div>
  );
};

export default ConfirmAppoint;
