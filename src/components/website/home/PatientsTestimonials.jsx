import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { __postApiData } from '@utils/api';

const PatientsTestimonials = () => {

  const [activeSlide, setActiveSlide] = useState(0);
  const [patient_testimonial, setpatient_testimonial] = useState([]);

  const getContentList = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/ContentList",
        {
          page: 1,
          limit: 100,
          ContentTypeId: "68c8f5fab5cf101deca56536"
          // "ContentPriority":"Medium"

        }
      );

      if (resp.response.response_code === "200") {
        setpatient_testimonial(resp.data.list || []);
      }
    } catch (error) {
      console.error("Error fetching content list:", error);
    }
  };

  useEffect(() => {
    getContentList()

  }, [])



  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    centerMode: true,
    centerPadding: "250px",
    // slidesToShow: 3,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    beforeChange: (current, next) => setActiveSlide(next),

    responsive: [
      {
        breakpoint: 1280, // large tabs / small laptops
        settings: {
          slidesToShow: 1,
          centerPadding: "150px",
        },
      },
      {
        breakpoint: 1024, // tablets landscape
        settings: {
          slidesToShow: 1,
          centerPadding: "100px",
        },
      },
      {
        breakpoint: 768, // tablet portrait / mobile large
        settings: {
          slidesToShow: 1,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 480, // small phones
        settings: {
          slidesToShow: 1,
          centerPadding: "10px",
        },
      },
    ],
  };


  return (
    <div className="container space-top">
      <div className="mb-4">
        <h2 className="text-2xl md:text-4xl font-semibold mb-2">Partner Hospitals</h2>
        <p className="text-para">
          World-class healthcare institutions with advanced facilities and trusted care.
        </p>
      </div>

      <div className="relative ">
        <Slider {...settings}>
          {patient_testimonial?.map((item, index) => {
            const isActive = index === activeSlide;
            return (
              <div key={index} className="md:px-3 pb-6 transition-all duration-500 md:pb-6 py-8 current-element pt-[50px]" >
                <div
                  className={` bg-[#e8f0f8] rounded-xl shadow-md hover:shadow-lg border-b-4 border-[#e8f0f8] hover:border-gray-600 p-4 flex flex-col items-center transition-all duration-500 ${isActive
                    ? "scale-105  md:min-h-[350px]"
                    : "scale-95 opacity-80 py-6"
                    }`}
                >
                  <div>

                    <img
                      src={item?.ContentImage}
                      alt={item?.ContentTitle}
                      className={` relative top-[-50px] rounded-full border-4 border-white shadow-md object-cover transition-all duration-500 ${isActive ? "w-24 h-24" : "w-20 h-20"
                        }`}
                    />
                  </div>
                  <div className='mt-[-40px]'>

                    <p className="text-para text-md mb-4 px-3 italic">
                      " {item?.LongDescription}"
                    </p>
                    <div className='text-start w-full'>
                      <h4 className="text-gray-800 text-2xl md:text-2xl font-semibold">{item?.AssetId?.AssetName}</h4>
                      <p
                        className={`text-para text-md
                      }`}
                      >
                        {item?.AssetId?.MedicalSpecialties?.map(
                          (item) => item.lookup_value
                        ).join(", ")}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  )
}

export default PatientsTestimonials;

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="mb-2 mt-3 absolute -bottom-12 left-1/2 transform translate-x-8 cursor-pointer bg-white shadow-md rounded-full p-3 hover:bg-webprimary hover:text-white transition"
      onClick={onClick}
    >
      <FaChevronRight />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      className="mb-2 mt-3 absolute -bottom-12 left-1/2 transform -translate-x-12 cursor-pointer bg-white shadow-md rounded-full p-3 hover:bg-webprimary hover:text-white transition"
      onClick={onClick}
    >
      <FaChevronLeft />
    </div>
  );
}

