import React from "react";
import img1 from "@assets/images/website/doctors/patient.jpg";

const PatientTestimonial = ({ hospitalData }) => {
  // Use dynamic testimonials from hospitalData or fallback to static data
  const testimonials = hospitalData?.patientTestimonials || [
    {
      _id: "1",
      ContentTitle: "From Fear to Healing: My Experience with Expert Care",
      GrantingBody: "Sunrise Medical Center",
      ShortDescription:
        "A patient shares their journey of overcoming fear and receiving compassionate, expert medical care that led to a full recovery",
    },
    {
      _id: "2",
      ContentTitle: "A Journey of Trust and Recovery",
      GrantingBody: "City Care Hospital",
      ShortDescription:
        "A detailed account of how trust in the medical team led to a smooth and successful treatment experience",
    },
    {
      _id: "3",
      ContentTitle: "From Fear to Healing: My Experience with Expert Care",
      GrantingBody: "Sunrise Medical Center",
      ShortDescription:
        "A patient shares their journey of overcoming fear and receiving compassionate, expert medical care that led to a full recovery",
    },
    {
      _id: "4",
      ContentTitle: "A Journey of Trust and Recovery",
      GrantingBody: "City Care Hospital",
      ShortDescription:
        "A detailed account of how trust in the medical team led to a smooth and successful treatment experience",
    },
  ];

  return (
    <div className="space-y-6">
      {testimonials.map((item) => (
        <div
          className="bg-[#f2f3f6] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
          key={item._id}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            {/* Content Section */}
            <div className="flex-1 space-y-4">
              <div className="flex items-start gap-2">
                <div className="text-4xl leading-none text-blue-500">"</div>
                <p className="text-base italic leading-relaxed text-gray-700">
                  {item.ShortDescription ||
                    "Dr. Stonehart is not only a great cardiologist but also a kind human being. He explained my condition clearly, eased my fears, and guided me through successful treatment. I now feel healthier and more confident about my heart."}
                </p>
              </div>

              <div className="pl-4 border-l-4 border-blue-500">
                <h3 className="mb-1 text-xl font-semibold text-gray-800">
                  {item.ContentTitle ||
                    "From Fear to Healing: My Experience with Expert Care"}
                </h3>
                <p className="font-medium text-blue-600">
                  {item.GrantingBody || "Sunrise Medical Center"}
                </p>
              </div>
            </div>

            {/* Image Section */}
            <div className="flex-shrink-0 lg:w-64">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={item.ContentImage || img1}
                  alt="patient testimonial"
                  className="object-cover w-full h-48 transition-transform duration-300 lg:h-56 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientTestimonial;
