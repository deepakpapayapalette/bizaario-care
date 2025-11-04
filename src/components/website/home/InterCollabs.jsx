
import React, { useState } from 'react';
import doctorIcon1 from '../../../assets/images/website/home/doc-icon1.png';
import doctorIcon2 from '../../../assets/images/website/home/doc-icon2.png';
import doctorIcon3 from '../../../assets/images/website/home/doc-icon3.png';
const InterCollabs = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const renderContent = () => {
    switch (activeTab) {
      case 'tab1': return <InterCollabsUi />
      case 'tab2': return <InterCollabsUi />
        return null;
    }
  };

  return (
    <>
      <section className="">
        <div className="container space-top">
          <div className="mb-8">
            <h2
              className="font-semibold text-black text-3xl leading-normal mb-2"
            >
              International Collaborations
            </h2>
            <p
              className="mb-0 text-[#52677D] text-base font-normal leading-normal"
            >
              Learn from leading doctors and specialists through focused,
              digestible video content.
            </p>
          </div>
          <div className="my-4 flex w-[280px] gap-2">
            <button
              className={`flex-1  border-gray-300 border-2 py-3 rounded-lg transition ${activeTab === "tab1"
                ? "bg-webprimary  text-white "
                : " text-para  bg-white"
                }`}
              onClick={() => setActiveTab("tab1")}
            >
              India
            </button>
            <button
              className={`flex-1  border-gray-300 transition border-2 py-3 rounded-lg ${activeTab === "tab2"
                ? "bg-webprimary  text-white "
                : "  text-para bg-white"
                }`}
              onClick={() => setActiveTab("tab2")}
            >
              Ethiopia
            </button>
          </div>
          <div>{renderContent()}</div>
        </div>
      </section>


    </>
  )
}

export default InterCollabs;

export function InterCollabsUi() {
  return (
    <>
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Doctors */}
          <div className="bg-[#fea500] rounded-xl p-6 text-white flex flex-col shadow-md">
            <div>
              <div className="mb-1 text-3xl md:text-4xl  font-medium">Doctors</div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-2xl">20k</h3>
                </div>
                <div className="w-20 h-20 flex items-center justify-center">
                  <img src={doctorIcon1} alt="doctorIcon1" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </div>
          {/* Medical Associations */}
          <div className="bg-[#1d8a8f] rounded-xl p-6 text-white flex flex-col shadow-md">
            <div>
              <div className="mb-1 text-3xl md:text-4xl  font-medium">Medical Associations</div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-2xl">20k</h3>
                </div>
                <div className="w-20 h-20 flex items-center justify-center">
                  <img src={doctorIcon2} alt="doctorIcon2" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </div>
          {/* Partner Hospitals */}
          <div className="bg-[#47b34e] rounded-xl p-6 text-white flex flex-col shadow-md">
            <div>
              <div className="mb-1 text-3xl md:text-4xl  font-medium">Partner Hospitals</div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-2xl">20k</h3>
                </div>
                <div className="w-20 h-20 flex items-center justify-center">
                  <img src={doctorIcon3} alt="doctorIcon3" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>)

}
