import React, { useState, useEffect } from 'react'
import { GrLocation } from "react-icons/gr";

const SelectField = ({ countryList = [], cityList = [], selectedCountry, selectedCity, onCountryChange, onCityChange }) => {
  return (
    <>
      {/* Country Select */}
      <div className="lg:ps-4 lg:mt-0 mt-6">
        <div className="border-2 rounded-lg px-3 flex items-center gap-2 sm:w-[180px] me-3 md:me-0 bg-white">
          <span className="bg-white input-group-text border-end-0">
            <GrLocation size={24} className="text-webprimary" />
          </span>
          <select
            className="py-3.5 lg:w-[100px] w-full bg-white border-0 focus:ring-0 focus:outline-0 md:text-md font-medium text-webprimary"
            value={selectedCountry}
            onChange={onCountryChange}
          >
            <option value="">Select Country</option>
            {countryList?.map((item) => (
              <option key={item._id} value={item._id}>
                {item.StationName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* City Select */}
      {selectedCountry && (
        <div className="lg:ps-4 lg:mt-0 mt-6">
          <div className="border-2 rounded-lg px-3 flex items-center gap-2 sm:w-[180px] me-3 md:me-0 bg-white">
            <span className="bg-white input-group-text border-end-0">
              <GrLocation size={24} className="text-webprimary" />
            </span>
            <select
              className="py-3.5 lg:w-[100px] w-full bg-white border-0 focus:ring-0 focus:outline-0 md:text-md font-medium text-webprimary"
              value={selectedCity}
              onChange={onCityChange}
            >
              <option value="">Select City</option>
              {cityList?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.StationName}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </>
  )
}

export default SelectField

