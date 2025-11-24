// PastMedicinesForCurrentProblem.jsx
import React, { useEffect, useState, useRef } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  Dialog,
  CircularProgress,
} from "@mui/material";
import { Plus, Edit } from "lucide-react";
import Swal from "sweetalert2";
import {
  __postApiData,
  __putApiData,
  __getApiData,
} from "@utils/api";
import UniqueLoader from "../../../common/UniqueLoader";
import { customMenuProps } from "@utils/CustomMenuProps";

const PastMedicinesForCurrentProblem = ({
  patientId,
  selected_case_file,
  case_file_data,
  onRefresh,
}) => {
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const doctordetails = (() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  })();

  const [medical_history, setmedical_history] = useState({
    MedicinesPrescribed: {
      Medicines: [{ MedicineName: "", Dosage: "", DurationInDays: "" }],
      RecoveryCycle: { Value: "", Unit: "" },
      PrescriptionUrls: [],
    },
  });

  // modal states
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [showEdit, setShowEdit] = useState(false);
  const handleCloseEdit = () => {
    setShowEdit(false);
    setmedical_history({
      MedicinesPrescribed: {
        Medicines: [{ MedicineName: "", Dosage: "", DurationInDays: "" }],
        RecoveryCycle: { Value: "", Unit: "" },
        PrescriptionUrls: [],
      },
    });
    setPreviewImage(null);
  };

  // lists
  const [all_salt_master, setall_salt_master] = useState([]);
  const [all_dosage_type, setall_dosage_type] = useState([]);
  const [all_unit_list, setall_unit_list] = useState([]);

  const [image_loading, setimage_loading] = useState(false);
  const [isloading, setisloading] = useState(false);

  // patient history for fallback when case_file_data empty
  const [patient_all_current_medicine, setpatient_all_current_medicine] =
    useState([]);

  // preview modal for images
  const [previewImage, setPreviewImage] = useState(null);

  // -------------------- helper handlers --------------------
  const handleMedicineChange = (index, field, value) => {
    setmedical_history((prev) => {
      const medicines = prev.MedicinesPrescribed.Medicines.map((m, i) =>
        i === index ? { ...m, [field]: value } : m
      );
      return {
        ...prev,
        MedicinesPrescribed: {
          ...prev.MedicinesPrescribed,
          Medicines: medicines,
        },
      };
    });
  };

  const handleMedicinePrescribedChange = (field, value, subField = null) => {
    setmedical_history((prev) => {
      const updated = { ...prev.MedicinesPrescribed };
      if (subField) {
        updated[field] = { ...updated[field], [subField]: value };
      } else {
        updated[field] = value;
      }
      return { ...prev, MedicinesPrescribed: updated };
    });
  };

  const handleAddMoreClinicalMedicines = () => {
    setmedical_history((prev) => ({
      ...prev,
      MedicinesPrescribed: {
        ...prev.MedicinesPrescribed,
        Medicines: [
          ...prev.MedicinesPrescribed.Medicines,
          { MedicineName: "", Dosage: "", DurationInDays: "" },
        ],
      },
    }));
  };

  // -------------------- image upload (multiple) --------------------
  const handlePrescriptionImagesChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setimage_loading(true);

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }

      // Many wrappers accept config as 3rd arg (axios style). Adjust if your wrapper differs.
      const resp = await __postApiData(
        "/api/v1/common/AddImage",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (
        resp?.response?.response_code === "200" &&
        Array.isArray(resp?.data) &&
        resp.data.length > 0
      ) {
        const uploadedUrls = resp.data
          .map((item) => item.full_URL)
          .filter(Boolean);
        setmedical_history((prev) => ({
          ...prev,
          MedicinesPrescribed: {
            ...prev.MedicinesPrescribed,
            PrescriptionUrls: [
              ...prev.MedicinesPrescribed.PrescriptionUrls,
              ...uploadedUrls,
            ],
          },
        }));
      } else {
        console.warn("Image upload returned unexpected response:", resp);
        Swal.fire({
          icon: "warning",
          title: "Upload failed",
          text: "Could not upload prescriptions. Please try again.",
        });
      }
    } catch (err) {
      console.error("Prescription upload error:", err);
      Swal.fire({
        icon: "error",
        title: "Upload error",
        text: err?.message || "Something went wrong during upload",
      });
    } finally {
      if (isMountedRef.current) setimage_loading(false);
    }
  };

  // -------------------- lookup list fetchers --------------------
  const getall_salt_master = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList/", {
        lookupcodes: ["pharmaceutical_salt_master"],
      });
      if (resp?.response?.response_code === "200" && Array.isArray(resp?.data)) {
        setall_salt_master(resp.data);
      } else {
        console.warn("Lookup salt master returned unexpected response", resp);
      }
    } catch (err) {
      console.error("getall_salt_master error:", err);
    }
  };

  const getall_dosage_type = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList/", {
        lookupcodes: ["dosage_type"],
      });
      if (resp?.response?.response_code === "200" && Array.isArray(resp?.data)) {
        setall_dosage_type(resp.data);
      } else {
        console.warn("Lookup dosage returned unexpected response", resp);
      }
    } catch (err) {
      console.error("getall_dosage_type error:", err);
    }
  };

  const getall_unitlist = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList/", {
        lookupcodes: ["duration_unit_type"],
      });
      if (resp?.response?.response_code === "200" && Array.isArray(resp?.data)) {
        setall_unit_list(resp.data);
      } else {
        console.warn("Lookup unit list returned unexpected response", resp);
      }
    } catch (err) {
      console.error("getall_unitlist error:", err);
    }
  };

  useEffect(() => {
    getall_salt_master();
    getall_dosage_type();
    getall_unitlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------- get patient medical history --------------------
  const getall_patient_medical_history = async () => {
    if (!patientId) return;
    try {
      // avoid trailing slash before query
      const resp = await __getApiData(
        `/api/v1/admin/medical-history?PatientId=${patientId}&Status=Past`
      );

      const list = resp?.data?.list || [];

      const matchedItem = list.find(
        (item) => item?.CaseFileId?._id === selected_case_file
      );

      let formatted = [];

      if (matchedItem) {
        formatted = [
          {
            caseFileId: matchedItem.CaseFileId,
            treatmentType: matchedItem.CaseFileId.TreatmentType,
            current_medicines: matchedItem.MedicinesPrescribed || [],
          },
        ];
      } else {
        formatted = list.map((item) => ({
          caseFileId: item.CaseFileId,
          treatmentType: item.CaseFileId?.TreatmentType,
          current_medicines: item.MedicinesPrescribed || [],
        }));
      }

      if (isMountedRef.current) setpatient_all_current_medicine(formatted);
    } catch (err) {
      console.error("getall_patient_medical_history error:", err);
    }
  };

  useEffect(() => {
    getall_patient_medical_history();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, selected_case_file]);

  // -------------------- open edit modal and populate --------------------
  const handleShowEdit = () => {
    // pick first available current_medicines
    const source =
      patient_all_current_medicine && patient_all_current_medicine.length > 0
        ? patient_all_current_medicine[0].current_medicines
        : null;

    if (source?.Medicines) {
      const normalizedMedicines = source.Medicines.map(
        ({ MedicineName, Dosage, DurationInDays }) => ({
          MedicineName: MedicineName?._id || MedicineName || "",
          Dosage: Dosage?._id || Dosage || "",
          DurationInDays: DurationInDays || "",
        })
      );

      const PrescriptionUrls = source?.PrescriptionUrls || [];

      const RecoveryCycle = source?.RecoveryCycle || { Value: "", Unit: "" };

      setmedical_history((prev) => ({
        ...prev,
        MedicinesPrescribed: {
          ...prev.MedicinesPrescribed,
          Medicines: normalizedMedicines.length
            ? normalizedMedicines
            : [{ MedicineName: "", Dosage: "", DurationInDays: "" }],
          PrescriptionUrls,
          RecoveryCycle: {
            Value: RecoveryCycle.Value || "",
            Unit: RecoveryCycle.Unit?._id || RecoveryCycle.Unit || "",
          },
        },
      }));
    }

    setShowEdit(true);
  };

  // -------------------- normalize medicines helper --------------------
  const normalizeMedicinesForApi = (medicines = []) =>
    medicines.map((m) => ({
      MedicineName: m.MedicineName?._id || m.MedicineName || m, // fallback if string
      Dosage: m.Dosage?._id || m.Dosage || "",
      DurationInDays: m.DurationInDays || "",
    }));

  // -------------------- save medicine --------------------
  const save_medicine = async () => {
    setisloading(true);
    try {
      const normalizedMedicines = normalizeMedicinesForApi(
        medical_history.MedicinesPrescribed.Medicines
      );

      const payload = {
        CaseFileId: selected_case_file,
        CreatedBy: doctordetails?._id,
        MedicinesPrescribed: {
          ...medical_history.MedicinesPrescribed,
          Medicines: normalizedMedicines,
        },
      };

      const resp = await __postApiData(
        `/api/v1/admin/medical-history/medicines-prescribed/add`,
        payload
      );

      const response_code = resp?.response?.response_code;
      const response_message = resp?.response?.response_message;

      if (response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Details Added",
          text: "Patient Details Added Successfully...",
          showConfirmButton: true,
        }).then(() => {
          if (typeof onRefresh === "function") onRefresh();
          handleClose();
        });
      } else if (response_code === "400") {
        Swal.fire({
          icon: "error",
          title: response_message?.errorType || "Error",
          text: response_message?.error || "Validation error",
          showConfirmButton: true,
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Unexpected response",
          text: (resp?.response?.response_message) || "Something went wrong. Please try again.",
          showConfirmButton: true,
        });
      }
    } catch (error) {
      console.error("save_medicine error:", error);
      Swal.fire({
        icon: "error",
        title: "Request failed",
        text: error?.message || "Something went wrong",
        showConfirmButton: true,
      });
    } finally {
      if (isMountedRef.current) setisloading(false);
    }
  };

  // -------------------- update medicine --------------------
  const update_medicine = async () => {
    setisloading(true);
    try {
      const normalizedMedicines = normalizeMedicinesForApi(
        medical_history.MedicinesPrescribed.Medicines
      );

      const payload = {
        CaseFileId: selected_case_file,
        UpdatedBy: doctordetails?._id,
        MedicinesPrescribed: {
          ...medical_history.MedicinesPrescribed,
          Medicines: normalizedMedicines,
        },
      };

      const resp = await __putApiData(
        `/api/v1/admin/medical-history/medicines-prescribed/edit`,
        payload
      );

      const response_code = resp?.response?.response_code;
      const response_message = resp?.response?.response_message;

      if (response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Details Updated",
          text: "Patient Medicines Details Updated Successfully...",
          showConfirmButton: true,
        }).then(() => {
          if (typeof onRefresh === "function") onRefresh();
          handleCloseEdit();
        });
      } else if (response_code === "400") {
        Swal.fire({
          icon: "error",
          title: response_message?.errorType || "Error",
          text: response_message?.error || "Validation error",
          showConfirmButton: true,
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "Unexpected response",
          text: resp?.response?.response_message || "Something went wrong. Please try again.",
          showConfirmButton: true,
        });
      }
    } catch (error) {
      console.error("update_medicine error:", error);
      Swal.fire({
        icon: "error",
        title: "Request failed",
        text: error?.message || "Something went wrong",
        showConfirmButton: true,
      });
    } finally {
      if (isMountedRef.current) setisloading(false);
    }
  };

  // -------------------- render --------------------
  return (
    <div className="space mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mt-2 border-b border-gray-200">
        <h3 className="text-xxl font-semibold text-gray-900">Past Medications</h3>
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center space-x-2 text-webprimary hover:text-blue-700 transition-colors"
            onClick={handleShow}
          >
            <span className="text-sm font-medium underline">Add</span>
            <Plus className="w-4 h-4" />
          </button>

          <button
            className="flex items-center space-x-2 text-webprimary hover:text-blue-700 transition-colors"
            onClick={handleShowEdit}
          >
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium underline">Edit</span>
          </button>
        </div>
      </div>

      {/* If a case file selected and has data show table */}
      <div
        className="overflow-x-auto"
        style={{ display: selected_case_file ? "block" : "none" }}
      >
        <div className="bg-webprimary text-white">
          <div className="grid grid-cols-3 gap-4 p-2 text-[20px]">
            <h3 className="table-header">Medicine/Salt Name</h3>
            <h3 className="table-header">Dosage</h3>
            <h3 className="table-header">Frequency</h3>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {case_file_data?.length > 0 && case_file_data[0]?.Status === "Past" &&
            case_file_data[0]?.MedicinesPrescribed?.Medicines?.map((item, index) => (
              <div
                key={index}
                className={`grid grid-cols-3 gap-4 p-4 ${index % 2 === 0 ? "bg-websecondary" : "bg-white"
                  }`}
              >
                <div className="text-sm text-gray-900 font-medium table-body">
                  {item?.MedicineName?.lookup_value || "—"}
                </div>
                <div className="text-sm text-gray-900 table-body">
                  {item?.Dosage?.lookup_value || ""}
                </div>

                <div className="text-sm text-gray-900 table-body">
                  {item?.DurationInDays || ""} Days
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Fallback: show patient_all_current_medicine if case_file_data empty */}
      {!case_file_data || case_file_data.length === 0
        ? patient_all_current_medicine?.map((caseFile, caseIndex) => (
          <div key={caseFile.caseFileId?._id || caseIndex} className="mb-6">
            <h3 className="text-xl font-bold mb-2">
              {caseFile.caseFileId?.TreatmentType} (Case File ID: {caseFile.caseFileId?._id})-
              {caseFile.caseFileId?.Date
                ? new Date(caseFile.caseFileId.Date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                : ""}
            </h3>

            <div className="bg-webprimary text-white">
              <div className="grid grid-cols-3 gap-4 p-2 text-[16px] font-semibold">
                <h3 className="table-header">Medicine/Salt Name</h3>
                <h3 className="table-header">Dosage</h3>
                <h3 className="table-header">Frequency</h3>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {caseFile?.current_medicines?.Medicines?.map((item, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-3 gap-4 p-4 ${idx % 2 === 0 ? "bg-websecondary" : "bg-white"
                    }`}
                >
                  <div className="text-sm text-gray-900 font-medium table-body">
                    {item?.MedicineName?.lookup_value || "—"}
                  </div>
                  <div className="text-sm text-gray-900 table-body">
                    {item?.Dosage?.lookup_value || ""}
                  </div>
                  <div className="text-sm text-gray-900 table-body">
                    {item?.DurationInDays || ""} Days
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
        : null}

      {/* ---------------- Add Dialog ---------------- */}
      <Dialog
        open={show}
        onClose={handleClose}
        fullWidth
        maxWidth={false}
        PaperProps={{
          sx: { width: "1000px", maxWidth: "1200px", padding: "20px" },
        }}
      >
        <div>
          <h2 className="mb-2 form-title">Add Medical History (Medicines)</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">
            <div className="col-span-2">
              <h5 className="form-title">Medicines Prescribed</h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                {medical_history.MedicinesPrescribed.Medicines.map((details, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2 col-span-2 border border-gray-300 rounded-lg p-2"
                  >
                    <FormControl fullWidth size="small">
                      <label className="form-label">Medicine Name </label>
                      <Select
                        labelId="content-type-label"
                        value={details.MedicineName}
                        onChange={(e) =>
                          handleMedicineChange(index, "MedicineName", e.target.value)
                        }
                        displayEmpty
                        MenuProps={customMenuProps}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <span style={{ color: "#9ca3af" }}>Medicine Name </span>;
                          }
                          return all_salt_master?.find((item) => item._id === selected)
                            ?.lookup_value;
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
                        labelId="content-type-label"
                        value={details.Dosage}
                        onChange={(e) => handleMedicineChange(index, "Dosage", e.target.value)}
                        displayEmpty
                        MenuProps={customMenuProps}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <span style={{ color: "#9ca3af" }}>Dosage </span>;
                          }
                          return all_dosage_type?.find((item) => item._id === selected)
                            ?.lookup_value;
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
                      <label className="form-label">Duration (Days)</label>
                      <TextField
                        type="text"
                        placeholder="Duration In Days"
                        name="DurationInDays"
                        size="small"
                        value={details.DurationInDays}
                        onChange={(e) =>
                          handleMedicineChange(index, "DurationInDays", e.target.value)
                        }
                      />
                    </FormControl>

                    <div className="flex justify-between mt-8 h-8">
                      <Button
                        style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                        onClick={handleAddMoreClinicalMedicines}
                      >
                        Add More
                      </Button>
                    </div>
                  </div>
                ))}

                <FormControl fullWidth size="small">
                  <label className="form-label">Recovery Cycle</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <TextField
                      type="number"
                      name="Value"
                      placeholder="Enter Number"
                      size="small"
                      value={medical_history.MedicinesPrescribed.RecoveryCycle.Value}
                      onChange={(e) =>
                        handleMedicinePrescribedChange("RecoveryCycle", e.target.value, "Value")
                      }
                      style={{ flex: 1 }}
                    />

                    <Select
                      labelId="content-type-label"
                      value={medical_history.MedicinesPrescribed.RecoveryCycle.Unit}
                      onChange={(e) =>
                        handleMedicinePrescribedChange("RecoveryCycle", e.target.value, "Unit")
                      }
                      displayEmpty
                      MenuProps={customMenuProps}
                      renderValue={(selected) => {
                        if (!selected) {
                          return <span style={{ color: "#9ca3af" }}>Unit </span>;
                        }
                        return all_unit_list?.find((item) => item._id === selected)
                          ?.lookup_value;
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
                  <label className="form-label">Upload Prescriptions</label>
                  <TextField
                    inputProps={{ multiple: true }}
                    type="file"
                    placeholder="Prescription Urls"
                    name="PrescriptionUrls"
                    size="small"
                    onChange={(e) => handlePrescriptionImagesChange(e)}
                  />
                </FormControl>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
              onClick={save_medicine}
            >
              Save
            </Button>
          </div>
        </div>
      </Dialog>

      {/* ---------------- Edit Dialog ---------------- */}
      <Dialog
        open={showEdit}
        onClose={handleCloseEdit}
        fullWidth
        maxWidth={false}
        PaperProps={{
          sx: { width: "1000px", maxWidth: "1200px", padding: "20px" },
        }}
      >
        <div>
          <h2 className="mb-2 form-title">Edit Medical History (Medicines)</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">
            <div className="col-span-2">
              <h5 className="form-title">Medicines Prescribed</h5>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
                {medical_history.MedicinesPrescribed.Medicines.map((details, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2 col-span-2 border border-gray-300 rounded-lg p-2"
                  >
                    <FormControl fullWidth size="small">
                      <label className="form-label">Medicine Name </label>
                      <Select
                        labelId="content-type-label"
                        value={details.MedicineName}
                        onChange={(e) =>
                          handleMedicineChange(index, "MedicineName", e.target.value)
                        }
                        displayEmpty
                        MenuProps={customMenuProps}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <span style={{ color: "#9ca3af" }}>Medicine Name </span>;
                          }
                          return all_salt_master?.find((item) => item._id === selected)
                            ?.lookup_value;
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
                        labelId="content-type-label"
                        value={details.Dosage}
                        onChange={(e) => handleMedicineChange(index, "Dosage", e.target.value)}
                        displayEmpty
                        MenuProps={customMenuProps}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <span style={{ color: "#9ca3af" }}>Dosage </span>;
                          }
                          return all_dosage_type?.find((item) => item._id === selected)
                            ?.lookup_value;
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
                      <label className="form-label">Duration (Days)</label>
                      <TextField
                        type="text"
                        placeholder="Duration In Days"
                        name="DurationInDays"
                        size="small"
                        value={details.DurationInDays}
                        onChange={(e) =>
                          handleMedicineChange(index, "DurationInDays", e.target.value)
                        }
                      />
                    </FormControl>

                    <div className="flex justify-between mt-8 h-8">
                      <Button
                        style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                        onClick={handleAddMoreClinicalMedicines}
                      >
                        Add More
                      </Button>
                    </div>
                  </div>
                ))}

                <FormControl fullWidth size="small">
                  <label className="form-label">Recovery Cycle</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <TextField
                      type="number"
                      name="Value"
                      placeholder="Enter Number"
                      size="small"
                      value={medical_history.MedicinesPrescribed.RecoveryCycle.Value}
                      onChange={(e) =>
                        handleMedicinePrescribedChange("RecoveryCycle", e.target.value, "Value")
                      }
                      style={{ flex: 1 }}
                    />

                    <Select
                      labelId="content-type-label"
                      value={medical_history.MedicinesPrescribed.RecoveryCycle.Unit}
                      onChange={(e) =>
                        handleMedicinePrescribedChange("RecoveryCycle", e.target.value, "Unit")
                      }
                      displayEmpty
                      MenuProps={customMenuProps}
                      renderValue={(selected) => {
                        if (!selected) {
                          return <span style={{ color: "#9ca3af" }}>Unit </span>;
                        }
                        return all_unit_list?.find((item) => item._id === selected)
                          ?.lookup_value;
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
                  <label className="form-label">Upload Prescriptions</label>
                  <TextField
                    inputProps={{ multiple: true }}
                    type="file"
                    placeholder="Prescription Urls"
                    name="PrescriptionUrls"
                    size="small"
                    onChange={(e) => handlePrescriptionImagesChange(e)}
                  />

                  {image_loading && (
                    <div className="mt-2">
                      <CircularProgress size={24} />
                    </div>
                  )}

                  {medical_history.MedicinesPrescribed.PrescriptionUrls?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {medical_history.MedicinesPrescribed.PrescriptionUrls.map(
                        (url, index) => (
                          <div key={index} className="relative w-24 h-24">
                            <img
                              src={url}
                              alt={`Prescription ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg border border-gray-300 cursor-pointer"
                              onClick={() => setPreviewImage(url)}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setmedical_history((prev) => ({
                                  ...prev,
                                  MedicinesPrescribed: {
                                    ...prev.MedicinesPrescribed,
                                    PrescriptionUrls:
                                      prev.MedicinesPrescribed.PrescriptionUrls.filter(
                                        (_, i) => i !== index
                                      ),
                                  },
                                }))
                              }
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs shadow-md hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </FormControl>

                {previewImage && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="relative bg-white rounded-lg p-4 max-w-3xl w-full">
                      <button
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
                      >
                        ✕
                      </button>
                      <img
                        src={previewImage}
                        alt="Full Prescription"
                        className="max-w-full max-h-[80vh] mx-auto rounded-lg object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                onClick={update_medicine}
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </Dialog>

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

export default PastMedicinesForCurrentProblem;
