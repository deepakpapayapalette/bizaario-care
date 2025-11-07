import React from "react";

const CompletedConsultation = () => {
  const handleClose = () => {

    window.close();
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="relative bg-white rounded-xl shadow-xl p-8 w-[470px] max-w-full">

        {/* Close Button */}
        <button
          className="absolute top-5 right-6 text-gray-500 hover:text-gray-700 text-xl font-bold"
          aria-label="Close"
          onClick={handleClose}
        >
          ×
        </button>

        {/* Header */}
        <h1 className="text-2xl font-semibold text-center">
          Consultation Completed!
        </h1>
        <p className="text-center text-gray-600 text-sm mb-7">
          Thank you for attending your session with Dr. Dominic Stonehart
        </p>

        {/* Prescription Row */}
        <div className="mb-4 flex items-center">
          <span className="text-lg text-gray-900 font-medium mr-2">
            Prescription :
          </span>
          <a
            href="#"
            className="text-lg font-semibold text-webprimary hover:underline ml-1"
          >
            Download PDF
          </a>
        </div>

        {/* Next Follow-Up Row */}
        <div className="mb-3">
          <span className="text-lg text-gray-900 font-medium">Next Follow-Up Date</span>
        </div>

        {/* Book Follow-Up Button */}
        <div className="mb-7">
          <button className="bg-webprimary text-white font-semibold py-2 px-7 rounded shadow hover:bg-blue-800 text-base">
            Book Follow-Up
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-lg font-medium text-gray-700 mb-8">
          All details will send on your registered email Id
        </div>

        {/* Closed Button */}
        <div>
          <button
            onClick={handleClose}
            className="bg-webprimary text-white font-semibold py-2 px-7 rounded shadow hover:bg-blue-800 text-base w-[120px]">
            Closed
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletedConsultation;
