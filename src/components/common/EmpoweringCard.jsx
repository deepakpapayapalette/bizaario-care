import {
  FaRegClock,
  FaRegCalendarAlt,
  FaUserCircle,
  FaPlayCircle,
} from "react-icons/fa";

export default function EmpoweringCard({ element }) {
  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg shadow hover:shadow-lg transition bg-white p-4">

      {/* Image */}
      <div className="w-full h-[220px] relative flex items-center justify-center bg-gray-100">
        <img
          src={element?.ContentImage}
          alt="Doctor"
          className="w-full h-full object-cover rounded-t-lg"
        />

        {/* Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <FaPlayCircle className="text-white text-5xl bg-black/50 rounded-full" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col grow py-4">

        {/* Time and Date */}
        <div className="flex gap-6 text-gray-700 text-base mb-2">
          <div className="flex items-center gap-1">
            <FaRegClock />
            <span>20 Min</span>
          </div>
          <div className="flex items-center gap-1">
            <FaRegCalendarAlt />
            <span>{new Date(element.Date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Title */}
        <h2 className="font-semibold text-xl leading-tight mb-1 line-clamp-1">
          {element.ContentTitle}
        </h2>

        {/* Description */}
        <p className="text-gray-700 text-base mb-4 line-clamp-3">
          {element.ShortDescription}
        </p>

        {/* Doctor Info → Stays at bottom */}
        <div className="flex items-start gap-3  rounded-lg  mt-auto">
          <div>

            <img
              src={element.AssetId?.ProfilePicture}
              alt={element.AssetId?.AssetName}
              className="object-cover border-2 border-white rounded-full w-9 h-9"
            />
          </div>

          <div>
            <div className="font-semibold text-base leading-none">
              {element.AssetId?.AssetName}
            </div>

            <p className="text-xs text-gray-600">
              {(element.AssetId?.MedicalSpecialties || [])
                .map((item) => item.lookup_value)
                .join(", ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
