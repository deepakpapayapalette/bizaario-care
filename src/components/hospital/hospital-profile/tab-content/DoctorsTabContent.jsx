import React from "react";
// import DoctorCard from '../cards/DoctorCard';
import doctorImg from "@assets/images/website/doctors/doctor.jpg";
import { FaMapMarkerAlt, FaBriefcaseMedical } from "react-icons/fa";
import { MapPin, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";


export const doctorsArr = [
  {
    id: 1,
    name: "Dr. Dominic Stonehart",
    img: doctorImg,
    title: "Cardiologist | 15+ Years Experience",
    location: "Fortis Hospital, Mumbai",
    specialization:
      "Interventional Cardiology, Heart Failure Management, Preventive Cardiology",
  },
  {
    id: 2,
    name: "Dr. Dominic Stonehart",
    img: doctorImg,
    title: "Cardiologist | 15+ Years Experience",
    hospital: "Fortis Hospital, Mumbai",
    specialization:
      "Interventional Cardiology, Heart Failure Management, Preventive Cardiology",
    location: "Fortis Hospital, Mumbai",
  },
  {
    id: 3,
    name: "Dr. Dominic Stonehart",
    img: doctorImg,
    title: "Cardiologist | 15+ Years Experience",
    hospital: "Fortis Hospital, Mumbai",
    specialization:
      "Interventional Cardiology, Heart Failure Management, Preventive Cardiology",
    location: "Fortis Hospital, Mumbai",
  },
  {
    id: 4,
    name: "Dr. Dominic Stonehart",
    img: doctorImg,
    title: "Cardiologist | 15+ Years Experience",
    hospital: "Fortis Hospital, Mumbai",
    specialization:
      "Interventional Cardiology, Heart Failure Management, Preventive Cardiology",
    location: "Fortis Hospital, Mumbai",
  },
  {
    id: 5,
    name: "Dr. Dominic Stonehart",
    img: doctorImg,
    title: "Cardiologist | 15+ Years Experience",
    hospital: "Fortis Hospital, Mumbai",
    specialization:
      "Interventional Cardiology, Heart Failure Management, Preventive Cardiology",
    location: "Fortis Hospital, Mumbai",
  },
  {
    id: 6,
    name: "Dr. Dominic Stonehart",
    img: doctorImg,
    title: "Cardiologist | 15+ Years Experience",
    hospital: "Fortis Hospital, Mumbai",
    specialization:
      "Interventional Cardiology, Heart Failure Management, Preventive Cardiology",
    location: "Fortis Hospital, Mumbai",
  },
];

const DoctorsTabContent = ({ hospitalData }) => {
  // Use dynamic doctors from hospitalData or fallback to static data
  const doctors = hospitalData?.doctors || doctorsArr;


  return (
    <div className="space-top">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {doctors?.map((doctor, index) => (
          <div key={doctor._id || index}
            className="p-4 border-gray-200 border border-b-[6px] relative bg-white shadow-sm rounded-xl  transition-all h-full flex flex-col   trusted-medical-card  justify-between"
          >
            <div>
              <div className="w-full h-[170px] bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg">
                <img
                  src={doctor.img || doctor.ProfilePicture || doctorImg}
                  alt={doctor.name || doctor.AssetName || "Doctor"}
                  className="object-cover w-full h-full "
                />
              </div>
              <div className=" pt-4">
                <h2 className="font-semibold text-xl mb-1">{doctor.AssetName}</h2>
                <div className="text-gray-600 text-sm mb-3">
                  {doctor.title ||
                    doctor.role ||
                    doctor.designation}
                </div>
                <div className="flex items-center text-gray-700 text-base mb-2 mt-4 gap-2">
                  <FaMapMarkerAlt className="text-lg text-gray-600 mr-1" />
                  <span>{doctor.location ||
                    doctor.hospital}</span>
                </div>
                <div className="flex gap-1 items-start mb-2">
                  <div>
                    <FaBriefcaseMedical className="mt-1 mr-2 text-lg text-gray-600" />
                  </div>
                  <div>
                    <span className="font-semibold">Specializes in:</span>
                    <span className="ml-1 text-gray-700">
                      {doctor.Specialization ||
                        doctor.specialty}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className=" py-4 flex gap-4 w-full flex-col xl:flex-row">
              <button className="w-full theme-btn-fill ">
                Send Medical Query
              </button>
              <Link to={`/medical-board/${doctor._id} `} className='w-full'>
                <button className="w-full theme-btn-ouline"

                >
                  View Profile
                </button>
              </Link>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsTabContent;
