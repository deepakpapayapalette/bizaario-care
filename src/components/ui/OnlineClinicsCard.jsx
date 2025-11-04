import React from 'react'
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserMd } from 'react-icons/fa';
import doctorImage from '@assets/images/website/home/online-clinic.png';
import { Link } from 'react-router-dom';
const OnlineClinicsCard = () => {
  return (
    <div className="w-full">
      <div className="p-4 bg-white rounded-xl shadow-md border border-gray-200 w-full max-w-md mx-auto">

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="border rounded-lg py-2 flex flex-col items-center">
            <span className="text-xl font-semibold">06</span>
            <span className="text-gray-700 text-sm">Days</span>
          </div>
          <div className="border rounded-lg py-2 flex flex-col items-center">
            <span className="text-xl font-semibold">12</span>
            <span className="text-gray-700 text-sm">Hours</span>
          </div>
          <div className="border rounded-lg py-2 flex flex-col items-center">
            <span className="text-xl font-semibold">18</span>
            <span className="text-gray-700 text-sm">Minutes</span>
          </div>
        </div>

        {/* Doctor Details */}
        <div className="flex gap-4 items-start mb-4">
          <img
            src={doctorImage}
            alt="Dr. Dominic Stonehart"
            className="rounded-lg object-cover w-28 h-28 bg-gray-100"
          />
          <div>
            <a
              href="#"
              className="font-semibold text-webprimary text-lg leading-tight mb-1 block"
            >
              Dr. Dominic Stonehart
            </a>
            <div className="text-gray-600 text-xs mb-2 flex items-center gap-2">
              <FaUserMd className="text-gray-700" /> Cardiologist | 15+ Years Experience
            </div>
            <div className="flex items-center text-gray-700 text-sm mb-1 gap-2">
              <FaCalendarAlt className="text-gray-700" />
              <span>20/12/2025</span>
              <FaClock className="ml-3 text-gray-700" />
              <span>02:30 AM</span>
            </div>
            <div className="flex items-center text-gray-700 text-sm gap-2">
              <FaMapMarkerAlt className="text-gray-700" />
              <span>Noida, Delhi NCR</span>
            </div>
          </div>
        </div>

        {/* Slot Info */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="border rounded-lg py-2 flex flex-col items-center">
            <span className="text-lg font-semibold">20</span>
            <span className="text-gray-700 text-xs">Total Slots</span>
          </div>
          <div className="border rounded-lg py-2 flex flex-col items-center">
            <span className="text-lg font-semibold">18</span>
            <span className="text-gray-700 text-xs">Available Slots</span>
          </div>
        </div>

        {/* Book Button */}
        <Link to="/appointment-form" className="w-full">
          <button className="w-full py-3 bg-webprimary text-white font-semibold rounded-lg mt-2 hover:bg-webhoverprimary transition-all">
            Book Appointment
          </button>
        </Link>
      </div>
    </div>
  )
}

export default OnlineClinicsCard

