import React, { useState } from 'react'
import AboutContent from './tab-content/AboutTabContent';
import AwardTabConent from './tab-content/AwardTabConent';
import UpcommingEventContent from './tab-content/UpcommingEventContent';
import PatientTestimonial from './tab-content/PatientTestimonial';

const tabs = [
  { id: "about", label: "About Us" },
  { id: "hospital_associations", label: "Hospital Associations" },
  { id: "awards", label: "Awards & Certificates" },
  { id: "events", label: "Upcoming Event" },
  { id: "testimonials", label: "Patient Testimonials" },
];
const DocTabs = ({ doctorData }) => {
  const [activeTab, setActiveTab] = useState('about');
  const renderedConent = () => {
    switch (activeTab) {
      case "about": return <AboutContent doctorData={doctorData} />;
      case "specialties": return <SpecialtiesTabContent doctorData={doctorData} />;
      case "awards": return <AwardTabConent doctorData={doctorData} />;
      case "events": return <UpcommingEventContent doctorData={doctorData} />;
      case "testimonials": return <PatientTestimonial doctorData={doctorData} />;
      case "hospital_associations":
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Work Experience</h4>
            {doctorData?.work_experience?.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/1b856e809c7235f840a5c224f76e47c868c95e60?width=96"
                  alt="hospital"
                  style={{ width: "70px", height: "70px", marginRight: "12px" }}
                />
                <div>
                  <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                    {item.hospital_name}
                  </span>
                  <br />
                  <span style={{ fontSize: "14px" }}>
                    {item.designation} <br></br>(
                    {new Date(item.from_year).toLocaleDateString()} -{" "}
                    {new Date(item.to_year).toLocaleDateString()})
                  </span>
                </div>
              </div>
            ))}

          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='container md:pt-12 pt-8'>
      <div>
        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === tab.id
                ? 'bg-webprimary text-white shadow-lg scale-105'
                : 'bg-slate-300 text-slate-700 hover:bg-slate-400 hover:shadow-md'
                }`}
            >
              {tab.label}

            </button>
          ))}
        </div>
        <div className='mt-8 md:mt-10'>
          {renderedConent()}
        </div>
      </div>
    </div>
  )
}

export default DocTabs;
