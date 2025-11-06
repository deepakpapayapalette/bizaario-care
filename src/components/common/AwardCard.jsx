import React from 'react'
import { Link } from 'react-router-dom';
import { BsLink } from "react-icons/bs";
const AwardCard = ({ item, index }) => {
  return (
    <>
      <div key={item._id || index} className="">
        <div className="bg-white rounded-2xl shadow-md p-4 w-full max-w-full hover:shadow-lg mx-auto ">
          {/* Product Image */}
          <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center mb-4">
            <img
              src={item?.ContentImage}
              alt="Portable ECG Machine"
              className="object-cover w-full h-full"
            />
          </div>
          {/* Product Title & Icon */}
          <div className="mb-2 flex items-center gap-2">
            {/* <FaHeartbeat className="text-blue-600 text-xl" /> */}
            <span className="text-xl font-semibold line-clamp-1">{item?.ContentTitle}</span>
          </div>
          <div className="text-gray-700 text-sm mb-4 line-clamp-6 leading-relaxed">
            {item?.LongDescription}
          </div>
          {/* Action Button */}
          <Link to={item?.link}>
            <div className="text-webprimary flex  items-center hover:underline font-semibold">
              <BsLink className="inline mr-2" size={24} />
              Request a Quote
            </div>
          </Link>
        </div>
      </div>

    </>
  )
}

export default AwardCard

