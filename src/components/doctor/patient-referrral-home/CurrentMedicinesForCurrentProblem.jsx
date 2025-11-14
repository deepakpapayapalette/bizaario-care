
import React from 'react';
import { Plus, Edit } from 'lucide-react';
import { useEffect, useState } from 'react'
import { TextField, Select, MenuItem, FormControl, Button, CircularProgress } from '@mui/material';
import api from '../../../../../api'
import Swal from 'sweetalert2';
import UniqueLoader from '../../../../loader';
import { customMenuProps } from '../../../../../utils/mui_select_scroll_bar';
import { Modal, } from 'react-bootstrap';
import { __postApiData } from "../../../../../utils/api";

const CurrentMedicinesForCurrentProblem = ({ patientId, selected_case_file, case_file_data, onRefresh }) => {

  const doctordetails = JSON.parse(localStorage.getItem("user"))

  const [medical_history, setmedical_history] = useState({
    MedicinesPrescribed: {
      Medicines: [{ MedicineName: "", Dosage: "", DurationInDays: "" }],
      RecoveryCycle: { Value: "", Unit: "" },
      PrescriptionUrls: [],
    }
  });


  //========================== modal open or close start==========================================

  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  //=========================== modal open or close end===============================================
  // ===============================onchange events for ClinicalDiagnoses start============================


  const handleMedicineChange = (index, field, value) => {
    setmedical_history(prev => {
      const updatedMedicines = [...prev.MedicinesPrescribed.Medicines];
      updatedMedicines[index] = {
        ...updatedMedicines[index],
        [field]: value
      };

      return {
        ...prev,
        MedicinesPrescribed: {
          ...prev.MedicinesPrescribed,
          Medicines: updatedMedicines
        }
      };
    });
  };

  const handleMedicinePrescribedChange = (field, value, subField = null) => {
    setmedical_history(prev => {
      const updated = { ...prev.MedicinesPrescribed };

      if (subField) {
        updated[field] = {
          ...updated[field],
          [subField]: value
        };
      } else {
        updated[field] = value;
      }

      return {
        ...prev,
        MedicinesPrescribed: updated
      };
    });
  };

  //============================== handle multiple image upload==================================

  const [image_loading, setimage_loading] = useState(false)

  const handlePrescriptionImagesChange = async (e) => {
    setimage_loading(true)
    const files = e.target.files; // multiple files selected
    if (!files || files.length === 0) return;

    try {
      // Create FormData for all files
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]);
      }

      const resp = await api.post("api/v1/common/AddImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });



      // ✅ Extract URLs from response
      if (
        resp.data?.response?.response_code === "200" &&
        resp.data.data?.length > 0
      ) {
        // Map each uploaded file to its URL
        const uploadedUrls = resp.data.data.map((item) => item.full_URL);

        // ✅ Append these URLs to state
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
      }
    } catch (error) {
      console.error("Prescription images upload error:", error);
    }
    finally {
      setimage_loading(false)
    }
  };




  // ====================================get all medicine list ===================================

  const [all_salt_master, setall_salt_master] = useState([])
  const getall_salt_master = async () => {
    try {
      const resp = await api.post('api/v1/admin/LookupList/', { lookupcodes: "pharmaceutical_salt_master" })


      setall_salt_master(resp.data.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getall_salt_master()

  }, [])

  //================================== get dosage list============================================

  const [all_dosage_type, setall_dosage_type] = useState([])
  const getall_dosage_type = async () => {
    try {
      const resp = await api.post('api/v1/admin/LookupList/', { lookupcodes: "dosage_type" })


      setall_dosage_type(resp.data.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getall_dosage_type()

  }, [])

  //================================== get unit list============================================

  const [all_unit_list, setall_unit_list] = useState([])
  const getall_unitlist = async () => {
    try {
      const resp = await api.post('api/v1/admin/LookupList/', { lookupcodes: "duration_unit_type" })


      setall_unit_list(resp.data.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getall_unitlist()

  }, [])


  // =================================add more function============================================


  const handleAddMoreClinicalMedicines = () => {
    setmedical_history(prev => ({
      ...prev,
      MedicinesPrescribed: {
        ...prev.MedicinesPrescribed,
        Medicines: [
          ...prev.MedicinesPrescribed.Medicines,
          { MedicineName: "", Dosage: "", DurationInDays: "" }
        ]
      }
    }));
  };

  const [isloading, setisloading] = useState(false)

  const save_medicine = async () => {
    setisloading(true);
    try {
      const payload =
      {
        ...medical_history,
        CaseFileId: patient_all_current_medicine[0]?.caseFileId._id,
        CreatedBy: doctordetails._id
      }
      const resp = await api.post(
        `api/v1/admin/medical-history/medicines-prescribed/add`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );



      const { response_code, response_message } = resp.data.response;

      if (response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Details Added",
          text: "Patient Details Added Successfully...",
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        }).then(() => {
          // window.location.reload();
          onRefresh()
        });
      } else if (response_code === "400") {
        // Show server validation error here
        Swal.fire({
          icon: "error",
          title: response_message.errorType || "Error",
          text: response_message.error,
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        });
      } else {
        // Optional: handle other response codes
        Swal.fire({
          icon: "warning",
          title: "Unexpected response",
          text: "Something went wrong. Please try again.",
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Request failed",
        text: error.message || "Something went wrong",
        showConfirmButton: true,
        customClass: { confirmButton: "my-swal-button" },
      });
    } finally {
      setisloading(false);
    }
  };


  // =======================get all data of current medicines====================================

  const [patient_all_current_medicine, setpatient_all_current_medicine] = useState([])

  const getall_patient_medical_history = async () => {
    try {
      //  setLoadingSpeciality(true);
      const resp = await api.get(`api/v1/admin/medical-history/list?PatientId=${patientId}&Status=Ongoing`);

      const formatted = resp.data.data.list.map(item => ({
        caseFileId: item.CaseFileId,
        treatmentType: item.CaseFileId.TreatmentType,
        current_medicines: item.MedicinesPrescribed

      }));
      setpatient_all_current_medicine(formatted);


    } catch (error) {
      console.error(error);
    } finally {
      //  setLoadingSpeciality(false);
    }
  };

  useEffect(() => {
    getall_patient_medical_history()
  }, [])



  //================================  edit========================================================

  const [previewImage, setPreviewImage] = useState(null);


  const [showEdit, setShowEdit] = useState(false)

  const handleCloseEdit = () => {
    setShowEdit(false);
    setmedical_history({
      MedicinesPrescribed: {
        Medicines: [{ MedicineName: "", Dosage: "", DurationInDays: "" }],
        RecoveryCycle: { Value: "", Unit: "" },
        PrescriptionUrls: [],
      },
    });
  };


  const handleShowEdit = () => {
    if (
      patient_all_current_medicine &&
      patient_all_current_medicine.length > 0 &&
      patient_all_current_medicine[0].current_medicines?.Medicines
    ) {
      const normalizedMedicines =
        patient_all_current_medicine[0].current_medicines.Medicines.map(
          ({ MedicineName, Dosage, DurationInDays }) => ({
            MedicineName: MedicineName?._id || MedicineName,
            Dosage: Dosage?._id || Dosage,
            DurationInDays,
          })
        );

      const PrescriptionUrls =
        patient_all_current_medicine[0].current_medicines?.PrescriptionUrls || [];

      const RecoveryCycle =
        patient_all_current_medicine[0].current_medicines?.RecoveryCycle || { Value: "", Unit: "" };

      setmedical_history((prev) => ({
        ...prev,
        MedicinesPrescribed: {
          ...prev.MedicinesPrescribed,
          Medicines: normalizedMedicines,
          PrescriptionUrls,
          RecoveryCycle: {
            Value: RecoveryCycle.Value,
            Unit: RecoveryCycle.Unit?._id || RecoveryCycle.Unit,
          },
        },
      }));
    }

    setShowEdit(true);
  };



  const update_medicine = async () => {
    setisloading(true);
    try {
      const payload =
      {
        ...medical_history,
        CaseFileId: patient_all_current_medicine[0]?.caseFileId._id,
        UpdatedBy: doctordetails._id
      }
      const resp = await api.put(
        `api/v1/admin/medical-history/medicines-prescribed/edit`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );



      const { response_code, response_message } = resp.data.response;

      if (response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Details Updated",
          text: "Patient Medicines Details Updated Successfully...",
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        }).then(() => {
          // window.location.reload();
          onRefresh()
        });
      } else if (response_code === "400") {
        // Show server validation error here
        Swal.fire({
          icon: "error",
          title: response_message.errorType || "Error",
          text: response_message.error,
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        });
      } else {
        // Optional: handle other response codes
        Swal.fire({
          icon: "warning",
          title: "Unexpected response",
          text: "Something went wrong. Please try again.",
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Request failed",
        text: error.message || "Something went wrong",
        showConfirmButton: true,
        customClass: { confirmButton: "my-swal-button" },
      });
    } finally {
      setisloading(false);
    }
  };




  return (
    <div className="space mt-4">


      {/* Header */}
      <div className="flex items-center justify-between mt-2  border-b border-gray-200">
        <h3 className="text-xxl font-semibold text-gray-900">
          Current Medicines
        </h3>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-[var(--primary-color)] hover:text-blue-700 transition-colors">
            <span className="text-sm font-medium underline" onClick={handleShow}>Add</span>
            <Plus className="w-4 h-4" />
          </button>
          <button className="flex items-center space-x-2 text-[var(--primary-color)] hover:text-blue-700 transition-colors">
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium underline" onClick={handleShowEdit}>Edit</span>
          </button>
        </div>
      </div>


      {/* <div className="overflow-x-auto" style={{display:selected_case_file?"block":"none"}}>

        <div className="bg-[var(--button-back-color)] text-white  " >
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
              key={item.id}
              className={`grid grid-cols-3 gap-4 p-4 ${index % 2 === 0 ? 'bg-[#f2f3f6]' : 'bg-white'
                }`}
            >
              <div className="text-sm text-gray-900 font-medium table-body">
                {item?.MedicineName?.lookup_value|| "—"}
              </div>
              <div className="text-sm text-gray-900 table-body">
                {item?.Dosage?.lookup_value ||  ""}
              </div>

              <div className="text-sm text-gray-900 table-body">
                {item?.DurationInDays ||  ""} Days
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Show patient_all_cheif_complaints section only if case_file_data is empty */}
      {
        // (!case_file_data || case_file_data.length === 0) &&
        patient_all_current_medicine?.map((caseFile, caseIndex) => (
          <div key={caseFile.caseFileId} className="mb-6">
            {/* Case File Header */}
            <h3 className="text-xl font-bold mb-2">
              {caseFile.caseFileId.TreatmentType} (Case File ID: {caseFile.caseFileId._id})-
              {new Date(caseFile.caseFileId.Date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </h3>

            {/* Table Header */}
            <div className="bg-[var(--button-back-color)] text-white">
              <div className="grid grid-cols-3 gap-4 p-2 text-[16px] font-semibold">
                <h3 className="table-header">Medicine/Salt Name</h3>
                <h3 className="table-header">Dosage</h3>
                <h3 className="table-header">Frequency</h3>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {caseFile?.current_medicines?.Medicines?.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-3 gap-4 p-4 ${index % 2 === 0 ? "bg-[#f2f3f6]" : "bg-white"
                    }`}
                >
                  {/* Chief Complaints Symptoms */}


                  <div className="text-sm text-gray-900 font-medium table-body">
                    {item?.MedicineName?.lookup_value || "—"}
                  </div>

                  <div className="text-sm text-gray-900 table-body">
                    {item?.Dosage?.lookup_value || ""}
                  </div>

                  {/* Duration */}
                  <div className="text-sm text-gray-900  table-body">
                    {item?.DurationInDays || ""} Days
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))}

      {/* Footer Note */}
      {/* <div className="p-4 bg-gray-50 border-t border-gray-200" style={{display:selected_case_file?"block":"none"}}>
        <p className="text-xs text-gray-600">
          1. Added By Dr Gaurav Pande (Cardiology) (Regards M1234), (Contact 8373915529, Date/ Time 20 Sep 2025, 11:57 AM IST, Noida
        </p>
      </div> */}



      <Modal show={show} onHide={handleClose} centered size="lg">

        <Modal.Header closeButton>
          <Modal.Title className='form-title'>Add Medical History(Medicines) </Modal.Title>
        </Modal.Header>
        <Modal.Body>


          <div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">


              {/* ============================Medicines Prescribed ======================================= */}

              <div className='col-span-2'>
                <h5 className='form-title'>Medicines Prescribed </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 ">
                  {medical_history.MedicinesPrescribed.Medicines.map((details, index) => (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 col-span-2 border border-gray-300 rounded-lg p-2">
                      <FormControl fullWidth size="small">
                        <label className="form-label">Medicine Name </label>
                        <Select
                          labelId="content-type-label"
                          name="Nationality"
                          value={details.MedicineName}
                          onChange={(e) => handleMedicineChange(index, "MedicineName", e.target.value)}
                          displayEmpty
                          MenuProps={customMenuProps}
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: "#9ca3af" }}>Medicine Name </span>;
                            }
                            return all_salt_master?.find((item) => item._id === selected)?.lookup_value;
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
                          name="Nationality"
                          value={details.Dosage}
                          onChange={(e) => handleMedicineChange(index, "Dosage", e.target.value)}
                          displayEmpty
                          MenuProps={customMenuProps}
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: "#9ca3af" }}>Dosage </span>;
                            }
                            return all_dosage_type?.find((item) => item._id === selected)?.lookup_value;
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
                          type='text'
                          placeholder="Duration In Days"
                          name="DurationInDays"
                          size="small"
                          value={details.DurationInDays}
                          onChange={(e) => handleMedicineChange(index, "DurationInDays", e.target.value)}
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
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {/* Number input */}
                      <TextField
                        type="number"
                        name="Value"
                        placeholder="Enter Number"
                        size="small"
                        defaultValue={medical_history.MedicinesPrescribed.RecoveryCycle.Value}
                        onChange={(e) => handleMedicinePrescribedChange("RecoveryCycle", e.target.value, "Value")}
                        style={{ flex: 1 }}
                      />


                      <Select
                        labelId="content-type-label"
                        name="InvestigationCategory"
                        value={medical_history.MedicinesPrescribed.RecoveryCycle.Unit}
                        onChange={(e) => handleMedicinePrescribedChange("RecoveryCycle", e.target.value, "Unit")}
                        displayEmpty
                        MenuProps={customMenuProps}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <span style={{ color: "#9ca3af" }}>Unit </span>;
                          }
                          return all_unit_list?.find((item) => item._id === selected)?.lookup_value;
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
                      type='file'
                      placeholder="Prescription Urls"
                      name="PrescriptionUrls"
                      size="small"
                      // value={medical_history.MedicinesPrescribed.PrescriptionUrls}
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

        </Modal.Body>


      </Modal>



      {/*====================================== edit modal ===========================================*/}


      <Modal show={showEdit} onHide={handleCloseEdit} centered size="lg">

        <Modal.Header closeButton>
          <Modal.Title className='form-title'>Edit Medical History(Medicines) </Modal.Title>
        </Modal.Header>
        <Modal.Body>


          <div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">


              {/* ============================Medicines Prescribed ======================================= */}

              <div className='col-span-2'>
                <h5 className='form-title'>Medicines Prescribed </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 ">
                  {medical_history.MedicinesPrescribed.Medicines.map((details, index) => (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 col-span-2 border border-gray-300 rounded-lg p-2">
                      <FormControl fullWidth size="small">
                        <label className="form-label">Medicine Name </label>
                        <Select
                          labelId="content-type-label"
                          name="Nationality"
                          value={details.MedicineName}
                          onChange={(e) => handleMedicineChange(index, "MedicineName", e.target.value)}
                          displayEmpty
                          MenuProps={customMenuProps}
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: "#9ca3af" }}>Medicine Name </span>;
                            }
                            return all_salt_master?.find((item) => item._id === selected)?.lookup_value;
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
                          name="Nationality"
                          value={details.Dosage}
                          onChange={(e) => handleMedicineChange(index, "Dosage", e.target.value)}
                          displayEmpty
                          MenuProps={customMenuProps}
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: "#9ca3af" }}>Dosage </span>;
                            }
                            return all_dosage_type?.find((item) => item._id === selected)?.lookup_value;
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
                          type='text'
                          placeholder="Duration In Days"
                          name="DurationInDays"
                          size="small"
                          value={details.DurationInDays}
                          onChange={(e) => handleMedicineChange(index, "DurationInDays", e.target.value)}
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
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {/* Number input */}
                      <TextField
                        type="number"
                        name="Value"
                        placeholder="Enter Number"
                        size="small"
                        defaultValue={medical_history.MedicinesPrescribed.RecoveryCycle.Value}
                        onChange={(e) => handleMedicinePrescribedChange("RecoveryCycle", e.target.value, "Value")}
                        style={{ flex: 1 }}
                      />


                      <Select
                        labelId="content-type-label"
                        name="InvestigationCategory"
                        value={medical_history.MedicinesPrescribed.RecoveryCycle.Unit}
                        onChange={(e) => handleMedicinePrescribedChange("RecoveryCycle", e.target.value, "Unit")}
                        displayEmpty
                        MenuProps={customMenuProps}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <span style={{ color: "#9ca3af" }}>Unit </span>;
                          }
                          return all_unit_list?.find((item) => item._id === selected)?.lookup_value;
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
                      type='file'
                      placeholder="Prescription Urls"
                      name="PrescriptionUrls"
                      size="small"
                      // value={medical_history.MedicinesPrescribed.PrescriptionUrls}
                      onChange={(e) => handlePrescriptionImagesChange(e)}
                    />

                    {image_loading && (
                      <div

                      >
                        <CircularProgress size={24} color="primary" />
                      </div>
                    )}

                    {medical_history.MedicinesPrescribed.PrescriptionUrls?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {medical_history.MedicinesPrescribed.PrescriptionUrls.map((url, index) => (
                          <div key={index} className="relative w-24 h-24">
                            {/* Thumbnail */}
                            <img
                              src={url}
                              alt={`Prescription ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg border border-gray-300 cursor-pointer"
                              onClick={() => setPreviewImage(url)}
                            />

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setmedical_history((prev) => ({
                                  ...prev,
                                  MedicinesPrescribed: {
                                    ...prev.MedicinesPrescribed,
                                    PrescriptionUrls: prev.MedicinesPrescribed.PrescriptionUrls.filter(
                                      (_, i) => i !== index
                                    ),
                                  },
                                }));
                              }}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs shadow-md hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>

                    )}


                  </FormControl>

                  {previewImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                      {/* Modal Content */}
                      <div className="relative bg-white rounded-lg p-4 max-w-3xl w-full">
                        {/* Close Button */}
                        <button
                          onClick={() => setPreviewImage(null)}
                          className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
                        >
                          ✕
                        </button>

                        {/* Full-size Image */}
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

        </Modal.Body>


      </Modal>

      {isloading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(255, 255, 255, 0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <UniqueLoader />
        </div>
      )}
    </div>
  );
}

export default CurrentMedicinesForCurrentProblem

