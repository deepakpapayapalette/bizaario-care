import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { __postApiData } from '@utils/api';
import SelectField from "@components/common/SelectField";
import NewsArticleCard from "../../common/NewsArticleCard";
import ShimerLoader from "../../common/ShimerLoader";

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
          containerClass=" pe-1 "
          itemClass="pe-4 "
          infinite
          partialVisible
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`border-2 py-3 pe-2 rounded-md text-webprimary hover:bg-webprimary hover:text-white w-full  ${activeTab === tab.label ? "activeTab bg-webprimary text-white" : ""
                }`}
              onClick={() => setActiveTab(tab.label)}
            >
              {tab.label}
            </button>
          ))}
        </Carousel>

        <SelectField value={selectContry} onChange={(e) => setSelectCountry(e.target.value)} />
      </div>

      {/* ==========news and articles cards ========== */}
      <div>
        {contentList.length === 0 ?
          <div className="grid md:grid-cols-3 gap-4">
            {contentList.length === 0 && (<ShimerLoader />)}
          </div>
          :
          <Carousel
            arrows={false}
            responsive={responsiveCardList}
            containerClass=" pb-8"
            itemClass="pe-4 "
            infinite
            partialVisible
            showDots={true}
          >
            {contentList?.map((news) => (
              <NewsArticleCard news={news} key={news._id} />
            ))}
          </Carousel>
        }
      </div>


    </div>
  );
};

export default NewsAndArticles;
