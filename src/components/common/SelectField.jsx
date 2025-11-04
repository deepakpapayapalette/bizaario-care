import React from 'react'
import { GrLocation } from "react-icons/gr";
const SelectField = ({ value, onChange }) => {
  return (
    <>
      <div className=" lg:ps-4">
        <div className=" border-2  rounded-lg  px-3  flex items-center gap-2 sm:w-[180px] me-3 md:me-0">
          <span className="bg-white input-group-text border-end-0">
            <GrLocation size={24} className="text-[var(--primary)]" />
          </span>
          <select className="py-3.5 lg:w-[100px] w-full "
            value={value}
            onChange={onChange}
          >
            <option disabled>Select Country</option>
            <option>India</option>
            <option>USA</option>
            <option>Sri Lanka</option>
          </select>
        </div>
      </div>
    </>
  )
}

export default SelectField

