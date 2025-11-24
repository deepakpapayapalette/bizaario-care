import React, { useEffect, useState, useRef } from "react";

import { MdKeyboardDoubleArrowUp } from "react-icons/md";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";

import { __getApiData } from "@utils/api";

import ChiefComplaintsForCurrentProblem from "./ChiefComplaintsForCurrentProblem";
import CurrentTherapyForCurrentProblem from "./CurrentTherapyForCurrentProblem";
import DiagnosticsInvestigationsForCurrentProblem from "./DiagnosticsInvestigationsForCurrentProblem";
import CurrentMedicinesForCurrentProblem from "./CurrentMedicinesForCurrentProblem";

const CurrentProblemMain = ({ patientId, selected_case_file }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [medicalHistoryId, setMedicalHistoryId] = useState("");
  const [caseFileData, setCaseFileData] = useState([]);

  const dropdownRef = useRef(null);

  const [refreshKeys, setRefreshKeys] = useState({
    complaint: 0,
    medicine: 0,
    therapy: 0,
    diagnostics: 0,
  });

  // 🔄 Re-render a specific child component
  const refreshComponent = (name) => {
    setRefreshKeys((prev) => ({ ...prev, [name]: prev[name] + 1 }));
  };

  // 📌 Fetch medical history
  const fetchMedicalHistory = async () => {
    try {
      const response = await __getApiData(
        `/api/v1/admin/medical-history/list?PatientId=${patientId}&Status=Ongoing`
      );

      const list = response?.data?.list || [];
      const matched = list.find(
        (item) => item?.CaseFileId?._id === selected_case_file
      );

      setMedicalHistoryId(matched?._id || "");
    } catch (error) {
      console.error("Medical History Error:", error);
    }
  };

  // 📌 Fetch case file data
  const fetchCaseFileDetails = async () => {
    try {
      const response = await __getApiData(
        `/api/v1/admin/medical-history/list?CaseFileId=${selected_case_file}`
      );

      setCaseFileData(response?.data?.list || []);
    } catch (error) {
      console.error("Case File Details Error:", error);
    }
  };

  useEffect(() => {
    fetchMedicalHistory();
    fetchCaseFileDetails();
  }, [selected_case_file]);

  // 📌 Close dropdown on outside click (optional future)
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        // close dropdown if added later
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="space">
      <div className="bg-[rgba(189,196,212,0.2)] p-4 rounded-lg border border-gray-200 "
      >

        {/* Header */}
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsCollapsed((prev) => !prev)}>
          <h2 className="text-xl font-semibold text-gray-900">Current Problem</h2>

          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isCollapsed ? (
              <MdKeyboardDoubleArrowDown size={24} />  // ⬅️ Expand icon
            ) : (
              <MdKeyboardDoubleArrowUp size={24} />     // ⬅️ Collapse icon
            )}
          </button>
        </div>

        {/* Collapsible Section */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${isCollapsed ? "max-h-0 opacity-0" : "max-h-[3000px] opacity-100"
            }`}
        >

          <div className="card-details">
            <ChiefComplaintsForCurrentProblem
              key={refreshKeys.complaint}
              patientId={patientId}
              selected_case_file={selected_case_file}
              case_file_data={caseFileData}
              onRefresh={() => refreshComponent("complaint")}
            />
          </div>
          <div className="card-details">
            <CurrentMedicinesForCurrentProblem
              key={refreshKeys.medicine}
              patientId={patientId}
              selected_case_file={selected_case_file}
              case_file_data={caseFileData}
              onRefresh={() => refreshComponent("medicine")}
            />
          </div>
          <div className="card-details">
            <CurrentTherapyForCurrentProblem
              key={refreshKeys.therapy}
              patientId={patientId}
              selected_case_file={selected_case_file}
              case_file_data={caseFileData}
              onRefresh={() => refreshComponent("therapy")}
            />
          </div>
          <div className="card-details">
            <DiagnosticsInvestigationsForCurrentProblem
              key={refreshKeys.diagnostics}
              patientId={patientId}
              selected_case_file={selected_case_file}
              case_file_data={caseFileData}
              onRefresh={() => refreshComponent("diagnostics")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentProblemMain;
