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
import { customMenuProps } from "@utils/CustomMenuProps";
import UniqueLoader from "../../../common/UniqueLoader";
import { MdOutlineFileDownload } from "react-icons/md";

/**
 * Optimized CurrentMedication component
 * - Keeps Add and Edit dialogs separate per your request
 * - Shared helpers and lookup loader abstracted
 */
const CurrentMedication = ({ patientId, selected_case_file, case_file_data, onRefresh }) => {
  const doctordetails = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  const emptyMedicationState = {
    CurrentMedications: {
      Medicines: [{ MedicineName: "", Dosage: "", Duration: "" }],
      RecoveryCycle: { Value: "", Unit: "" },
      PrescriptionUrls: [],
    },
  };

  const [current_medications, setcurrent_medications] = useState(emptyMedicationState);

  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [isloading, setisloading] = useState(false);
  const [all_salt_master, setall_salt_master] = useState([]);
  const [all_dosage_type, setall_dosage_type] = useState([]);
  const [all_unit_list, setall_unit_list] = useState([]);

  const [allcurrent_medicine_data, setallcurrent_medicine_data] = useState([]);
  const [allcurrent_medications, setallcurrent_medications] = useState([]);

  // Generic lookup loader - accepts comma-separated lookup codes or array
  const loadLookupLists = useCallback(async (codes) => {
    if (!codes) return [];
    const lookupcodes = Array.isArray(codes) ? codes.join(",") : codes;
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList/", { lookupcodes });
      return resp?.data || [];
    } catch (err) {
      console.error("Lookup list load error:", err);
      return [];
    }
  }, []);

  // load all required lookups once
  useEffect(() => {
    let mounted = true;
    (async () => {
      const [saltMaster, dosageType, unitList] = await Promise.all([
        loadLookupLists("pharmaceutical_salt_master"),
        loadLookupLists("dosage_type"),
        loadLookupLists("duration_unit_type"),
      ]);
      if (!mounted) return;
      setall_salt_master(saltMaster);
      setall_dosage_type(dosageType);
      setall_unit_list(unitList);
    })();
    return () => {
      mounted = false;
    };
  }, [loadLookupLists]);

  // get patient current meds
  const getall_patient_current_medications = useCallback(async () => {
    try {
      const resp = await __getApiData(`/api/v1/admin/patient/current-medications/list?PatientId=${patientId}`);
      const data = resp?.data?.data || {};
      setallcurrent_medications(data.Medicines || []);
      setallcurrent_medicine_data(data);
    } catch (error) {
      console.error("get patient current meds error:", error);
    }
  }, [patientId]);

  useEffect(() => {
    if (!patientId) return;
    getall_patient_current_medications();
  }, [getall_patient_current_medications, patientId]);

  // helpers
  const getLookupLabel = useCallback((list, idOrObj) => {
    if (!idOrObj) return null;
    // accept either { _id, lookup_value } or id string
    const id = typeof idOrObj === "object" ? idOrObj._id : idOrObj;
    return list?.find((i) => i._id === id)?.lookup_value || null;
  }, []);

  // ---------- state handlers ----------
  const handleMedicineChange = useCallback((index, field, value) => {
    setcurrent_medications((prev) => {
      const medicines = prev.CurrentMedications.Medicines ? [...prev.CurrentMedications.Medicines] : [];
      medicines[index] = {
        ...medicines[index],
        [field]: value,
      };
      return {
        ...prev,
        CurrentMedications: {
          ...prev.CurrentMedications,
          Medicines: medicines,
        },
      };
    });
  }, []);

  const handleMedicinePrescribedChange = useCallback((field, value, subField = null) => {
    setcurrent_medications((prev) => {
      const updated = { ...prev.CurrentMedications };
      if (subField) {
        updated[field] = {
          ...updated[field],
          [subField]: value,
        };
      } else {
        updated[field] = value;
      }
      return {
        ...prev,
        CurrentMedications: updated,
      };
    });
  }, []);

  const handleAddMoreClinicalMedicines = useCallback(() => {
    setcurrent_medications((prev) => ({
      ...prev,
      CurrentMedications: {
        ...prev.CurrentMedications,
        Medicines: [
          ...prev.CurrentMedications.Medicines,
          { MedicineName: "", Dosage: "", Duration: "" },
        ],
      },
    }));
  }, []);

  const handleRemoveMedicine = useCallback((index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This medication will be removed from the list.",
      icon: "warning",
      confirmButtonColor: "#52677D",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
      showCancelButton: true,
      customClass: { confirmButton: "my-swal-button" },
    }).then((result) => {
      if (result.isConfirmed) {
        setcurrent_medications((prev) => {
          const medicines = [...(prev.CurrentMedications.Medicines || [])];
          medicines.splice(index, 1);
          return {
            ...prev,
            CurrentMedications: {
              ...prev.CurrentMedications,
              Medicines: medicines,
            },
          };
        });
        Swal.fire({
          title: "Removed!",
          text: "Medication has been removed.",
          icon: "success",
          customClass: { confirmButton: "my-swal-button" },
        });
      }
    });
  }, []);

  // file upload for prescriptions (multiple)
  const handlePrescriptionImagesChange = useCallback(async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) formData.append("file", files[i]);

      const resp = await __postApiData("/api/v1/common/AddImage", formData);

      if (resp?.response?.response_code === "200" && Array.isArray(resp.data) && resp.data.length > 0) {
        const uploadedUrls = resp.data.map((it) => it.full_URL).filter(Boolean);
        setcurrent_medications((prev) => ({
          ...prev,
          CurrentMedications: {
            ...prev.CurrentMedications,
            PrescriptionUrls: [
              ...(prev.CurrentMedications.PrescriptionUrls || []),
              ...uploadedUrls,
            ],
          },
        }));
      } else {
        console.warn("Upload didn't return 200 or no data", resp);
      }
    } catch (error) {
      console.error("Prescription images upload error:", error);
    } finally {
      // reset file input if needed upstream (not handled here)
    }
  }, []);

  // download helper
  const handleDownload = useCallback(async (url, filename) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename || "prescription.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed:", err);
    }
  }, []);

  // Save medication (Add)
  const save_medication = useCallback(async () => {
    setisloading(true);
    try {
      const payload = {
        ...current_medications,
        PatientId: patientId,
        UpdatedBy: doctordetails._id,
      };
      const resp = await __postApiData("/api/v1/admin/patient/current-medications/add", payload);
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
  }, [current_medications, doctordetails._id, onRefresh, patientId]);

  // Update medication (Edit)
  const update_medication = useCallback(async () => {
    setisloading(true);
    try {
      const payload = {
        ...current_medications,
        PatientId: patientId,
        UpdatedBy: doctordetails._id,
      };
      const resp = await __postApiData("/api/v1/admin/patient/current-medications/edit", payload);
      const { response_code, response_message } = resp.response || {};

      if (response_code === "200") {
        await Swal.fire({
          icon: "success",
          title: "Details Updated",
          text: "Patient Current Medication Details Updated Successfully...",
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
  }, [current_medications, doctordetails._id, onRefresh, patientId]);

  // show edit handler - populate state with fetched data
  const handleShowEdit = useCallback(() => {
    // ensure we use freshest data
    setcurrent_medications((prev) => ({
      ...prev,
      CurrentMedications: allcurrent_medicine_data || prev.CurrentMedications,
    }));
    setShowEdit(true);
  }, [allcurrent_medicine_data]);

  // UI render helpers
  const renderMedicineRow = (details, index, isEdit = false) => {
    // details may have nested objects (from server) or raw ids depending on mode
    const medValue = details?.MedicineName?._id || details?.MedicineName || "";
    const dosageValue = details?.Dosage?._id || details?.Dosage || "";
    const durationValue = details?.Duration ?? "";

    return (
      <div
        key={index}
        className="grid grid-cols-1 sm:grid-cols-2 gap-2 col-span-2 border border-gray-300 rounded-lg p-2"
      >
        <FormControl fullWidth size="small">
          <label className="form-label">Medicine Name </label>
          <Select
            labelId={`medicine-name-${index}`}
            value={medValue}
            onChange={(e) => handleMedicineChange(index, "MedicineName", e.target.value)}
            displayEmpty
            MenuProps={customMenuProps}
            renderValue={(selected) => {
              if (!selected) return <span style={{ color: "#9ca3af" }}>Medicine Name </span>;
              return getLookupLabel(all_salt_master, selected);
            }}
          >
            <MenuItem value="">
              <em>Medicine Name </em>
            </MenuItem>
            {all_salt_master?.map((type) => (
              <MenuItem key={type._id} value={type._id}>
                {type.lookup_value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <label className="form-label">Dosage </label>
          <Select
            labelId={`dosage-${index}`}
            value={dosageValue}
            onChange={(e) => handleMedicineChange(index, "Dosage", e.target.value)}
            displayEmpty
            MenuProps={customMenuProps}
            renderValue={(selected) => {
              if (!selected) return <span style={{ color: "#9ca3af" }}>Dosage </span>;
              return getLookupLabel(all_dosage_type, selected);
            }}
          >
            <MenuItem value="">
              <em>Dosage </em>
            </MenuItem>
            {all_dosage_type?.map((type) => (
              <MenuItem key={type._id} value={type._id}>
                {type.lookup_value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <label className="form-label">Duration (Days) </label>
          <TextField
            type="text"
            placeholder="Duration In Days"
            name="Duration"
            size="small"
            value={durationValue}
            onChange={(e) => handleMedicineChange(index, "Duration", e.target.value)}
          />
        </FormControl>

        <div className="flex justify-between mt-8 h-8">
          <Button variant="outlined" color="error" onClick={() => handleRemoveMedicine(index)}>
            Remove
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mt-2  border-b border-gray-200">
        <h3 className="text-xxl font-semibold text-gray-900">Current Medications</h3>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-[var(--primary-color)] hover:text-blue-700 transition-colors">
            <span className="text-sm font-medium underline" onClick={() => { setcurrent_medications(emptyMedicationState); setShow(true); }}>
              Add
            </span>
            <Plus className="w-4 h-4" />
          </button>
          <button className="flex items-center space-x-2 text-[var(--primary-color)] hover:text-blue-700 transition-colors">
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium underline" onClick={handleShowEdit}>
              Edit
            </span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {/* Table Header */}
        <div className="bg-webprimary text-white">
          <div className="grid grid-cols-4 gap-4 p-2 text-[16px] font-semibold">
            <h3 className="table-header">Medicine/Salt Name</h3>
            <h3 className="table-header">Dosage</h3>
            <h3 className="table-header">Frequency / Duration</h3>
            <h3 className="table-header">Action</h3>
          </div>
        </div>

        {/* Table Body */}
        {(allcurrent_medicine_data?.Medicines || []).map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-4 gap-4 p-4 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
          >
            <div className="text-sm text-gray-900 font-medium table-body">
              {item?.MedicineName?.lookup_value || "—"}
            </div>

            <div className="text-sm text-gray-900 table-body">{item?.Dosage?.lookup_value || "—"}</div>

            <div className="text-sm text-gray-900 table-body">
              {item?.DurationInDays ? `${item.DurationInDays} Days` : "—"}
            </div>

            <div>
              {allcurrent_medicine_data?.PrescriptionUrls?.length > 0 ? (
                <button
                  onClick={() => handleDownload(allcurrent_medicine_data.PrescriptionUrls[0], "prescription.png")}
                  className="theme-btn-ouline flex justify-between items-center"
                >
                  <MdOutlineFileDownload className="inline me-1" size={20} />
                  Download Prescription
                </button>
              ) : (
                <span className="text-gray-400 italic">No Prescription</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div
        className="p-4 bg-gray-50 border-t border-gray-200"
        style={{ display: selected_case_file ? "block" : "none" }}
      >
        <p className="text-xs text-gray-600">
          1. Added By Dr Gaurav Pande (Cardiology) (Regards M1234), (Contact 8373915529, Date/ Time 20 Sep 2025,
          11:57 AM IST, Noida
        </p>
      </div>

      {/* ---------------- ADD DIALOG ---------------- */}
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
          <h2 className="mb-3">Add Current Medications</h2>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">
              <div className="col-span-2">
                <h5 className="form-title">Medicines Prescribed </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 ">
                  {current_medications?.CurrentMedications?.Medicines?.map((details, index) =>
                    renderMedicineRow(details, index, false)
                  )}

                  <FormControl fullWidth size="small">
                    <label className="form-label">Recovery Cycle</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <TextField
                        type="number"
                        name="Value"
                        placeholder="Enter Number"
                        size="small"
                        value={current_medications.CurrentMedications.RecoveryCycle.Value}
                        onChange={(e) => handleMedicinePrescribedChange("RecoveryCycle", e.target.value, "Value")}
                        style={{ flex: 1 }}
                      />

                      <Select
                        labelId="content-type-recovery-unit"
                        name="Unit"
                        value={current_medications.CurrentMedications.RecoveryCycle.Unit}
                        onChange={(e) => handleMedicinePrescribedChange("RecoveryCycle", e.target.value, "Unit")}
                        displayEmpty
                        MenuProps={customMenuProps}
                        renderValue={(selected) => {
                          if (!selected) return <span style={{ color: "#9ca3af" }}>Unit </span>;
                          return getLookupLabel(all_unit_list, selected);
                        }}
                      >
                        <MenuItem value="">
                          <em>Unit </em>
                        </MenuItem>
                        {all_unit_list?.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.lookup_value}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <label className="form-label">Upload Prescriptions  </label>
                    <TextField
                      inputProps={{ multiple: true }}
                      type="file"
                      placeholder="Prescription Urls"
                      name="PrescriptionUrls"
                      size="small"
                      onChange={handlePrescriptionImagesChange}
                    />
                  </FormControl>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                onClick={handleAddMoreClinicalMedicines}
              >
                Add More
              </Button>

              <Button
                style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                onClick={save_medication}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Dialog>

      {/* ---------------- EDIT DIALOG ---------------- */}
      <Dialog
        open={showEdit}
        onClose={() => setShowEdit(false)}
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
          <h2 className="mb-3">Edit Current Medications</h2>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">
              <div className="col-span-2">
                <h5 className="form-title">Medicines Prescribed </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 ">
                  {current_medications?.CurrentMedications?.Medicines?.map((details, index) =>
                    renderMedicineRow(details, index, true)
                  )}

                  <FormControl fullWidth size="small">
                    <label className="form-label">Recovery Cycle</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <TextField
                        type="number"
                        name="Value"
                        placeholder="Enter Number"
                        size="small"
                        value={current_medications.CurrentMedications.RecoveryCycle.Value}
                        onChange={(e) => handleMedicinePrescribedChange("RecoveryCycle", e.target.value, "Value")}
                        style={{ flex: 1 }}
                      />

                      <Select
                        labelId="content-type-recovery-unit-edit"
                        name="Unit"
                        value={
                          current_medications?.CurrentMedications?.RecoveryCycle?.Unit?._id ||
                          current_medications?.CurrentMedications?.RecoveryCycle?.Unit ||
                          ""
                        }
                        onChange={(e) => handleMedicinePrescribedChange("RecoveryCycle", e.target.value, "Unit")}
                        displayEmpty
                        MenuProps={customMenuProps}
                        renderValue={(selected) => {
                          if (!selected) return <span style={{ color: "#9ca3af" }}>Unit </span>;
                          return getLookupLabel(all_unit_list, selected);
                        }}
                      >
                        <MenuItem value="">
                          <em>Unit </em>
                        </MenuItem>
                        {all_unit_list?.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.lookup_value}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <label className="form-label">Upload Prescriptions  </label>
                    <TextField
                      inputProps={{ multiple: true }}
                      type="file"
                      placeholder="Prescription Urls"
                      name="PrescriptionUrls"
                      size="small"
                      onChange={handlePrescriptionImagesChange}
                    />
                  </FormControl>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button
                style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                onClick={handleAddMoreClinicalMedicines}
              >
                Add More
              </Button>

              <Button
                style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                onClick={update_medication}
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

export default CurrentMedication;
