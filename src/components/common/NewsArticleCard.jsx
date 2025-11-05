import React from 'react'
import { Link } from 'react-router-dom'
import { FaClock, FaCalendarAlt, FaEye } from "react-icons/fa";
const NewsArticleCard = ({ news }) => {
  return (
    <>
      <div key={news._id} className=" h-full flex flex-col bg-white rounded-2xl border border-gray-300 hover:shadow-lg p-4 w-full" >
        <Link to={`/news-articles/${news._id} `}>
          <div className="pb-3">
            <div className="w-full h-44 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center mb-3">
              <img
                src={news.ContentImage}
                alt={news.ContentTitle}
                className="object-cover w-full h-full"
              />
            </div>
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
            <div className="font-semibold text-lg mb-1 text-black leading-snug line-clamp-2">
              {news.ContentTitle}
            </div>
            <div className="text-gray-700 text-sm line-clamp-6">
              {news.LongDescription}
            </div>
          </div>
        </Link>
      </div>
    </>
  )
}

export default NewsArticleCard
