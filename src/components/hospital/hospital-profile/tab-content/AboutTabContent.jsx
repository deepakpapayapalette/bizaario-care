import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Play } from "lucide-react";
import { __postApiData } from '@utils/api';
import { IoIosPlay } from "react-icons/io";
// import doctor1 from "https://bizaariocare.com/static/media/doctor1.85b37416e08fe7cf4a38.png";
// import cardImg from "../../../../../assets/images/hospital-profile/img1.png";
// import gallery1 from "../../../../../assets/images/hospital-profile/img1.png";
// import gallery2 from "../../../../../assets/images/hospital-profile/img2.png";
// import gallery3 from "../../../../../assets/images/hospital-profile/img3.png";
// import gallery4 from "../../../../../assets/images/hospital-profile/img4.png";
// import gallery5 from "../../../../../assets/images/hospital-profile/img5.png";
// import gallery6 from "../../../../../assets/images/hospital-profile/img6.png";

const galleryArr = []

const DigitalCmeArr = []
const InnovativeCaseArr = []
export default function AboutContent({ hospitalData }) {


  const [digitalCMEContent, setDigitalCMEContent] = useState([]);
  const [caseStudyContent, setCaseStudyContent] = useState([]);
  // console.log("digitalCMEContent", digitalCMEContent, caseStudyContent);

  const fetchContent = async () => {
    try {
      // Fetch Digital CME content
      const digitalCMEResponse = await __postApiData("/api/v1/admin/ContentList", {
        page: 1,
        limit: 20,
        ContentTypeId: "68affee3874340d8d79dbf3b", // Digital CME
        AssetId: hospitalData?.id,
      });
      // console.log(digitalCMEResponse, "Digital CME Content")

      if (digitalCMEResponse.data?.list) {
        setDigitalCMEContent(digitalCMEResponse.data.list);
      }

      // Fetch Case Study content
      const caseStudyResponse = await __postApiData("/api/v1/admin/ContentList", {
        page: 1,
        limit: 20,
        ContentTypeId: "68f2328a1f3b87f8f330fa5c", // Case Study
        AssetId: hospitalData?.id,
      });


      if (caseStudyResponse.data?.list) {
        setCaseStudyContent(caseStudyResponse.data.list);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  useEffect(() => {
    if (hospitalData?.id) {
      fetchContent();
    }
  }, [hospitalData?.id]);

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      partialVisibilityGutter: 20,
      dots: false,
    },
    tablet: {
      breakpoint: { max: 1024, min: 767 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 767, min: 0 },
      items: 1,
    },
  };
  return (
    <>
      <div className="">
        <p className="pb-3">{hospitalData?.description || "N/A"}</p>
        <p>{hospitalData?.ShortDescription || "N/A"}</p>
      </div>
      <div className="mt-10 lg:mt-20">
        <h2 className="pb-4 text-xl font-semibold lg:text-3xl">
          Hospital Tour
        </h2>
        {hospitalData?.videoGallery && hospitalData.videoGallery.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {hospitalData.videoGallery.map((videoUrl, index) => (
              <div key={index} className="p-4 bg-gray-400 rounded-lg">
                <video className="max-h-[350px] w-full rounded-lg" controls>
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center bg-gray-100 rounded-lg">
            <p className="text-gray-600">No hospital tour video available</p>
          </div>
        )}
      </div>

      {/* Digital CME Contents */}
      <div className="mt-10 lg:mt-20">
        <div>
          <h2 className="pb-4 text-xl font-semibold lg:text-3xl">
            Digital CME Contents
          </h2>
        </div>
        {digitalCMEContent.length > 0 ? (
          <Carousel
            //   removeArrowOnDeviceType={["tablet", "mobile"]}
            arrows={false}
            responsive={responsive}
            // autoPlay={false}
            // autoPlaySpeed={3000}
            // transitionDuration={2000}
            //additionalTransfrom={-20}
            //  pauseOnHover={false}
            //  centerMode={false}
            containerClass="carousel-container"
            itemClass=" px-2"
            showDots={false}
            infinite={true}
            renderDotsOutside={false}
            partialVisible={true}
            className="ps-0"
          >
            {digitalCMEContent.length > 0 &&
              digitalCMEContent.map((event, index) => (
                <div key={index}>
                  <div className="w-full bg-[#e5e7ee] rounded-2xl overflow-hidden h-full flex flex-col">
                    <div className="relative flex items-center justify-center px-4 py-4 cursor-pointer group">
                      <div>
                        <img
                          src={event.ContentImage || event.img}
                          alt="img"
                          className="rounded-2xl"
                        />
                      </div>

                      <div className="absolute flex items-center justify-center p-2 transition-transform duration-300 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg top-1/2 left-1/2 group-hover:scale-110">
                        <IoIosPlay size={24} className="text-gray-400" />
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 px-4 pb-6">
                      {/* Duration and Date */}
                      <div className="flex items-center gap-6 mb-3 text-sm text-black/80">
                        <span className="font-medium">
                          {event.duration || "N/A"}
                        </span>
                        <span className="font-medium">
                          {event.Date
                            ? new Date(event.Date).toLocaleDateString()
                            : event.date}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mb-3 text-xl font-bold leading-tight text-black line-clamp-2">
                        {event.ContentTitle || event.title}
                      </h3>

                      {/* Description */}
                      <p className="flex-1 mb-5 text-sm leading-relaxed text-black/70 line-clamp-3">
                        {event.ShortDescription || event.description}
                      </p>

                      {/* Doctor Info */}
                      <div className="flex items-center gap-3 mt-auto">
                        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 border border-white rounded-full bg-slate-200">
                          <span className="text-sm font-semibold text-slate-600">
                            {(event.AssetId?.AssetName || event.doctor)
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-black">
                            By {event.AssetId?.AssetName || event.doctor}
                          </p>
                          <p className="text-xs text-black/70">
                            {event.GrantingBody || event.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </Carousel>
        ) : (
          <div className="p-8 text-center bg-gray-100 rounded-lg">
            <p className="text-gray-600">No Digital CME content available</p>
          </div>
        )}
      </div>

      {/* ==============Innovative Case Studies============== */}
      <div className="mt-10 lg:mt-20">
        <div>
          <h2 className="pb-6 text-xl font-semibold lg:text-3xl">
            Innovative Case Studies
          </h2>
        </div>

        {caseStudyContent.length > 0 || InnovativeCaseArr.length > 0 ? (
          <div>
            <Carousel
              //   removeArrowOnDeviceType={["tablet", "mobile"]}
              arrows={false}
              responsive={responsive}
              // autoPlay={false}
              // autoPlaySpeed={3000}
              // transitionDuration={2000}
              //additionalTransfrom={-20}
              //  pauseOnHover={false}
              //  centerMode={false}
              containerClass=" carousel-container"
              itemClass=" px-2"
              showDots={false}
              infinite={true}
              renderDotsOutside={false}
              partialVisible={true}
              className="ps-0"
            >
              {(caseStudyContent.length > 0
                ? caseStudyContent
                : InnovativeCaseArr
              ).map((event, index) => (
                <div key={index}>
                  <div className="w-full bg-[#e5e7ee] rounded-2xl overflow-hidden h-full flex flex-col">
                    {/* Video Thumbnail */}
                    <div className="relative flex items-center justify-center px-4 py-4 cursor-pointer group">
                      <div>
                        <img
                          src={event.ContentImage || event.img}
                          alt="img"
                          className="rounded-2xl"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 px-4 pb-6">
                      {/* Duration and Date */}
                      <div className="flex items-center gap-6 mb-3 text-sm text-black/80">
                        <span className="font-medium">
                          {event.duration || "N/A"}
                        </span>
                        <span className="font-medium">
                          {event.Date
                            ? new Date(event.Date).toLocaleDateString()
                            : event.date}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mb-3 text-xl font-bold leading-tight text-black line-clamp-2">
                        {event.ContentTitle || event.title}
                      </h3>

                      {/* Description */}
                      <p className="flex-1 mb-5 text-sm leading-relaxed text-black/70 line-clamp-3">
                        {event.ShortDescription || event.description}
                      </p>

                      {/* Doctor Info */}
                      <div className="flex items-center gap-3 mt-auto">
                        <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 border border-white rounded-full bg-slate-200">
                          <span className="text-sm font-semibold text-slate-600">
                            {(event.AssetId?.AssetName || event.doctor)
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-black">
                            By {event.AssetId?.AssetName || event.doctor}
                          </p>
                          <p className="text-xs text-black/70">
                            {event.GrantingBody || event.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-100 rounded-lg">
            <p className="text-gray-600">No Case Study content available</p>
          </div>
        )}
      </div>

      {/* gallery */}
      <div className="mt-10 mb-5 lg:mt-20 lg:mb-10">
        <div>
          <h2 className="pb-6 text-xl font-semibold lg:text-3xl">
            Our Gallery
          </h2>
        </div>
        {/* <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {galleryArr.map((item, index) => (
            <div className="w-full overflow-hidden rounded-xl">
              <img src={item.img} alt="img" className="h-auto max-w-full" />
            </div>
          ))}
        </div> */}
        {hospitalData?.pictureGallery?.length > 0 ?
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 md:gap-4">
            {(hospitalData?.pictureGallery || galleryArr).map((item, index) => (
              <div
                key={item._id || index}
                className="relative w-full overflow-hidden transition-all duration-300 shadow-md cursor-pointer aspect-square rounded-xl hover:shadow-lg group"
              >
                <img
                  src={item || item.img}
                  alt={`Gallery ${index + 1}`}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 transition-colors duration-300 bg-black/0 group-hover:bg-black/20"></div>
              </div>
            ))}
          </div>
          :
          <div className="p-8 text-center bg-gray-100 rounded-lg">
            <p className="text-gray-600">No Gallery content available</p>
          </div>
        }

      </div>
    </>
  );
}
