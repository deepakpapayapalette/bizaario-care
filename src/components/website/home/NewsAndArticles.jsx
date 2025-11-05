import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { GrLocation } from "react-icons/gr";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { __postApiData } from '@utils/api';
import { FaClock, FaCalendarAlt, FaEye } from "react-icons/fa";
import SelectField from "@components/common/SelectField";

const TABS = [
  { key: "tab1", label: "Cardiology" },
  { key: "tab2", label: "Orthopedics" },
  { key: "tab3", label: "Pediatrics" },
  { key: "tab4", label: "Neurology" },
  { key: "tab5", label: "Obstetrics & Gynecology" },
  { key: "tab6", label: "Otorhinolaryngology" },
  { key: "tab7", label: "Plast Reconstr Surg" }
];

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5, partialVisibilityGutter: 20 },
  tablet: { breakpoint: { max: 1024, min: 767 }, items: 3, partialVisibilityGutter: 10 },
  mobile: { breakpoint: { max: 767, min: 0 }, items: 1, partialVisibilityGutter: 20 },
};
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

const NewsAndArticles = () => {
  const [activeTab, setActiveTab] = useState('Cardiology');
  const [contentList, setContentList] = useState([]);
  const [selectContry, setSelectCountry] = useState('');




  const getContentList = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/ContentList",
        {
          page: 1,
          limit: 100,
          ContentTypeId: "68afff04874340d8d79dbf4d"
        });

      if (resp.response.response_code === "200") {
        setContentList(resp.data.list || []);
      }
    } catch (error) {
      console.error("Error fetching content list:", error);
    }
  };

  useEffect(() => {
    getContentList()
  }, [])

  return (
    <div className="container space-top">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="mb-4">
          <h2 className="text-2xl md:text-4xl font-semibold mb-2">News And Articles</h2>
          <p className="text-para">
            Learn from leading doctors and specialists through focused, digestible video content.
          </p>
        </div>

        <div className="mb-6 md:mb-0">
          <Link
            className="theme-btn-fill inline-block px-15 py-3  "
            to="/view-all-hospitals"
          >
            View All <FaArrowRight size={18} className="inline" />
          </Link>
        </div>
      </div>

      {/* =========Tabs + Country=========== */}
      <div className="lg:flex justify-between items-start mb-6">
        <Carousel
          arrows={false}
          responsive={responsive}
          containerClass=""
          itemClass="pe-4 pb-3 "
          infinite
          partialVisible
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`border-2 py-3  rounded-md text-webprimary hover:bg-webprimary hover:text-white transition-all w-full  px-2 mb-3 ${activeTab === tab.label ? "activeTab bg-webprimary text-white" : ""
                }`}
              onClick={() => setActiveTab(tab.label)

              }
            >
              {tab.label}
            </button>
          ))}
        </Carousel>

        <SelectField value={selectContry} onChange={(e) => setSelectCountry(e.target.value)} />
      </div>

      {/* ==========news and articles cards ========== */}
      <div>
        <Carousel
          arrows={false}
          responsive={responsiveCardList}
          containerClass=" pe-2 "
          itemClass="pe-4 pb-3"
          infinite
          partialVisible
        >
          {contentList?.map((news) => (
            <div key={news._id} className="pe-2 pb-3 h-full flex flex-col bg-white rounded-2xl border border-gray-300 hover:shadow-lg p-4 w-full" >
              <Link to={`/news-articles/${news._id} `}  >
                <div className=" ">
                  {/* Image Section */}
                  <div className="w-full h-44 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center mb-3">
                    <img
                      src={news.ContentImage}
                      alt={news.ContentTitle}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {/* Meta Info */}
                  <div className="flex justify-between items-center text-gray-500 text-xs mb-2">
                    <div className="flex items-center gap-1">
                      <FaClock className="text-gray-400" />
                      <span>20Min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-gray-400" />
                      <span>20/12/2025</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaEye className="text-gray-400" />
                      <span>2,005</span>
                    </div>
                  </div>
                  {/* Title */}
                  <div className="font-semibold text-lg mb-1 text-black leading-snug line-clamp-2">
                    {news.ContentTitle}
                  </div>
                  {/* Subtitle */}
                  <div className="text-gray-700 text-sm line-clamp-6">
                    {news.LongDescription}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </Carousel>

      </div>


    </div>
  );
};

export default NewsAndArticles;
