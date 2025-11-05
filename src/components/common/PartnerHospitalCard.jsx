import React from 'react'
import { FaClock, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';
const PartnerHospitalCard = ({ item, handleViewProfile }) => {
  return (
    <>
      <div
        key={item?.id}
        className="p-4  border-gray-200 border border-b-[6px] relative bg-white shadow-sm rounded-xl transition-all h-full flex flex-col trusted-medical-card"
      >
        <div className="w-full h-[170px] bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg">
          <img
            src={item?.image} // Use item.image or provide your image path
            alt="NovaCare Hospital"
            className="object-cover w-full h-full"
          />
          <img
            src={item?.Logo}
            alt="doctor"
            className="absolute z-50 object-cover w-20 h-20 border-4 border-white rounded-full shadow top-[140px] left-4 sm:left-6 sm:w-24 sm:h-24"
          />
        </div>
        {/* Details */}
        <div className="pt-16">
          <div className="flex items-center gap-2 mb-2">

            <div>
              <h2 className="font-semibold text-xl mb-1">{item?.name}</h2>
              <div className="text-gray-600 text-sm">{item?.exp}</div>
            </div>
          </div>
          <div className="flex items-center text-gray-700 text-base mb-2 gap-2 mt-3">
            <FaMapMarkerAlt className="text-lg text-gray-600 mr-1" />
            <span>{item?.location}</span>
          </div>
          <div className="flex items-center text-gray-700 text-base mb-2 gap-2">
            <FaClock className="text-lg text-gray-600 mr-1" />
            <span>{item?.hours || "24/7"}</span>
          </div>
          <div className="flex items-center text-gray-700 text-base mb-2 gap-2">
            <FaGlobe className="text-lg text-gray-600 mr-1" />
            <span>{item?.Website}</span>
          </div>
        </div>
        {/* Action Buttons */}
        <div className=''>
          <button className="w-full theme-btn-fill"
            onClick={() => handleViewProfile(item.id)}
          >
            Book an Appointment
          </button>
        </div>
        <div className="py-4 flex gap-4 w-full">
          <button className="w-full theme-btn-fill">
            Send Medical Query
          </button>
          <button className="w-full theme-btn-ouline"
            onClick={handleViewProfile}
          >
            View Profile
          </button>
        </div>
      </div>
    </>
  )
}

export default PartnerHospitalCard
