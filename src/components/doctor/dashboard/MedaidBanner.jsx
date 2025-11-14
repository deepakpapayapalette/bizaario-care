import medaidbanner from "@assets/images/admin/doctor/dashboard-bg.png";

export default function MedaidBanner() {
  return (
    <div
      className={`
        relative w-full overflow-hidden rounded-lg
        bg-cover bg-center bg-no-repeat
        aspect-[16/6] min-h-[200px] mt-2
        sm:aspect-[16/6] sm:min-h-[200px] sm:bg-contain
        xs:aspect-[16/10] xs:min-h-[120px]
      `}
      style={{ backgroundImage: `url(${medaidbanner})` }}
    >
      <div
        className={`
          absolute inset-0 flex items-end justify-center p-4
          lg:items-center lg:justify-start lg:p-10
        `}
      >
        <button
          className={`
            bg-webprimary text-white font-semibold
            rounded-lg transition-colors
            px-6 py-2.5 text-lg hover:bg-[#005a91]
            lg:text-2xl lg:mt-[15%] lg:ml-[4%]
            sm:mt-[10%] sm:ml-[2%]
            xs:mt-4 xs:ml-0 xs:text-base xs:px-4 xs:py-2
          `}
        >
          Get Support Now
        </button>
      </div>
    </div>
  );
}
