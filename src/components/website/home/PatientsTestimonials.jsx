import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useEffect, useState } from 'react';
import { __postApiData } from '@utils/api';
import ShimerLoader from '../../common/ShimerLoader';

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



  // const settings = {
  //   dots: false,
  //   infinite: true,
  //   speed: 500,
  //   centerMode: true,
  //   centerPadding: "250px",
  //   slidesToShow: 1,
  //   arrows: true,
  //   nextArrow: <SampleNextArrow />,
  //   prevArrow: <SamplePrevArrow />,
  //   beforeChange: (current, next) => setActiveSlide(next),

  //   responsive: [
  //     {
  //       breakpoint: 1280,
  //       settings: {
  //         slidesToShow: 1,
  //         centerPadding: "150px",
  //       },
  //     },
  //     {
  //       breakpoint: 1024,
  //       settings: {
  //         slidesToShow: 1,
  //         centerPadding: "100px",
  //       },
  //     },
  //     {
  //       breakpoint: 768,
  //       settings: {
  //         slidesToShow: 1,
  //         centerPadding: "40px",
  //         arrows: false,     // hide arrows for tablet
  //       },
  //     },
  //     {
  //       breakpoint: 480,
  //       settings: {
  //         slidesToShow: 1,
  //         centerPadding: "10px",
  //         arrows: false,     // hide for mobile
  //       },
  //     },
  //     {
  //       breakpoint: 360,
  //       settings: {
  //         slidesToShow: 1,
  //         centerPadding: "0px",
  //         arrows: false,
  //       },
  //     },
  //   ],
  // };



  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % patient_testimonial.length);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(
      (prev) => (prev - 1 + patient_testimonial.length) % patient_testimonial.length
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + patient_testimonial.length) % patient_testimonial.length;
      visible.push({ ...patient_testimonial[index], position: i });
    }
    return visible;
  };
  const centerSlideFn = () => {
    if (!isCenter && !isAnimating) {
      setIsAnimating(true);
      if (isLeft) {
        setCurrentIndex(
          (prev) =>
            (prev - 1 + patient_testimonial.length) %
            patient_testimonial.length
        );
      } else if (isRight) {
        setCurrentIndex(
          (prev) => (prev + 1) % patient_testimonial.length
        );
      }
    }
  }



  return (
    <div className="container space-top">
      <div className="mb-12">
        <h2 className="text-2xl md:text-4xl font-semibold mb-2">Patients Testimonials</h2>
        <p className="text-para">
          Learn from leading doctors and specialists through focused,
          digestible video content.
        </p>
      </div>

      <div className=" max-w-full">
        <div className="relative ">
          {patient_testimonial.length === 0 ?
            <div className="grid md:grid-cols-3 gap-4">
              {patient_testimonial.length === 0 && (<ShimerLoader />)}
            </div>
            :
            <div className="flex flex-col items-center justify-center gap-4 transition-all duration-500 ease-in-out md:flex-row md:gap-4">

              {
                getVisibleTestimonials().map((testimonial, index) => {
                  const isCenter = testimonial.position === 0;
                  const isLeft = testimonial.position === -1;
                  const isRight = testimonial.position === 1;

                  return (
                    <div
                      key={`${testimonial.id}-${currentIndex}-${index}`}
                      className={`relative transition-all duration-300 flex flex-col items-center  border border-gray-300 rounded-lg p-3 hover:shadow-lg ${isCenter
                        ? "scale-100 opacity-100 z-20 "
                        : "scale-90 opacity-80 z-10 hidden md:flex"
                        } ${isCenter ? "" : "hover:opacity-80 cursor-pointer"}`}
                      onClick={centerSlideFn}
                      style={{
                        width: isCenter ? "100%" : "100%",
                        maxWidth: "475px",
                        minHeight: "auto",
                        padding: "20px",
                        borderRadius: "10px",
                        background: "#e8f0f8",
                        position: "relative",
                        alignSelf: "center",
                      }}
                    >
                      {/* Avatar */}
                      <div className="absolute transform -translate-x-1/2 -top-8 left-1/2">
                        <div className="relative">
                          <img
                            src={testimonial?.ContentImage || "/placeholder.svg"}
                            alt={testimonial?.ContentTitle}
                            className={`${isCenter ? "w-24 h-24" : "w-16 h-16"
                              } rounded-full object-cover border-4 border-white shadow-lg transition-all duration-300`}
                          />
                          {/* <div
                        className={`absolute -top-1 -right-1 bg-blue-600 rounded-full p-1 ${isCenter ? "scale-100" : "scale-75"
                          } transition-transform duration-300`}
                      >
                      <Quote
                        className={`${isCenter ? "w-3 h-3" : "w-2 h-2"
                          } text-white`}
                      />
                    </div> */}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col items-center justify-start w-full mt-12 text-left">
                        <blockquote
                          className={`text-gray-700 leading-relaxed mb-4 text-left italic w-full ${isCenter ? "text-base" : "text-sm"
                            }`}
                          style={
                            !isCenter
                              ? {
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                margin: "0", // ✅ no margin top
                              }
                              : {}
                          }
                        >
                          "{testimonial?.LongDescription}"
                        </blockquote>

                        <div className="w-full text-left">
                          <h4
                            className={`font-semibold text-gray-900 mb-1 ${isCenter ? "text-lg" : "text-base"
                              }`}
                          >
                            {testimonial?.AssetId?.AssetName}
                          </h4>
                          <p
                            className={`text-gray-600 ${isCenter ? "text-sm" : "text-xs"
                              }`}
                          >
                            {testimonial?.AssetId?.MedicalSpecialties?.map(
                              (item) => item.lookup_value
                            ).join(",")}
                          </p>
                          <p
                            className={`text-gray-500 mt-1 ${isCenter ? "text-xs" : "text-xs"
                              }`}
                          >
                            {testimonial.hospital}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          }
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prevTestimonial}
            disabled={isAnimating}
            className="p-2 transition-colors bg-transparent border-2 border-gray-300 rounded-full hover:border-webprimary hover:bg-websecondary"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {patient_testimonial.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentIndex(index);
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex
                  ? "bg-webprimary w-4"
                  : "bg-gray-300 hover:bg-gray-400"
                  }`}
              />
            ))}
          </div>

          <button
            onClick={nextTestimonial}
            disabled={isAnimating}
            className="p-2 transition-colors bg-transparent border-2 border-gray-300 rounded-full hover:border-webprimary hover:bg-websecondary"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div >
  )
}

export default PatientsTestimonials;

