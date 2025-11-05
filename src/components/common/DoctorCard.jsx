import React from 'react'
import { FaMapMarkerAlt, FaBriefcaseMedical } from "react-icons/fa";
const DoctorCard = ({ item, handleViewProfile }) => {
  return (
    <>
      <div
        className="p-4 border-gray-200 border border-b-[6px] relative bg-white shadow-sm rounded-xl  transition-all h-full flex flex-col   trusted-medical-card  justify-between"
      >
        <div>
          <div className="w-full h-[170px] bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg">
            <img
              src={item?.image}
              alt=""
              className="object-cover w-full h-full"
            />
          </div>
          <div className=" pt-4">
            <h2 className="font-semibold text-xl mb-1">{item?.name}</h2>
            <div className="text-gray-600 text-sm mb-3">
              {item?.exp}
            </div>
            <div className="flex items-center text-gray-700 text-base mb-2 mt-4 gap-2">
              <FaMapMarkerAlt className="text-lg text-gray-600 mr-1" />
              <span>{item?.location}</span>
            </div>
            <div className="flex gap-1 items-start mb-2">
              <div>
                <FaBriefcaseMedical className="mt-1 mr-2 text-lg text-gray-600" />
              </div>
              <div>
                <span className="font-semibold">Specializes in:</span>
                <span className="ml-1 text-gray-700">
                  {item?.specialties}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className=" py-4 flex gap-4 w-full flex-col xl:flex-row">
          <button className="w-full theme-btn-fill ">
            Send Medical Query
          </button>
          <button className="w-full theme-btn-ouline">
            View Profile
          </button>
        </div>

      </div>

    </>
  )
}

export default DoctorCard
