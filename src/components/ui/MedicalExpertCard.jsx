import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaBriefcaseMedical } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
// import locationIcon from "../../assets/images/icons/location-pin-alt-1-svgrepo-com 1.png";
// import workIcon from "../../assets/images/icons/work.png";
import api from "../../api";

// import responsive from "@utils/responsive-card_carousel";

const MedicalExpertCard = () => {
  const navigate = useNavigate();
  const [doctorArr, setDoctorArr] = useState([]);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 3
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      partialVisibilityGutter: 20
    },
    tablet: {
      breakpoint: { max: 1024, min: 767 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 767, min: 0 },
      items: 1,

    }
  };

  const getDoctorProfile = async () => {
    try {
      const resp = await api.post("api/v1/admin/assetList", {
        AssetCategoryLevel1: "68b0104063729ea39b28d0fb",
      });

      const formattedData = resp.data.data.list.map((doc, index) => ({
        id: doc._id || index + 1,
        name: doc.AssetName,
        // exp: `${
        //   (doc.MedicalSpecialties || []).map((item) => item.lookup_value).join(", ")
        // } | ${doc.experience || 0} Years Experience`,
        exp: `${doc.MedicalSpecialties[0].lookup_value} | ${doc.experience || 5} Years Experience`,
        location: `${doc.AddressLine1} ${doc.AddressLine2}${doc.PostalCode}` || "",
        Specializes: `${(doc.MedicalSpecialties || []).map((item) => item.lookup_value).join(", ")
          } `,
        image: doc.ProfilePicture || null,
      }));

      setDoctorArr(formattedData);
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    }
  };

  useEffect(() => {
    getDoctorProfile();
  }, []);

  return (
    <Carousel
      responsive={responsive}
      itemClass="px-2 pb-3"
      arrows={false}
      infinite={true}
      partialVisible={true}
    >
      {doctorArr.map((item) => (
        <div
          key={item.id}
          className="p-4 border-gray-200 border border-b-[6px] relative bg-white shadow-sm rounded-xl  transition-all h-full flex flex-col   trusted-medical-card"
        >

          <div className="w-full h-[170px] bg-gray-100 flex items-center justify-center overflow-hidden rounded-lg">
            <img
              src={item?.image}
              alt=""
              className="object-cover w-full h-full"
            />
          </div>
          {/* Details */}
          <div className=" pt-4">
            <h2 className="font-semibold text-xl mb-1">Dr. Dominic Stonehart</h2>
            <div className="text-gray-600 text-sm mb-3">
              Cardiologist | 15+ Years Experience
            </div>
            <div className="flex items-center text-gray-700 text-base mb-2 mt-4 gap-2">
              <FaMapMarkerAlt className="text-lg text-gray-600 mr-1" />
              <span>Fortis Hospital, Mumbai</span>
            </div>
            <div className="flex gap-1 items-start mb-2">
              <div>
                <FaBriefcaseMedical className="mt-1 mr-2 text-lg text-gray-600" />
              </div>
              <div>
                <span className="font-semibold">Specializes in:</span>
                <span className="ml-1 text-gray-700">
                  Interventional Cardiology, Heart Failure Management, Preventive Cardiology
                </span>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className=" py-4 flex gap-4 w-full">
            <button className="w-full theme-btn-fill ">
              Send Medical Query
            </button>
            <button className="w-full theme-btn-ouline">
              View Profile
            </button>
          </div>
        </div>
      ))}
    </Carousel>
  );
};

export default MedicalExpertCard;
