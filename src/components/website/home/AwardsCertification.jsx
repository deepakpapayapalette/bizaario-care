import React from 'react'
import Carousel from "react-multi-carousel";

import { BsLink } from "react-icons/bs";
import { useEffect, useState } from 'react';
import { __postApiData } from '@utils/api';
import { Link } from 'react-router-dom';
import ShimerLoader from '../../common/ShimerLoader';
import AwardCard from '../../common/AwardCard';
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
        {awards.length > 0 ?
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
              <AwardCard key={item._id || index} item={item} />
            ))}
          </Carousel>
          :
          <div className="grid md:grid-cols-3 gap-4">
            <ShimerLoader />
            <ShimerLoader />
            <ShimerLoader />
          </div>
        }
      </div>

    </div>
  )
}

export default AwardsCertification

