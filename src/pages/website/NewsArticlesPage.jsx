import React, { useEffect, useState } from 'react'
import Banner from '@components/common/Banner'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { __postApiData } from '@utils/api';
import ShimerLoader from '@components/common/ShimerLoader';
import NewsArticleCard from '@components/common/NewsArticleCard';

const bannerData = {
  // image: bannerImage,
  title: 'News & Articles',
  description: "Empowering hospitals, physicians, and patients with real-time communication and clinical collaboration—because better care starts with better connection."
}
const TABS = [
  { key: "tab1", label: "All Articles" },
  { key: "tab2", label: "Orthopedics" },
  { key: "tab3", label: "Pediatrics" },
  { key: "tab4", label: "Neurology" },
  { key: "tab5", label: "Obstetrics & Gynecology" },
  { key: "tab6", label: "Otorhinolaryngology" },
  { key: "tab7", label: "Plast Reconstr Surg" },
  { key: "tab1", label: "Cardiology" },
];
const NewsArticlesPage = () => {
  const [activeTab, setActiveTab] = useState("All Articles");
  const [contentList, setContentList] = useState([]);

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


  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 6 },
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5, partialVisibilityGutter: 20 },
    tablet: { breakpoint: { max: 1024, min: 767 }, items: 3, partialVisibilityGutter: 10 },
    mobile: { breakpoint: { max: 767, min: 0 }, items: 2, partialVisibilityGutter: 20 },
  };


  return (
    <>
      <Banner data={bannerData} />
      <div className='container space-top'>
        <div className='md:w-4/5 mb-6 md:mb-0'>
          <h2 className='text-2xl md:text-4xl font-semibold mb-2'>Read News & Articles</h2>
          <p className='text-para'>Empowering hospitals, physicians, and patients with real-time communication and clinical collaboration—because better care starts with better connection.</p>
        </div>
      </div>

      <div className='container mt-6 md:mt-8'>
        <Carousel
          arrows={false}
          responsive={responsive}
          containerClass="w-full"
          itemClass="pe-4"
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

        <div className='mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {contentList.length === 0 && (<ShimerLoader />)}
          {contentList?.map((news, index) => (
            <NewsArticleCard key={index} news={news} handleViewProfile={() => { }} />
          ))}
        </div>
      </div>
    </>
  )
}

export default NewsArticlesPage

