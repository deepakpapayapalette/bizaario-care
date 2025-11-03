import React, { useState } from "react";
import { FaFacebookF, FaRegClock, FaCrown, FaCalendarAlt } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
const sessionsData = {
  header: {
    title: "Live Sessions – Join Now!",
    description:
      "Our expert doctors will be going live soon to answer your questions and share valuable health insights. Stay tuned for the next session.",
  },
  featuredSession: {
    id: "featured",
    title: "MENTAL HEALTH",
    subtitle: "JOIN OUR FACEBOOK LIVE SESSION ON",
    doctor: {
      name: "DR. JOHN SMITH",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
      // image: doctorImage,
      details: [
        "Personality disorders",
        "Psychotic disorders",
        "Mood Disorders",
      ],
    },
    sessionTitle: "Your Health Matters Live",
    description:
      "Our expert doctors will be going live soon to answer your questions and share valuable health insights.",
    date: "20/12/2025",
    time: "02:30 PM",
    doctorCredentials: "Senior Cardiologist (MBBS, MD)",
    isLive: true,
  },
  sessions: [
    {
      id: "session1",
      title: "OUR PRIORITY",
      subtitle: "A FREE CONSULTATION",
      date: "FRIDAY, APRIL 15TH, 2022",
      time: "10AM - 4PM",
      location: "SITE GROUNDS, LAGOS",
      bgImage:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800",
      // bgImage: Image,
      bgColor: "from-blue-600 to-blue-700",
    },
    {
      id: "session2",
      title: "WE CARE ABOUT YOUR HEALTH",
      subtitle: "SAVING LIVES EVERYDAY",
      services: [
        "SPECIALIST DOCTORS",
        "POSITIVE ENVIRONMENT",
        "EMERGENCY SERVICES",
      ],
      bgImage:
        "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800",
      bgColor: "from-gray-800 to-gray-900",
    },
    {
      id: "session3",
      title: "QUALITY HEALTH STARTS HERE",
      subtitle: "OUR SERVICES",
      features: [
        "24/7 Emergency Care",
        "Expert Medical Team",
        "Modern Equipment",
        "Patient-Centered Care",
      ],
      bgImage:
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
      bgColor: "from-blue-400 to-blue-500",
    },
    {
      id: "session4",
      title: "TOP MEDICAL CARE",
      subtitle: "FOR YOUR FAMILY",
      company: "HEALTH PLUS MEDICAL",
      bgImage:
        "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=800",
      bgColor: "from-teal-500 to-teal-600",
    },
  ],
};

const LiveSessions = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sessionsData.sessions.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? sessionsData.sessions.length - 1 : prev - 1
    );
  };

  return (
    <div className="space-top relative w-full min-h-screen bg-gradient-to-b from-[#043055] to-[#1268B3] flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-20 xl:px-[120px] py-8 md:py-12 lg:py-16 xl:py-[92px] gap-6 md:gap-9">

      {/* Header */}
      <div className="z-10 flex flex-col items-start w-full max-w-[1272px] gap-1">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[36px] font-bold text-white">
          {sessionsData.header.title}
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-[18px] text-white/90">
          {sessionsData.header.description}
        </p>
      </div>

      {/* Container */}
      <div className="z-10 w-full max-w-[1299px] flex flex-col gap-5 lg:flex-row">

        {/* Featured Card - hover disabled */}
        <div
          className={`flex flex-col justify-end items-start p-5 gap-3 rounded-xl overflow-hidden relative w-full lg:w-[515px] h-[500px] lg:h-[633px]`}
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 70%, #000 100%), url(${sessionsData.featuredSession.doctor.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* LIVE Badge */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center gap-2 px-3 py-1 text-sm text-white bg-webprimary rounded animate-pulse">
              <FaFacebookF />
            </div>
            <span className="px-3 py-1 text-sm font-bold text-white bg-red-600 rounded animate-pulse">
              LIVE
            </span>
          </div>

          <div className="flex flex-col items-start w-full gap-2">
            <p className="text-xs text-white">{sessionsData.featuredSession.subtitle}</p>
            <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white">
              {sessionsData.featuredSession.title}
            </h2>
            <p className="text-xs text-white">WITH</p>
            <h3 className="text-sm md:text-base lg:text-lg font-bold text-white">
              {sessionsData.featuredSession.doctor.name}
            </h3>
          </div>

          {/* Register Button */}
          <button className="w-full bg-webprimary hover:bg-opacity-80 text-white rounded-lg font-bold py-3 text-sm transition-all">
            Register Now
          </button>
        </div>

        {/* Carousel */}
        <div className="relative flex-1">
          <div className="relative h-[500px] lg:h-[633px] overflow-hidden">

            <div
              className="flex h-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {sessionsData.sessions.map((session) => (
                <div key={session.id} className="flex-shrink-0 w-full h-full px-2">
                  <div
                    className={`flex flex-col justify-between p-5 gap-3 rounded-xl overflow-hidden relative h-full cursor-pointer bg-gradient-to-br ${session.bgColor} text-white`}
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%), url(${session.bgImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div>
                      <h3 className="text-lg md:text-xl font-bold mb-2">
                        {session.title}
                      </h3>
                      <p className="text-sm md:text-base text-white/80 mb-4">
                        {session.subtitle}
                      </p>
                    </div>

                    <button className="w-full bg-webprimary hover:bg-opacity-80 text-white rounded-lg font-bold py-3 text-sm transition-all">
                      Register Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-0 p-2 text-white bg-black/50 rounded-full top-1/2 -translate-y-1/2 hover:bg-black/70"
          >
            <IoChevronBack size={22} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 p-2 text-white bg-black/50 rounded-full top-1/2 -translate-y-1/2 hover:bg-black/70"
          >
            <IoChevronForward size={22} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default LiveSessions;

