import React, { useEffect, useState } from 'react'
import { FaArrowRight } from "react-icons/fa6";
import {
  FaRegClock,
  FaRegCalendarAlt,
  FaUserCircle,
  FaPlayCircle,
} from "react-icons/fa";
import { Link } from 'react-router-dom'
import Carousel from "react-multi-carousel"
import "react-multi-carousel/lib/styles.css"

import api from '../../../api';
import { __postApiData, __getApiData } from '@utils/api';




const Empowering = () => {
  const [digital_cme, setdigital_cme] = useState([]);

  const get_digital_cme_content = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/ContentList", {
        ContentTypeId: "68affee3874340d8d79dbf3b",
        // ContentPriority: 'Medium',
      });
      setdigital_cme(resp.data.list);
      // console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    get_digital_cme_content();
  }, []);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      partialVisibilityGutter: 24,
    },
    tablet: {
      breakpoint: { max: 1024, min: 640 },
      items: 2,
      partialVisibilityGutter: 20,
    },
    mobile: {
      breakpoint: { max: 640, min: 0 },
      items: 1,
      partialVisibilityGutter: 16,
    },
  }
  return (
    <div className='container space-top'>
      <div>
        <div className='flex items-center justify-between mb-4'>
          <div className=''>
            <h2 className='text-2xl md:text-4xl font-semibold  mb-2'>Empowering Doctors with Evidence-Based Knowledge</h2>
            <p className=' text-para mb-4'>
              Empowering Doctors with Evidence-Based Knowledge
            </p>
          </div>
          <Link className="theme-btn-fill px-15 py-3 flex  gap-2 items-center " to="/news-articles">
            View All <FaArrowRight size="18" className="inline  " />
          </Link>
        </div>

        <div>
          <Carousel
            responsive={responsive}
            infinite
            keyBoardControl
            swipeable
            draggable
            showDots={false}
            containerClass="pb-2 pt-4"
            itemClass="ps-0 pt-2 pe-4"
            arrows={false}
            renderButtonGroupOutside={false}
            partialVisible
          >
            {digital_cme?.map((element, index) => (
              <div key={index} className='h-full'>

                <Link
                  key={element._id || element.id}
                  to={`/news-articles/${element._id || element.id}`}
                  state={{ article: element }}
                  className="block h-full text-decoration-none"
                >
                  <EmpoweringCard element={element} />

                </Link>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </div>
  )
}

export default Empowering;

export function EmpoweringCard({ element }) {
  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg shadow hover:shadow-lg transition bg-white">

      {/* Image */}
      <div className="w-full h-[220px] relative flex items-center justify-center bg-gray-100">
        <img
          src={element?.ContentImage}
          alt="Doctor"
          className="w-full h-full object-cover"
        />

        {/* Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <FaPlayCircle className="text-white text-5xl bg-black/50 rounded-full" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col grow p-5">

        {/* Time and Date */}
        <div className="flex gap-6 text-gray-700 text-base mb-2">
          <div className="flex items-center gap-1">
            <FaRegClock />
            <span>20 Min</span>
          </div>
          <div className="flex items-center gap-1">
            <FaRegCalendarAlt />
            <span>{new Date(element.Date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="font-semibold text-xl leading-tight mb-1 line-clamp-1">
          {element.ContentTitle}
        </h2>

        {/* Description */}
        <p className="text-gray-700 text-base mb-4 line-clamp-3">
          {element.ShortDescription}
        </p>

        {/* Doctor Info → Stays at bottom */}
        <div className="flex items-start gap-3  rounded-lg  mt-auto">
          <div>

            <img
              src={element.AssetId?.ProfilePicture}
              alt={element.AssetId?.AssetName}
              className="object-cover border-2 border-white rounded-full w-9 h-9"
            />
          </div>

          <div>
            <div className="font-semibold text-base leading-none">
              {element.AssetId?.AssetName}
            </div>

            <p className="text-xs text-gray-600">
              {(element.AssetId?.MedicalSpecialties || [])
                .map((item) => item.lookup_value)
                .join(", ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

