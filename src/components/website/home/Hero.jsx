import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import heroVideo from "../../../assets/images/website/home/hero.mp4";

export const sliderArray = {
  id: 1,
  // sliderImage: {
  //   backgroundImage: `url(${slide1})`,
  // },
  videoSource: heroVideo,
  bannerTitle: "Where Doctors Collaborate, Patients Thrive",
  dsc: "Empowering hospitals, physicians, and patients with real-time communication and clinical collaboration—because better care starts with better connection.",
};

const Hero = () => {
  const stats = [
    { number: "120k", text: "Patient Referral" },
    { number: "2k", text: "Doctors Connected" },
    { number: "0.5k", text: "Hospitals Connected" },
  ];

  return (
    <div className="w-full">
      <div className="relative w-full lg:h-[90vh] md:h-[80vh] h-[85vh]  overflow-hidden">
        {/* Video BG */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover animate-zoomIn"
        >
          <source src={sliderArray.videoSource} type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70 animate-fadeIn" />

        {/* Content */}
        <div className="relative container h-full flex items-center">
          <div className="max-w-4xl animate-slideUp space-y-6">
            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-semibold animate-fadeInUp">
              {sliderArray.bannerTitle}
            </h1>

            <p className="text-gray-200 text-lg animate-fadeInUp delay-200">
              {sliderArray.dsc}
            </p>

            <div className="pt-4 animate-fadeInUp delay-300">
              <a
                href="#"
                className="relative inline-block px-8 py-3 border-2 border-white text-white font-semibold rounded-lg overflow-hidden hover:bg-white hover:text-webprimary transition-all duration-300"
              >
                <span className="relative z-10">Join Our Network</span>
                <div className="absolute inset-0 -left-full bg-white/20 animate-glow" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="w-full bg-webprimary py-4 animate-slideUpStats">
        <div className="container grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-2 rounded-lg  hover:-translate-y-2 hover:shadow-xl
                         transition-all duration-300 cursor-pointer animate-bounceIn"
            >
              <h3 className="text-4xl font-bold text-white animate-countUp">
                {stat.number}
              </h3>
              <p className="text-white mt-2">{stat.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
