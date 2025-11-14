
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

const DiagnosticsInvestigationsForCurrentProblem = ({ patientId, selected_case_file, case_file_data, onRefresh }) => {

  const doctordetails = JSON.parse(localStorage.getItem("user"))



  //============================= main form state start ============================================

  const [medical_history, setmedical_history] = useState({

    ClinicalDiagnoses: [{
      Date: "",
      InvestigationCategory: '',
      Investigation: '',
      Abnormalities: [],
      ReportUrl: "",
      InterpretationUrl: ""
    }],
  });

  //=================================== main form state end=========================================


  //========================== modal open or close start==========================================

  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  //=========================== modal open or close end===============================================

  //==================================== add more function==========================================


  const handleAddMoreClinicalDiagnosis = () => {
    setmedical_history(prev => ({
      ...prev,
      ClinicalDiagnoses: [
        ...(prev.ClinicalDiagnoses || []),
        { Date: "", InvestigationCategory: "", Investigation: "", Abnormalities: [], ReportUrl: [], InterpretationUrl: [] } // new item
      ],
    }));
  };


  // ===============================onchange events for ClinicalDiagnoses start============================


  const handleClinicalDiagnosisChange = (index, field, value) => {
    setmedical_history(prev => {
      const updatedClinicalDiagnosis = [...prev.ClinicalDiagnoses];
      const diagnosis = { ...updatedClinicalDiagnosis[index] };


      diagnosis[field] = value;

      updatedClinicalDiagnosis[index] = diagnosis;

      return {
        ...prev,
        ClinicalDiagnoses: updatedClinicalDiagnosis
      };
    });
  };


  const toggleArrayFieldClinicalDiagnosis = (index, field, itemId) => {
    setmedical_history(prev => {
      const updatedClinicalDiagnosis = [...prev.ClinicalDiagnoses];
      const diagnosis = { ...updatedClinicalDiagnosis[index] };
      const currentArray = diagnosis[field] || [];

      if (currentArray.includes(itemId)) {
        diagnosis[field] = currentArray.filter(id => id !== itemId);
      } else {
        diagnosis[field] = [...currentArray, itemId];
      }

      updatedClinicalDiagnosis[index] = diagnosis;

      return {
        ...prev,
        ClinicalDiagnoses: updatedClinicalDiagnosis
      };
    });
  };


  // ===============================onchange events for ClinicalDiagnoses end============================

  //====================================== get all investigation category =====================================


  const [all_investigation_category, setall_investigation_category] = useState([])
  const getall_investigation_category = async () => {
    try {
      const resp = await api.post('api/v1/admin/LookupList/', { lookupcodes: "investigation_category_type" })


      setall_investigation_category(resp.data.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getall_investigation_category()

  }, [])


  //=============================== get investigation list======================================

  const [all_investigation_master, setall_investigation_master] = useState([])
  const getall_investigation_master = async () => {
    try {
      const resp = await api.post(`api/v1/admin/investigationList`)


      setall_investigation_master(resp.data.data.list)

    } catch (error) {
      console.log(error);

    }
  }


  useEffect(() => {
    getall_investigation_master()

  }, [])

  //============================ get symptom class data=======================================


  const [all_symptom_class_master, setall_symptom_class_master] = useState([])
  const getall_symptom_class_master = async () => {
    try {
      const resp = await api.post('api/v1/admin/LookupList/', { lookupcodes: "symptom_class_type" })


      setall_symptom_class_master(resp.data.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getall_symptom_class_master()

  }, [])



  //============================ Handle single image upload========================================
  const [image_loading, setimage_loading] = useState(false)

  const handlesingleImageChange = async (index, e, fieldName) => {
    const file = e.target.files[0]; // single file
    if (!file) return;

    try {
      setimage_loading(fieldName)
      const formData = new FormData();
      formData.append("file", file);

      const resp = await api.post("api/v1/common/AddImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Extract URL from response
      if (
        resp.data?.response?.response_code === "200" &&
        resp.data.data?.length > 0
      ) {
        const imageUrl = resp.data.data[0].full_URL; // full_URL from API

        // ✅ Update state dynamically based on `fieldName`
        setmedical_history((prev) => {
          const updatedClinicalDiagnoses = [...prev.ClinicalDiagnoses];
          updatedClinicalDiagnoses[index] = {
            ...updatedClinicalDiagnoses[index],
            [fieldName]: imageUrl, // <-- dynamic field update
          };
          return {
            ...prev,
            ClinicalDiagnoses: updatedClinicalDiagnoses,
          };
        });
      }
    } catch (error) {
      console.error("Image upload error:", error);
    }
    finally {
      setimage_loading(false)
    }
  };




  const [isloading, setisloading] = useState(false)

  const save_diagnostics_investigations = async () => {
    setisloading(true);
    try {
      const payload =
      {
        ...medical_history,
        CaseFileId: patient_all_diagnostics[0]?.caseFileId._id,
        CreatedBy: doctordetails._id
      }
      const resp = await api.post(
        `api/v1/admin/medical-history/clinical-diagnoses/add-multiple`,
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

  //============================== get all diagnostics data of patient==================================

  const [patient_all_diagnostics, setpatient_all_diagnostics] = useState([])

  const getall_patient_medical_history = async () => {
    try {
      //  setLoadingSpeciality(true);
      const resp = await api.get(`api/v1/admin/medical-history/list?PatientId=${patientId}&Status=Ongoing`);


      const formatted = resp.data.data.list.map(item => ({
        caseFileId: item.CaseFileId,
        treatmentType: item.CaseFileId.TreatmentType,
        clinicaldiagnoses: item.ClinicalDiagnoses
      }));
      setpatient_all_diagnostics(formatted);



    } catch (error) {
      console.error(error);
    } finally {
      //  setLoadingSpeciality(false);
    }
  };

  useEffect(() => {
    getall_patient_medical_history()
  }, [])






  //===================================== edit===============================================
  const [previewImage, setPreviewImage] = useState(null);

  const [showEdit, setShowEdit] = useState(false)

  const handleShowEdit = () => {
    if (patient_all_diagnostics && patient_all_diagnostics.length > 0) {
      const normalizedComplaints = patient_all_diagnostics[0].clinicaldiagnoses.map(
        ({ createdAt, updatedAt, _id, ...cc }) => ({
          ...cc,
          Abnormalities: cc.Abnormalities.map(s => (typeof s === "string" ? s : s._id)),
          InvestigationCategory: cc.InvestigationCategory ? typeof cc.InvestigationCategory === "string"
            ? cc.InvestigationCategory
            : cc.InvestigationCategory._id
            : ""

        })
      );

      setmedical_history(prev => ({
        ...prev,
        ClinicalDiagnoses: normalizedComplaints
      }));
    }

    setShowEdit(true);
  };


  const handleCloseEdit = () => {
    setShowEdit(false);
    setmedical_history({
      ClinicalDiagnoses: [
        {
          Date: "",
          InvestigationCategory: "",
          Investigation: "",
          Abnormalities: [],
          ReportUrl: "",
          InterpretationUrl: "",
        },
      ],
    });
  };


  const update_diagnostics_investigations = async () => {
    setisloading(true);
    try {
      const payload =
      {
        ...medical_history,
        CaseFileId: patient_all_diagnostics[0]?.caseFileId._id,
        UpdatedBy: doctordetails._id
      }
      const resp = await api.put(
        `api/v1/admin/medical-history/clinical-diagnoses/edit-multiple`,
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
          text: "Patient Details Updated Successfully...",
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
        <h3 className="text-xxl font-bold text-gray-900">
          Diagnostics/Investigations
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

      {/* Table */}
      {/* <div className="overflow-x-auto" style={{display:selected_case_file?"block":"none"}}>
        <div className="bg-[var(--button-back-color)] text-white  " >
          <div className="grid grid-cols-3 gap-4 p-2 text-[20px]">
            <h3 className="table-header">Investigation Category</h3>
            <h3 className="table-header">Investigation Name</h3>
            <h3 className="table-header">Abnormalities Found</h3>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {case_file_data?.length > 0 && case_file_data[0]?.Status === "Past" &&
          case_file_data[0]?.ClinicalDiagnoses?.map((item, index) => (
            <div
              key={item.id}
              className={`grid grid-cols-3 gap-4 p-4 ${index % 2 === 0 ? 'bg-[#f2f3f6]' : 'bg-white'
                }`}
            >
              <div className="text-sm text-gray-900 font-medium table-body">
                  {item?.InvestigationCategory?.lookup_value|| "—"}
              </div>
              <div className="text-sm text-gray-900 table-body">
                 {item?.Investigation?.lookup_value|| "—"}
              </div>

              <div className="text-sm text-gray-900 table-body">
                {item?.Abnormalities?.map(sym => sym?.lookup_value).join(", ") || "—"}
              </div>
            </div>
          ))}
        </div>
      </div> */}

      {/* Show patient_all_cheif_complaints section only if case_file_data is empty */}
      {
        // (!case_file_data || case_file_data.length === 0) &&
        patient_all_diagnostics?.map((caseFile, caseIndex) => (
          <div key={caseFile.caseFileId} className="mb-6">
            {/* Case File Header */}
            <h3 className="text-xl font-bold mb-2">
              {caseFile.caseFileId.TreatmentType} (Case File ID: {caseFile.caseFileId._id})-
              {new Date(caseFile.caseFileId.Date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </h3>

            {/* Table Header */}
            <div className="bg-[var(--button-back-color)] text-white">
              <div className="grid grid-cols-3 gap-4 p-2 text-[20px]">
                <h3 className="table-header">Investigation Category</h3>
                <h3 className="table-header">Investigation Name</h3>
                <h3 className="table-header">Abnormalities Found</h3>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {caseFile?.clinicaldiagnoses?.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-3 gap-4 p-4 ${index % 2 === 0 ? "bg-[#f2f3f6]" : "bg-white"
                    }`}
                >


                  <div className="text-sm text-gray-900 font-medium table-body">
                    {item?.InvestigationCategory?.lookup_value || "—"}
                  </div>


                  <div className="text-sm text-gray-900 font-medium table-body">
                    {item?.Investigation?.lookup_value || "—"}
                  </div>



                  <div className="text-sm text-gray-900 font-medium table-body">
                    {item?.Abnormalities?.map(sym => sym?.lookup_value).join(", ") || "—"}
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
          <Modal.Title className='form-title'>Add Medical History(Clinical Diagnoses)</Modal.Title>
        </Modal.Header>
        <Modal.Body>


          <div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">

              {/*======================== clinical Diagnosis ================================================*/}



              <div className='col-span-2'>
                <h5 className='form-title'>Clinical Diagnoses </h5>
                {medical_history.ClinicalDiagnoses.map((details, index) => (

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">

                    <FormControl fullWidth size="small">
                      <label className="form-label">Date </label>
                      <TextField
                        type='date'
                        placeholder="Date"
                        name="Date"
                        size="small"
                        value={details.Date}
                        onChange={(e) => handleClinicalDiagnosisChange(index, "Date", e.target.value)}
                      />
                    </FormControl>

                    <FormControl fullWidth size="small">
                      <label className="form-label">Investigation Category </label>
                      <Select
                        labelId="content-type-label"
                        name="InvestigationCategory"
                        value={details.InvestigationCategory}
                        onChange={(e) => handleClinicalDiagnosisChange(index, "InvestigationCategory", e.target.value)}
                        displayEmpty
                        MenuProps={customMenuProps}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <span style={{ color: "#9ca3af" }}>Investigation Category </span>;
                          }
                          return all_investigation_category?.find((item) => item._id === selected)?.lookup_value;
                        }}
                      >
                        <MenuItem value="">
                          <em>Investigation Category </em>
                        </MenuItem>
                        {all_investigation_category?.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.lookup_value}
                          </MenuItem>
                        ))}


                      </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                      <label className="form-label">Investigation </label>
                      <Select
                        labelId="content-type-label"
                        name="Nationality"
                        value={details.Investigation}
                        onChange={(e) => handleClinicalDiagnosisChange(index, "Investigation", e.target.value)}
                        displayEmpty
                        MenuProps={customMenuProps}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <span style={{ color: "#9ca3af" }}>Investigation </span>;
                          }
                          return all_investigation_master?.find((item) => item._id === selected)?.InvestigationName;
                        }}
                      >
                        <MenuItem value="">
                          <em>Investigation </em>
                        </MenuItem>
                        {all_investigation_master?.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.InvestigationName}
                          </MenuItem>
                        ))}


                      </Select>
                    </FormControl>

                    <div className="col-span-2">
                      <FormControl fullWidth size="small">
                        <label className="form-label">Abnormalities </label>
                        <div className="flex flex-wrap gap-2">
                          {all_symptom_class_master.map((item) => {
                            const selected = (details?.Abnormalities || []).includes(item._id);
                            return (
                              <span
                                key={item._id}
                                onClick={() => toggleArrayFieldClinicalDiagnosis(index, "Abnormalities", item._id,)}
                                className={`px-3 py-1 text-sm rounded-md cursor-pointer flex items-center gap-2
                                ${selected ? 'bg-blue-500 text-white' : 'bg-[#e2e4f4] text-gray-800'}`}
                              >
                                {item.lookup_value}
                                {selected && (
                                  <span
                                    className="ml-1 text-xs font-bold cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // handleSymptomSelect(item._id,index);
                                    }}
                                  >
                                    ✕
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      </FormControl>
                    </div>

                    <FormControl fullWidth size="small">
                      <label className="form-label">Upload Report </label>
                      <TextField
                        type='file'
                        placeholder="Date"
                        name="ReportUrl"
                        size="small"
                        // value={details.ReportUrl}
                        onChange={(e) => handlesingleImageChange(index, e, "ReportUrl")}
                      />
                      {image_loading === "ReportUrl" && (
                        <div

                        >
                          <CircularProgress size={24} color="primary" />
                        </div>
                      )}
                    </FormControl>

                    <FormControl fullWidth size="small">
                      <label className="form-label">Upload Interpretation </label>
                      <TextField
                        type='file'
                        placeholder="Date"
                        name="DateOfBirth"
                        size="small"
                        // value={details.InterpretationUrl}
                        onChange={(e) => handlesingleImageChange(index, e, "InterpretationUrl")}
                      />
                      {image_loading === "InterpretationUrl" && (
                        <div

                        >
                          <CircularProgress size={24} color="primary" />
                        </div>
                      )}
                    </FormControl>


                    <div className="flex justify-between mt-2">
                      <Button
                        style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                        onClick={handleAddMoreClinicalDiagnosis}
                      >
                        Add More
                      </Button>


                    </div>

                  </div>

                ))}

              </div>








            </div>



            <div className="flex justify-end mt-4">


              <Button
                style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                onClick={save_diagnostics_investigations}
              >
                Save
              </Button>
            </div>


          </div>

        </Modal.Body>


      </Modal>



      {/*================================== edit modal ==============================================*/}


      <Modal show={showEdit} onHide={handleCloseEdit} centered size="lg">

        <Modal.Header closeButton>
          <Modal.Title className='form-title'>Edit Medical History(Clinical Diagnoses)</Modal.Title>
        </Modal.Header>
        <Modal.Body>


          <div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">

              {/*======================== clinical Diagnosis ================================================*/}



              <div className='col-span-2'>
                <h5 className='form-title'>Clinical Diagnoses </h5>
                {medical_history.ClinicalDiagnoses.map((details, index) => (

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">

                    <FormControl fullWidth size="small">
                      <label className="form-label">Date </label>
                      <TextField
                        type='date'
                        placeholder="Date"
                        name="Date"
                        size="small"
                        value={details.Date ? new Date(details.Date).toISOString().split("T")[0] : ""}
                        onChange={(e) => handleClinicalDiagnosisChange(index, "Date", e.target.value)}
                      />
                    </FormControl>

                    <FormControl fullWidth size="small">
                      <label className="form-label">Investigation Category </label>
                      <Select
                        labelId="content-type-label"
                        name="InvestigationCategory"
                        value={details.InvestigationCategory}
                        onChange={(e) => handleClinicalDiagnosisChange(index, "InvestigationCategory", e.target.value)}
                        displayEmpty
                        MenuProps={customMenuProps}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <span style={{ color: "#9ca3af" }}>Investigation Category </span>;
                          }
                          return all_investigation_category?.find((item) => item._id === selected)?.lookup_value;
                        }}
                      >
                        <MenuItem value="">
                          <em>Investigation Category </em>
                        </MenuItem>
                        {all_investigation_category?.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.lookup_value}
                          </MenuItem>
                        ))}


                      </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                      <label className="form-label">Investigation </label>
                      <Select
                        labelId="content-type-label"
                        name="Nationality"
                        value={details.Investigation}
                        onChange={(e) => handleClinicalDiagnosisChange(index, "Investigation", e.target.value)}
                        displayEmpty
                        MenuProps={customMenuProps}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <span style={{ color: "#9ca3af" }}>Investigation </span>;
                          }
                          return all_investigation_master?.find((item) => item._id === selected)?.InvestigationName;
                        }}
                      >
                        <MenuItem value="">
                          <em>Investigation </em>
                        </MenuItem>
                        {all_investigation_master?.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.InvestigationName}
                          </MenuItem>
                        ))}


                      </Select>
                    </FormControl>

                    <div className="col-span-2">
                      <FormControl fullWidth size="small">
                        <label className="form-label">Abnormalities </label>
                        <div className="flex flex-wrap gap-2">
                          {all_symptom_class_master.map((item) => {
                            const selected = (details?.Abnormalities || []).includes(item._id);
                            return (
                              <span
                                key={item._id}
                                onClick={() => toggleArrayFieldClinicalDiagnosis(index, "Abnormalities", item._id,)}
                                className={`px-3 py-1 text-sm rounded-md cursor-pointer flex items-center gap-2
                                ${selected ? 'bg-blue-500 text-white' : 'bg-[#e2e4f4] text-gray-800'}`}
                              >
                                {item.lookup_value}
                                {selected && (
                                  <span
                                    className="ml-1 text-xs font-bold cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // handleSymptomSelect(item._id,index);
                                    }}
                                  >
                                    ✕
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      </FormControl>
                    </div>
                    <FormControl fullWidth size="small">
                      <label className="form-label">Upload Report </label>
                      <TextField
                        type="file"
                        placeholder="Date"
                        name="ReportUrl"
                        size="small"
                        onChange={(e) => handlesingleImageChange(index, e, "ReportUrl")}
                      />

                      {image_loading === "ReportUrl" && (
                        <div

                        >
                          <CircularProgress size={24} color="primary" />
                        </div>
                      )}

                      {details.ReportUrl && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          <div key={details.ReportUrl} className="relative w-24 h-24">
                            {/* Thumbnail */}
                            <img
                              src={details.ReportUrl}
                              alt={`Report ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg border border-gray-300 cursor-pointer"
                              onClick={() => setPreviewImage(details.ReportUrl)}
                            />

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setmedical_history((prev) => {
                                  const updated = [...prev.ClinicalDiagnoses];
                                  updated[index] = {
                                    ...updated[index],
                                    ReportUrl: "", // clear the file
                                  };
                                  return { ...prev, ClinicalDiagnoses: updated };
                                });
                              }}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs shadow-md hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
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

                    <FormControl fullWidth size="small">
                      <label className="form-label">Upload Interpretation </label>
                      <TextField
                        type="file"
                        placeholder="Date"
                        name="InterpretationUrl"
                        size="small"
                        onChange={(e) => handlesingleImageChange(index, e, "InterpretationUrl")}
                      />

                      {image_loading === "InterpretationUrl" && (
                        <div

                        >
                          <CircularProgress size={24} color="primary" />
                        </div>
                      )}

                      {details.InterpretationUrl && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          <div key={details.InterpretationUrl} className="relative w-24 h-24">
                            {/* Thumbnail */}
                            <img
                              src={details.InterpretationUrl}
                              alt={`Interpretation ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg border border-gray-300 cursor-pointer"
                              onClick={() => setPreviewImage(details.InterpretationUrl)}
                            />

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setmedical_history((prev) => {
                                  const updated = [...prev.ClinicalDiagnoses];
                                  updated[index] = {
                                    ...updated[index],
                                    InterpretationUrl: "", // clear the file
                                  };
                                  return { ...prev, ClinicalDiagnoses: updated };
                                });
                              }}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs shadow-md hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      )}
                    </FormControl>



                    <div className="flex justify-between mt-2">
                      <Button
                        style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                        onClick={handleAddMoreClinicalDiagnosis}
                      >
                        Add More
                      </Button>


                    </div>

                  </div>

                ))}

              </div>

            </div>



            <div className="flex justify-end mt-4">


              <Button
                style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                onClick={update_diagnostics_investigations}
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

export default DiagnosticsInvestigationsForCurrentProblem

