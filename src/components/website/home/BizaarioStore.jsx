import React from 'react'
import { FaArrowRight } from "react-icons/fa6";
import Carousel from "react-multi-carousel";
import { Link } from 'react-router-dom';

import image from '@assets/images/website/home/bizaario-store-card.png';
const BizaarioStore = () => {
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
      <div className="flex flex-col md:flex-row md:items-center justify-between ">
        <div className="mb-4  md:w-4/5">
          <h2 className="text-2xl md:text-4xl font-semibold mb-2">Bizaario Store</h2>
          <p className="text-para ">
            Shop smarter for your health-curated medical supplies and welness products at your fingertips.
          </p>
        </div>
        <div className="mb-6 md:mb-0">
          <Link
            className="theme-btn-fill inline-block px-15 py-3  "
            to="/"
          >
            View All <FaArrowRight size={18} className="inline" />
          </Link>
        </div>
      </div>

      <div>
        <Carousel
          arrows={false}
          responsive={responsiveCardList}
          containerClass=" pb-4 "
          itemClass="pe-4 pb-3"
          infinite
          partialVisible
          showDots={true}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className="pe-2 pb-3">
              <div className="bg-white rounded-2xl shadow-md p-4 w-full max-w-full hover:shadow-lg mx-auto ">
                {/* Product Image */}
                <div className="w-full h-64 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center mb-4">
                  <img
                    src={image}
                    alt="Portable ECG Machine"
                    className="object-cover w-full h-full"
                  />
                </div>
                {/* Product Title & Icon */}
                <div className="mb-2 flex items-center gap-2">
                  {/* <FaHeartbeat className="text-blue-600 text-xl" /> */}
                  <span className="text-xl font-semibold">Portable ECG Machine</span>
                </div>
                <div className="text-gray-700 text-sm mb-6">
                  Compact, easy-to-use device for monitoring heart health at home or clinic
                </div>
                {/* Action Button */}
                <button className="w-full py-3 bg-webprimary hover:bg-webhoverprimary text-white font-semibold rounded-lg">
                  Request a Quote
                </button>
              </div>
            </div>
          ))}
        </Carousel>

      </div>

    </div>
  )
}

export default BizaarioStore
