import React, { useEffect, useState } from 'react'
import { FaRegPaperPlane, FaRegHeart, FaRegComment } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { GoEye } from "react-icons/go";
import { Link, useParams } from "react-router-dom";
import banner from "../../assets/images/website/banner.png";
import { __getApiData, __postApiData } from "../../utils/api";


const NewsDetail = () => {
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [articleData, setArticleData] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  const { id } = useParams();
  console.log(id, 'detail page');
  const [comments, setComments] = useState([
    {
      id: 1,
      name: "Ralph Edwards",
      date: "Aug 19, 2021",
      text: "In mauris porttitor tincidunt mauris massa sit lorem sed scelerisque. Fringilla pharetra vel massa enim sollicitudin cras. At pulvinar eget sodales adipiscing eget donec ultricies nibh tristique.",
      likes: 5,
      replies: 3,
    },
    {
      id: 2,
      name: "Ralph Edwards",
      date: "Aug 19, 2021",
      text: "In mauris porttitor tincidunt mauris massa sit lorem sed scelerisque. Fringilla pharetra vel massa enim sollicitudin cras. At pulvinar eget sodales adipiscing eget donec ultricies nibh tristique.",
      likes: 5,
      replies: 3,
    },
  ]);

  const fetchArticleData = async () => {
    try {
      setLoading(true);

      // Fetch article data from API using the ID
      const resp = await __getApiData(`/api/v1/admin/GetContent/${id}`, {
        // ContentTypeId: "68afff04874340d8d79dbf4d",
      });

      if (resp && resp.data) {
        setArticleData(resp.data);
      }

      // Fetch related articles using content list API
      const relatedResp = await __postApiData("/api/v1/admin/ContentList", {
        page: 1,
        limit: 10,
        ContentTypeId: "68afff04874340d8d79dbf4d",
      });

      console.log("Related articles response:", relatedResp);

      if (relatedResp && relatedResp.data.list) {
        // Check if data is an array
        if (Array.isArray(relatedResp.data.list)) {
          // Filter out current article and take first 3
          const related = relatedResp.data.list
            .filter((item) => (item.id || item._id) !== id)
            .slice(0, 2);
          setRelatedArticles(related);
        } else {
          console.warn(
            "Related articles data is not an array:",
            relatedResp.data.list
          );
          setRelatedArticles([]);
        }
      } else {
        console.warn("No related articles data received");
        setRelatedArticles([]);
      }
    } catch (error) {
      console.error("Error fetching article data:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchArticleData();
  }, [id]);

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    const newEntry = {
      id: Date.now(),
      name: "Deepak Kashyap",
      date: new Date().toLocaleDateString(),
      text: newComment,
      likes: 0,
      replies: 0,
    };
    setComments([newEntry, ...comments]);
    setNewComment("");
  };


  return (
    <>
      {/* ===========banner-section========= */}
      <div
        className="relative py-8 bg-right bg-no-repeat bg-cover md:py-12"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute inset-0 z-10 overlay bg-gradient-to-r from-white/80 via-white/60 to-white/0"></div>
        <div className="container relative z-50 px-4">
          <div className="max-w-4xl">
            <h5 className="mb-3 text-lg font-semibold text-gray-700">
              News & Articles
            </h5>
            <h1
              className="text-2xl font-bold leading-tight md:text-3xl lg:text-4xl"
              style={{ fontFamily: "Lora" }}
            >
              {articleData?.title ||
                articleData?.ContentTitle ||
                "Article Title"}
            </h1>
            <p className="mt-3 text-base text-gray-600 md:text-lg">
              {articleData?.desc ||
                articleData?.ShortDescription ||
                articleData?.description ||
                "Article description"}
            </p>
          </div>
        </div>
      </div>

      <section className="container pt-12  md:pt-20">
        <div className="w-full overflow-hidden rounded-lg">
          <img
            src={
              articleData?.img ||
              articleData?.ContentImage ||
              articleData?.image
            }
            alt={articleData?.title || articleData?.ContentTitle}
            className="w-full max-h-[650px] object-cover"
          />
        </div>
        {/* <div className="pt-6 mb-4">
          <h5
            className="mb-2 text-2xl font-semibold md:text-3xl"
            style={{ fontFamily: "Lora" }}
          >
            {articleData.title || articleData.ContentTitle}
          </h5>
          <p className="pb-3 text-lg text-gray-600">
            {articleData.desc ||
              articleData.ShortDescription ||
              articleData.description}
          </p>
          <p className="pb-3 text-lg text-gray-600">
            {articleData.LongDescription ||
              articleData.content ||
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis."}
          </p>
        </div> */}

        {/* {articleData.additionalImage && (
          <div className="w-full mb-4 overflow-hidden rounded-lg">
            <img
              src={articleData.additionalImage}
              alt="Additional content"
              className="w-full max-h-[650px] object-cover"
            />
          </div>
        )}

        <p className="pb-3 text-lg text-gray-600">
          {articleData.additionalContent ||
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida."}
        </p> */}
      </section>
      <section>
        <div className="container grid gap-10 px-4 py-10 mx-auto md:px-8 md:grid-cols-3">

          <div className="md:col-span-2">
            <h5
              className="mb-6 text-2xl font-semibold"
              style={{ fontFamily: "Lora" }}
            >
              Add Comments
            </h5>


            <div className="flex items-center gap-3 py-2 mb-8 border border-gray-200 rounded-full bg-gray-50 ps-2 pe-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#525fe1]"></div>
              <input
                type="text"
                placeholder="Ask a question..."
                className="flex-1 text-gray-700 placeholder-gray-400 bg-transparent outline-none"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                className="text-black transition hover:text-blue-800"
              >
                <FaRegPaperPlane size={18} />
              </button>
            </div>


            <div className="space-y-5">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 border border-gray-100 rounded-lg shadow-sm bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{comment.name}</h4>
                    <span className="text-sm text-gray-500">
                      {comment.date}
                    </span>
                  </div>
                  <p className="mb-3 leading-relaxed text-gray-600">
                    {comment.text}
                  </p>

                  <div className="flex items-center justify-end gap-4 text-sm text-gray-500">
                    <button className="font-medium hover:text-blue-600">
                      Reply
                    </button>
                    <div className="flex items-center gap-1">
                      <FaRegHeart /> <span>{comment.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaRegComment /> <span>{comment.replies}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="md:col-span-1">
            <h5
              className="mb-6 text-2xl font-semibold"
              style={{ fontFamily: "Lora" }}
            >
              You also Like
            </h5>

            <div className="space-y-6">
              {relatedArticles.map((item) => (
                <div
                  key={item.id || item._id}
                  className="p-3 overflow-hidden border border-gray-100 shadow-md bg-gray-50 rounded-xl"
                >
                  <div className="w-full mb-4 overflow-hidden rounded-lg">
                    <img
                      src={
                        item.img || item.ContentImage || item.image || img4
                      }
                      alt={item.title || item.ContentTitle}
                      className="object-cover w-full h-32"
                    />
                  </div>
                  <div className="flex justify-between gap-3 mb-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiClock size={14} /> 20Min
                    </span>
                    <span>
                      {new Date(
                        item.Date || item.createdAt || Date.now()
                      ).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <GoEye size={14} /> {item.views || "2,005"}
                    </span>
                  </div>
                  <h4 className="mb-1 leading-snug">
                    <Link
                      to={`/news-articles/${item.id || item._id}`}
                      state={item}
                      className="text-[#1D2E4A] font-semibold hover:text-blue-900 no-underline hover:underline"
                      style={{ fontFamily: "Lora" }}
                    >
                      {item.title || item.ContentTitle}
                    </Link>
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {(
                      item.desc ||
                      item.ShortDescription ||
                      item.description ||
                      "If you ask yourself what are some of your deal-breakers..."
                    ).substring(0, 100)}
                    ...
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default NewsDetail;
