import React from 'react'
import Carousel from "react-multi-carousel";

import { BsLink } from "react-icons/bs";
import { useEffect, useState } from 'react';
import { __postApiData } from '@utils/api';
import { Link } from 'react-router-dom';
import ShimerLoader from '../../common/ShimerLoader';
const AwardsCertification = () => {
  const [awards, setawards] = useState([])
  const getawards_list = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/ContentList",
        {
          page: 1,
          limit: 100,
          ContentTypeId: "68afff10874340d8d79dbf53"
          // "ContentPriority":"Medium"
        }
      );


      if (resp.response.response_code === "200") {
        setawards(resp.data.list || []);
      }
    } catch (error) {
      console.error("Error fetching content list:", error);
    }
  };

  useEffect(() => {
    getawards_list()
  }, [])

  // console.log("awards", awards);

  const responsiveCardList = {
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

  return (
    <div className="container space-top">
      <div className="flex  items-center justify-between">
        <div className="mb-4">
          <h2 className="text-2xl md:text-4xl font-semibold mb-2">Awards & Certification</h2>
          <p className="text-para ">
            Learn from leading doctors and specialists through focused, digestible video content.
          </p>
        </div>

      </div>

      <div>
        {awards.length === 0 ?
          <div className="grid md:grid-cols-3 gap-4">
            {awards.length === 0 && (<ShimerLoader />)}
          </div>
          :
          <Carousel
            arrows={false}
            responsive={responsiveCardList}
            containerClass="pb-6"
            itemClass="pe-4 pb-3"
            infinite
            partialVisible
            showDots={true}
          >
            {awards?.map((item, index) => (
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
            ))}
          </Carousel>
        }
      </div>

    </div>
  )
}

export default AwardsCertification

