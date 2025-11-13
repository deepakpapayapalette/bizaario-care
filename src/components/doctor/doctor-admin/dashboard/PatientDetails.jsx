import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { CgProfile } from "react-icons/cg";
import { FaIdCard } from "react-icons/fa";

const patients = [
  {
    name: "Prince Kumar",
    id: "BZ0108545564113C",
    nationality: "India",
    doctor: "Dr. Prince Kumar",
    steps: [
      { title: "VIL Issued", status: "Done", color: "#4B7F28", date: "20/12/2025" },
      { title: "Medical Via Issued", status: "In Processing", color: "#D6C90F", date: "20/12/2025" },
      { title: "Hospital Admission", status: "Not Complete", color: "#C23C3C", date: "20/12/2025" },
    ],
  },
  {
    name: "John Doe",
    id: "P002",
    nationality: "USA",
    doctor: "Dr. Smith",
    steps: [
      { title: "VIL Issued", status: "Done", color: "#4B7F28", date: "18/12/2025" },
      { title: "Medical Via Issued", status: "Done", color: "#4B7F28", date: "19/12/2025" },
      { title: "Hospital Admission", status: "In Processing", color: "#D6C90F", date: "20/12/2025" },
    ],
  },
];

export default function PatientDetails() {
  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 2, partialVisibilityGutter: 20 },
    tablet: { breakpoint: { max: 1024, min: 767 }, items: 2 },
    mobile: { breakpoint: { max: 767, min: 0 }, items: 1 },
  };

  return (
    <div className="space-top">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-4xl font-semibold">Patient Details</h2>
        <button className="theme-btn-fill">Use Filter:</button>
      </div>

      {/* Carousel */}
      <div className="mt-6">
        <Carousel
          arrows={false}
          responsive={responsive}
          infinite
          partialVisible
          itemClass="px-2"
        >
          {patients.map((patient, idx) => (
            <div key={idx} className="flex justify-center w-full">
              <div className="flex flex-col w-[594px] h-[613px] p-5 bg-[rgba(189,196,212,0.30)] border border-black/70 rounded-lg shadow-sm gap-3">
                {/* Top Section */}
                <div className="flex justify-between w-full mb-3 gap-3">
                  {/* Patient Info */}
                  <div className="w-[60%] bg-white rounded-lg shadow-sm p-3">
                    <h3 className="text-lg font-semibold mb-2">Patient Details</h3>
                    <div className="flex items-center gap-2">
                      <CgProfile className="text-webprimary text-lg" />
                      <a href="#" className="text-webprimary underline font-medium text-sm">
                        {patient.name}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <FaIdCard className="text-webprimary text-sm" />
                      <div className="text-webprimary text-xs">{patient.id}</div>
                    </div>
                  </div>

                  {/* Nationality */}
                  <div className="w-[35%] bg-white rounded-lg shadow-sm p-3">
                    <h3 className="text-lg font-semibold mb-1">Nationality</h3>
                    <p className="text-sm text-gray-800">{patient.nationality}</p>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="w-full bg-white rounded-lg shadow-sm p-3 mb-3">
                  <p className="text-gray-700 text-sm mb-1 font-medium">
                    Referred Doctor Name :
                  </p>
                  <p className="text-webprimary font-semibold">{patient.doctor}</p>
                </div>

                {/* Steps Section */}
                <div className="flex w-full items-start gap-4 flex-1">
                  {/* Timeline */}
                  <div className="relative mt-2 flex flex-col items-center">
                    {patient.steps.map((step, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="relative w-[18px] h-[18px] rounded-full border-[3px] border-[#CED6F3] bg-white">
                          <div
                            className={`absolute top-[2px] left-[2px] w-[10px] h-[10px] rounded-full ${step.status === "Done" ? "bg-gray-600" : "bg-transparent"
                              }`}
                          />
                        </div>
                        {i < patient.steps.length - 1 && (
                          <div className="w-1 h-[100px] bg-[#CED6F3]" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Step Details */}
                  <div className="flex-1">
                    {patient.steps.map((step, i) => (
                      <div
                        key={i}
                        className="bg-white rounded-lg shadow-sm p-4 mb-4 min-h-[60px] flex flex-col justify-center"
                      >
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">{step.title}</h4>
                        <div className="flex items-center my-2">
                          <span
                            className="w-[14px] h-[14px] rounded-full inline-block mr-2"
                            style={{ backgroundColor: step.color }}
                          ></span>
                          <span className="text-sm font-medium text-gray-800">{step.status}</span>
                        </div>
                        <div className="text-xs text-gray-600 flex items-center gap-1">
                          <span role="img" aria-label="calendar">
                            📅
                          </span>
                          {step.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
