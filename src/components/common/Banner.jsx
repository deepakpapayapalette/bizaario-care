import img from "../../assets/images/website/banner.png";

const Banner = ({ data }) => {

  return (
    <section className="relative w-full ">

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${data?.image || img || ""})`,
        }}
      />

      {/* <div className="absolute inset-0 bg-black/50" /> */}

      {/* Content */}
      <div className="relative z-10  ">
        {/* Text */}
        <div className="container flex justify-between items-end mx-auto py-8 sm:py-12 md:py-24" >

          <div className=" text-left text-white">
            <h2 className="text-3xl md:text-6xl font-semibold mb-4">{data?.title}</h2>
            <p className="text-base md:text-xl leading-relaxed">
              {data?.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
