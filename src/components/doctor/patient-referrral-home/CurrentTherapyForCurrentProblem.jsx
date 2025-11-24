import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Plus, Edit } from "lucide-react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  Dialog,
} from "@mui/material";
import Swal from "sweetalert2";
import { __postApiData, __putApiData, __getApiData } from "@utils/api";
import UniqueLoader from "../../common/UniqueLoader";
import TherapyRow from "./TherapyRow";

/**
 * CurrentTherapyForCurrentProblem
 * - Keeps Add and Edit dialogs separate
 * - Uses TherapyRow (separate file) to avoid duplicated JSX
 *
 * Notes:
 * - Uses endpoints from your original component:
 *   - LookupList POST (therapy_type)
 *   - GET /api/v1/admin/medical-history/list?PatientId=${patientId}&Status=Ongoing
 *   - POST /api/v1/admin/medical-history/therapies/add-multiple
 *   - PUT  /api/v1/admin/medical-history/therapies/edit-multiple
 */

const CurrentTherapyForCurrentProblem = ({ patientId, selected_case_file, case_file_data, onRefresh }) => {
  const doctordetails = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  const emptyState = {
    Therapies: [
      {
        TherapyName: "",
        PatientResponse: "",
      },
    ],
  };

  const [medical_history, setmedical_history] = useState(emptyState);
  const [all_therapy_master, setall_therapy_master] = useState([]);
  const [patient_all_therapy, setpatient_all_therapy] = useState([]);
  const [isloading, setisloading] = useState(false);

  // Dialog flags
  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  // Load therapy master list
  const getall_therapy_master = useCallback(async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList/", { lookupcodes: "therapy_type" });
      setall_therapy_master(resp.data || []);
    } catch (err) {
      console.error("Error loading therapy master:", err);
    }
  }, []);

  useEffect(() => {
    getall_therapy_master();
  }, [getall_therapy_master]);

  // Load all patient medical history (ongoing)
  const getall_patient_medical_history = useCallback(async () => {
    try {
      const resp = await __getApiData(`/api/v1/admin/medical-history/list?PatientId=${patientId}&Status=Ongoing`);
      const list = resp?.data?.list || resp?.data?.list || resp?.data || [];
      // Format to keep caseFileId and Therapies
      const formatted = (list || []).map((item) => ({
        caseFileId: item.CaseFileId,
        treatmentType: item.CaseFileId?.TreatmentType,
        therapy: item.Therapies || [],
      }));
      setpatient_all_therapy(formatted);
    } catch (error) {
      console.error("get patient medical history error:", error);
    }
  }, [patientId]);

  useEffect(() => {
    if (patientId) getall_patient_medical_history();
  }, [getall_patient_medical_history, patientId]);

  // Handlers
  const handleTherapyChange = useCallback((index, field, value) => {
    setmedical_history((prev) => {
      const updated = { ...(prev || {}) };
      const therapies = Array.isArray(updated.Therapies) ? [...updated.Therapies] : [];
      const row = { ...(therapies[index] || {}) };
      row[field] = value;
      therapies[index] = row;
      return {
        ...updated,
        Therapies: therapies,
      };
    });
  }, []);

  const handleAddMoreClinicalTherapy = useCallback(() => {
    setmedical_history((prev) => ({
      ...(prev || {}),
      Therapies: [...(prev?.Therapies || []), { TherapyName: "", PatientResponse: "" }],
    }));
  }, []);

  const handleRemoveTherapy = useCallback((index) => {
    Swal.fire({
      title: "Remove therapy?",
      text: "This will remove the therapy row locally. To remove permanently, use update after editing.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      customClass: { confirmButton: "my-swal-button" },
    }).then((result) => {
      if (!result.isConfirmed) return;
      setmedical_history((prev) => {
        const therapies = [...(prev?.Therapies || [])];
        therapies.splice(index, 1);
        return { ...prev, Therapies: therapies };
      });
    });
  }, []);

  // Save (Add multiple)
  const save_therapy = useCallback(async () => {
    setisloading(true);
    try {
      // Determine CaseFileId from fetched patient_all_therapy (first ongoing case file)
      const caseFileId = patient_all_therapy?.[0]?.caseFileId?._id;
      const payload = {
        ...medical_history,
        CaseFileId: caseFileId,
        CreatedBy: doctordetails._id,
      };

      const resp = await __postApiData("/api/v1/admin/medical-history/therapies/add-multiple", payload);
      const { response_code, response_message } = resp.response || {};

      if (response_code === "200") {
        await Swal.fire({
          icon: "success",
          title: "Details Added",
          text: "Patient Details Added Successfully...",
          customClass: { confirmButton: "my-swal-button" },
        });
        onRefresh?.();
        setShow(false);
      } else if (response_code === "400") {
        Swal.fire({
          icon: "error",
          title: response_message?.errorType || "Error",
          text: response_message?.error || "Validation error",
          customClass: { confirmButton: "my-swal-button" },
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Unexpected response",
          text: "Something went wrong. Please try again.",
          customClass: { confirmButton: "my-swal-button" },
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Request failed",
        text: error?.message || "Something went wrong",
        customClass: { confirmButton: "my-swal-button" },
      });
    } finally {
      setisloading(false);
    }
  }, [medical_history, patient_all_therapy, doctordetails._id, onRefresh]);

  // Update (Edit multiple)
  const update_therapy = useCallback(async () => {
    setisloading(true);
    try {
      const caseFileId = patient_all_therapy?.[0]?.caseFileId?._id;
      const payload = {
        ...medical_history,
        CaseFileId: caseFileId,
        UpdatedBy: doctordetails._id,
      };

      const resp = await __putApiData("/api/v1/admin/medical-history/therapies/edit-multiple", payload);
      const { response_code, response_message } = resp.response || {};

      if (response_code === "200") {
        await Swal.fire({
          icon: "success",
          title: "Details Updated",
          text: "Patient Details Updated Successfully...",
          customClass: { confirmButton: "my-swal-button" },
        });
        onRefresh?.();
        setShowEdit(false);
      } else if (response_code === "400") {
        Swal.fire({
          icon: "error",
          title: response_message?.errorType || "Error",
          text: response_message?.error || "Validation error",
          customClass: { confirmButton: "my-swal-button" },
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Unexpected response",
          text: "Something went wrong. Please try again.",
          customClass: { confirmButton: "my-swal-button" },
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Request failed",
        text: error?.message || "Something went wrong",
        customClass: { confirmButton: "my-swal-button" },
      });
    } finally {
      setisloading(false);
    }
  }, [medical_history, patient_all_therapy, doctordetails._id, onRefresh]);

  // Show Edit - normalize server structure to simple ids/values
  const handleShowEdit = useCallback(() => {
    if (patient_all_therapy && patient_all_therapy.length > 0) {
      const normalized = (patient_all_therapy[0].therapy || []).map((t) => {
        // TherapyName might be object or string
        const therapyName = t?.TherapyName
          ? typeof t.TherapyName === "string"
            ? t.TherapyName
            : t.TherapyName._id
          : "";
        return {
          TherapyName: therapyName,
          PatientResponse: t?.PatientResponse || "",
        };
      });
      setmedical_history({ Therapies: normalized.length ? normalized : [{ TherapyName: "", PatientResponse: "" }] });
    } else {
      setmedical_history({ Therapies: [{ TherapyName: "", PatientResponse: "" }] });
    }
    setShowEdit(true);
  }, [patient_all_therapy]);

  // Remove handler for edit rows
  const handleRemoveFromEdit = useCallback((index) => {
    // Reuse handleRemoveTherapy behaviour
    handleRemoveTherapy(index);
  }, [handleRemoveTherapy]);

  // Open Add dialog handler - reset to empty single row
  const handleShowAdd = useCallback(() => {
    setmedical_history(emptyState);
    setShow(true);
  }, []);

  return (
    <div className="space">
      {/* Header */}
      <div className="flex items-center justify-between mt-4 border-b border-gray-200">
        <h3 className="text-xxl font-semibold text-gray-900">Current Therapy (ies)</h3>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-webprimary hover:text-blue-700 transition-colors">
            <span className="text-sm font-medium underline" onClick={handleShowAdd}>
              Add
            </span>
            <Plus className="w-4 h-4" />
          </button>
          <button className="flex items-center space-x-2 text-webprimary hover:text-blue-700 transition-colors">
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium underline" onClick={handleShowEdit}>
              Edit
            </span>
          </button>
        </div>
      </div>

      {/* List of ongoing case files + therapies */}
      {patient_all_therapy.map((caseFile, caseIndex) => (
        <div key={caseFile.caseFileId?._id || caseIndex} className="mb-6">
          <h3 className="text-xl font-bold mb-2">
            {caseFile.caseFileId?.TreatmentType} (Case File ID: {caseFile.caseFileId?._id}) -{" "}
            {caseFile.caseFileId?.Date
              ? new Date(caseFile.caseFileId.Date).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              : ""}
          </h3>

          <div className="bg-webprimary text-white">
            <div className="grid grid-cols-2 gap-4 p-2">
              <h3 className="table-header">Therapy Name</h3>
              <h3 className="table-header">Clinical Outcome/Patient's Response</h3>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {caseFile.therapy.map((item, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-2 gap-4 p-4 ${idx % 2 === 0 ? "bg-[#f2f3f6]" : "bg-white"}`}
              >
                <div className="text-sm text-gray-900 font-medium table-body">
                  {item?.TherapyName?.lookup_value || item?.TherapyName || "—"}
                </div>
                <div className="text-sm text-gray-900 table-body">{item?.PatientResponse || "—"}</div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ADD Dialog */}
      <Dialog
        open={show}
        onClose={() => setShow(false)}
        fullWidth
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "1000px",
            maxWidth: "1200px",
            padding: "20px",
          },
        }}
      >
        <div>
          <h2 className="text-2xl mb-3">Add Medical History (Therapy (ies))</h2>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">
              <div className="col-span-2">
                {medical_history?.Therapies?.map((details, index) => (
                  <TherapyRow
                    key={index}
                    details={details}
                    index={index}
                    allTherapyMaster={all_therapy_master}
                    onChange={handleTherapyChange}
                    onRemove={() => handleRemoveTherapy(index)}
                    showRemove={medical_history?.Therapies?.length > 1}
                  />
                ))}

                <div className="flex justify-between mt-2">
                  <Button
                    style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                    onClick={handleAddMoreClinicalTherapy}
                  >
                    Add More
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                onClick={save_therapy}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* EDIT Dialog */}
      <Dialog
        open={showEdit}
        onClose={() => {
          setShowEdit(false);
          setmedical_history(emptyState);
        }}
        fullWidth
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "1000px",
            maxWidth: "1200px",
            padding: "20px",
          },
        }}
      >
        <div>
          <h2 className="text-2xl mb-3">Edit Medical History (Therapy (ies))</h2>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">
              <div className="col-span-2">
                {medical_history?.Therapies?.map((details, index) => (
                  <TherapyRow
                    key={index}
                    details={details}
                    index={index}
                    allTherapyMaster={all_therapy_master}
                    onChange={handleTherapyChange}
                    onRemove={() => handleRemoveFromEdit(index)}
                    showRemove={medical_history?.Therapies?.length > 1}
                  />
                ))}

                <div className="flex justify-between mt-2">
                  <Button
                    style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                    onClick={handleAddMoreClinicalTherapy}
                  >
                    Add More
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                onClick={update_therapy}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* loader overlay */}
      {isloading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(255, 255, 255, 0.6)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UniqueLoader />
        </div>
      )}
    </div>
  );
};

export default CurrentTherapyForCurrentProblem;
