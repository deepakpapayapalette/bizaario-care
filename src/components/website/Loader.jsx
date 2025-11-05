// import Image from "next/image";
import fav from "../../assets/images/website/logo-navbar.png"
export default function Loader() {
  return (
    <div className=" container ">

      {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  ">

        <div>

          <img
            src={fav}
            alt="Loading..."

          />

          <p>Loading...</p>
        </div>
      </div> */}

      <div className=" h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse w-full space-y-8">
          <div className=" flex justify-center items-center ">

            <img
              src={fav}
              alt="Loading..."
              className="w-[120px]"
            />
          </div>
          <div className="h-48 w-full bg-gray-200 rounded"></div>
          {/* <div className="h-8 w-full bg-gray-200 rounded"></div>
          <div className="h-20 w-full bg-gray-200 rounded"></div>
          <div className="h-12 w-full bg-gray-150 rounded"></div> */}
        </div>
      </div>
    </div>
  )
}
