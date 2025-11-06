import React from 'react'
import {
  FaMapMarkerAlt,
  FaLinkedin,
  FaInstagram,
  FaFacebookF,
  FaTelegram,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";

import { MdFileDownload } from "react-icons/md";
const DocProfileCard = ({ doctorData }) => {
  return (
    <div className='container md:pt-12 pt-8 '>
      <div className="">
        <h2 className="mb-5 text-3xl font-semibold">Doctor Profile</h2>
        <div className="bg-[#f2f3f6] rounded-lg ">
          <div className="flex flex-col gap-4 p-6 rounded-lg shadow ">
            <div className="flex flex-col gap-4 md:flex-row ">
              <div className="max-w-[200px]">
                {doctorData?.image ? (
                  <img
                    src={doctorData?.image}
                    alt="doctor"
                    className="h-auto max-w-full rounded-md"
                  />
                )
                  :
                  <div className="w-full p-4 bg-gray-100 rounded-2xl animate-pulse pe-5">
                    <div className="w-[170px]  h-40 bg-gray-400 rounded-lg " style={{ marginRight: '20px' }} />
                  </div>
                }
              </div>


              <div className="w-full">
                <div className="flex flex-col justify-between gap-2 mb-2 md:mb-0 md:flex-row">
                  <h3 className="text-2xl font-semibold ">
                    {doctorData?.name || "Dr. John Doe"}
                  </h3>
                  <button className="border-2 text-webprimary border-webprimary rounded-md py-3 px-4 flex items-center gap-2">
                    <MdFileDownload
                      className="inline text-webprimary"
                      size={20}
                    />
                    Download Doctor Profile
                  </button>
                </div>
                <div className="flex items-center mb-1 text-webprimary">
                  <FaMapMarkerAlt size={16} className="me-2" />
                  <span>
                    {doctorData?.location || "Sector 62, Noida, Uttar Pradesh"}
                  </span>
                </div>
                <p className="my-2 text-gray-700">
                  {doctorData?.description ||
                    "Dr. John Doe is a renowned cardiologist with over 15 years of experience in providing top-notch cardiac care. Specializing in heart diagnostics, treatment, and prevention, he has helped thousands of patients improve their health and well-being. Dr. Doe's compassionate approach and advanced technology make him a trusted name in the industry."}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div className="flex sm:gap-3 gap-2 mt-1">
                {doctorData?.linkedInAccount && (
                  <a
                    href={doctorData.linkedInAccount}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-webprimary p-1 shadow-card border bg-white border-gray-400  rounded-full h-10 w-10 grid items-center justify-center"
                  >
                    <FaLinkedin size={22} />
                  </a>
                )}
                {doctorData?.instagramAccount && (
                  <a
                    href={doctorData.instagramAccount}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-webprimary p-1 shadow-card border bg-white border-gray-400  rounded-full h-10 w-10 grid items-center justify-center"
                  >
                    <FaInstagram size={22} />
                  </a>
                )}
                {doctorData?.facebookPage && (
                  <a
                    href={doctorData.facebookPage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-webprimary p-1 shadow-card border bg-white border-gray-400  rounded-full h-10 w-10 grid items-center justify-center"
                  >
                    <FaFacebookF size={22} />
                  </a>
                )}
                {doctorData?.telegramChannel && (
                  <a
                    href={doctorData.telegramChannel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-webprimary p-1 shadow-card border bg-white border-gray-400  rounded-full h-10 w-10 grid items-center justify-center"
                  >
                    <FaTelegram size={22} />
                  </a>
                )}
                {doctorData?.whatsAppCommunity && (
                  <a
                    href={doctorData.whatsAppCommunity}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-webprimary p-1 shadow-card border bg-white border-gray-400  rounded-full h-10 w-10 grid items-center justify-center"
                  >
                    <FaWhatsapp size={22} />
                  </a>
                )}
                {doctorData?.youTubeChannel && (
                  <a
                    href={doctorData.youTubeChannel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-webprimary p-1 shadow-card border bg-white border-gray-400  rounded-full h-10 w-10 grid items-center justify-center"
                  >
                    <FaYoutube size={22} />
                  </a>
                )}
              </div>
              <div className="flex flex-col gap-4 mt-4 lg:mt-0 lg:flex-row  lg:justify-end lg:w-[440px]">
                <button className="inline-block md:w-[200px] w-full transition theme-btn h-[50px]">
                  Send Treatment Query
                </button>
                <div>
                  <button className="theme-btn-fill h-[50px] inline-block md:w-[200px] w-full  transition">
                    Book Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocProfileCard

