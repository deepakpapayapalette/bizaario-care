import React, { useState } from 'react'
import AboutContent from './tab-content/AboutTabContent';
import SpecialtiesTabContent from './tab-content/SpecialtiesTabContent';
import DoctorsTabContent from './tab-content/DoctorsTabContent';
import UpcommingEventContent from './tab-content/UpcommingEventContent';
import PatientTestimonial from './tab-content/PatientTestimonial';
import AwardTabConent from './tab-content/AwardTabConent';



const tabs = [
  { id: 'about', label: 'About Us' },
  { id: 'specialties', label: 'Medical Specialties' },
  { id: 'doctors', label: 'Star Doctors' },
  { id: 'awards', label: 'Awards & Certificates' },
  { id: 'events', label: 'Upcoming Event' },
  { id: 'testimonials', label: 'Patient Testimonials' }
];

const HospitalTabs = ({ hospitalData }) => {
  const [activeTab, setActiveTab] = useState('about');

  const renderedConent = () => {
    switch (activeTab) {
      case 'about':
        return <AboutContent hospitalData={hospitalData} />;
      case 'specialties':
        return <><SpecialtiesTabContent hospitalData={hospitalData} /></>;
      case 'doctors':
        return <><DoctorsTabContent hospitalData={hospitalData} /></>;
      case 'awards':
        return <><AwardTabConent hospitalData={hospitalData} /></>;
      case 'events':
        return <UpcommingEventContent hospitalData={hospitalData} />;
      case 'testimonials':
        return <PatientTestimonial hospitalData={hospitalData} />;
      default:
        return null;
    }
  };
  return (
    <>
      <div className="space-top container">
        <div className="">
          <div className="flex flex-wrap gap-3 mb-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === tab.id
                  ? 'bg-webprimary hover:bg-webprimary/[0.85] text-white shadow-lg scale-105'
                  : 'bg-slate-300 text-slate-700 hover:bg-slate-400 hover:shadow-md'
                  }`}
              >
                {tab.label}

              </button>
            ))}
          </div>

          <div>
            {renderedConent()}
          </div>
        </div>
      </div>

    </>
  )
}

export default HospitalTabs
