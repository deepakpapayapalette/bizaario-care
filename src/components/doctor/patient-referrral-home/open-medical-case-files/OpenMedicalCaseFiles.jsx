
import React, { useEffect, useState, useRef } from 'react'
import { TextField, Select, MenuItem, FormControl, Box, Avatar, Tooltip, IconButton, CircularProgress, Button, Radio, FormControlLabel, RadioGroup, FormLabel, Dialog } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Swal from 'sweetalert2';
import { Plus, Edit } from 'lucide-react';
import { __postApiData, __putApiData, __getApiData } from "@utils/api";
import { customMenuProps } from '@utils/CustomMenuProps';
import UniqueLoader from '../../../common/UniqueLoader';




const OpenMedicalCaseFiles = ({ patientId, patient_details, setselected_case_file }) => {



  const doctor_details = JSON.parse(localStorage.getItem("user"))

  const [isloading_for, setisloading_for] = useState(false)

  const [medical_case_file, setmedical_case_file] = useState({
    ParentCaseFileId: null,
    PatientId: "",
    TreatmentType: '',
    DoctorId: '',
    DoctorName: '',
    HospitalId: '',
    HospitalName: '',
    Date: '',
    MedicalSpeciality: '',
    Status: "",
    Disease: [],
    Accident: []
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setmedical_case_file((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };



  const save_patient_case_file = async () => {
    setisloading_for(true);
    try {
      const payload = {
        ...medical_case_file,
        PatientId: patientId
      }
      const resp = await __postApiData(`/api/v1/admin/patientCaseFile/savepatientCaseFile`,
        payload,
      );

      console.log(resp, "resp 59");

      const { response_code, response_message } = resp.response;

      if (response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Details Added",
          text: "Medical Case File Added Successfully...",
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        }).then(() => {
          window.location.reload();
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
      setisloading_for(false);
    }
  };



  //=========================== code start for add medical case files=====================================

  const [show_medical_files, setshow_medical_files] = useState(false)

  // function to open modal
  const handleShow_medical_files = () => setshow_medical_files(true);
  // function to close modal
  const handleClose_medical_files = () => setshow_medical_files(false);





  //====================================== get all medical speciality =====================================


  const [allmedical_speciality, setallmedical_speciality] = useState([]);
  const [loadingSpeciality, setLoadingSpeciality] = useState(false);

  const getallmedical_speciality = async () => {
    try {
      setLoadingSpeciality(true);
      const resp = await __postApiData('/api/v1/admin/LookupList', { lookupcodes: "medical_speciality" });
      setallmedical_speciality(resp.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSpeciality(false);
    }
  };


  // ================================get doctor list========================================

  const [allDoctor, setallDoctor] = useState([])
  const getall_doctorlist = async () => {
    try {
      const resp = await __postApiData(`/api/v1/admin/AssetList`, { AssetCategoryLevel1: "68b0104063729ea39b28d0fb" })
      setallDoctor(resp.data.list)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getall_doctorlist()

  }, [])



  // ================================get hospital list========================================

  const [allHospital, setallHospital] = useState([])
  const getall_hospitallist = async () => {
    try {
      const resp = await __postApiData(`/api/v1/admin/AssetList`, { AssetCategoryLevel1: "68b00db063729ea39b28d0ef" })
      setallHospital(resp.data.list)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getall_hospitallist()

  }, [])


  //================================== get disease list============================================

  const [loadingDiseases, setLoadingDiseases] = useState(false);

  const [all_disease_master, setall_disease_master] = useState([])
  const getall_disease_master = async () => {
    try {
      setLoadingDiseases(true)
      const resp = await __postApiData('/api/v1/common/LookupList/', { lookup_type: "disease_master" })
      setall_disease_master(resp.data)

    } catch (error) {
      console.log(error);

    }
    finally {
      setLoadingDiseases(false)
    }
  }

  //============================= all truma list==================================================

  const [loadingtrauma, setLoadingtrauma] = useState(false);

  const [all_truma_master, setall_truma_master] = useState([])
  const getall_truma_master = async () => {
    try {
      setLoadingtrauma(true)
      const resp = await __postApiData('/api/v1/admin/LookupList/', { lookupcodes: "trauma_master" })
      setall_truma_master(resp.data)

    } catch (error) {
      console.log(error);

    }
    finally {
      setLoadingtrauma(false)
    }
  }






  //============================ get all case file=========================================


  const [caseFiles, setCaseFiles] = useState([])
  const getall_case_file = async () => {
    try {
      const resp = await __getApiData(`/api/v1/admin/patientCaseFile/listPatientCaseFile?PatientId=${patientId}`);

      setCaseFiles(resp.data.list)

    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSpeciality(false);
    }
  };

  useEffect(() => {
    getall_case_file()
  }, [])




  //===================================== change status api===========================================


  const change_casefile_status = async (id, status) => {
    try {
      setisloading_for(true)
      const resp = await __putApiData(`/api/v1/admin/medical-history/status/casefile/${id}`, { "Status": status, });
      const { response_code, response_message } = resp.response;
      if (response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Details Updated",
          text: "Case File Status Updated Successfully...",
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        }).then(() => {
          window.location.reload();
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
    } finally {
      setisloading_for(false);
    }
  };


  //============================= edit case file==============================================

  const handle_edit_case_file = (file) => {
    setmedical_case_file({
      ...file,
      MedicalSpeciality: file.MedicalSpeciality._id,
      DoctorId: file.DoctorId._id,
      _id: file._id
    })
  }

  return (
    <div className="space " >
      <div className="flex  space-x-2">
        <button className='theme-btn-fill' onClick={handleShow_medical_files}>Open Medical Case Files</button>
      </div>
      {/* ====================================modal for add medical case files ==========================*/}
      <Dialog
        open={show_medical_files}
        onClose={handleClose_medical_files}
        fullWidth
        maxWidth={false}
        PaperProps={{
          sx: {
            width: "1000px",
            maxWidth: "1200px",
            padding: "20px",
          }
        }}
      >
        <div>
          <div className="flex flex-col">
            {/* Main title */}
            <h2 className="text-lg font-bold text-gray-900 w-full">Create New File</h2>
            <hr className="w-full border-gray-800 my-2" />

            {/* Patient details */}
            <div className="mt-1 text-sm text-gray-600 space-x-2">
              <span className="font-semibold text-blue-700">{patient_details?.Name}</span>
              <span className="text-gray-500">{patient_details?.Gender}</span>
              {patient_details?.DateOfBirth && (
                <span className="text-gray-500">
                  {new Date(patient_details.DateOfBirth).toISOString().split("T")[0]}
                </span>
              )}
            </div>
          </div>

          <div>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">

              <FormControl fullWidth size="small">
                <label className="form-label">Parent Case File</label>
                <Select
                  labelId="content-type-label"
                  name="ParentCaseFileId"
                  value={medical_case_file.ParentCaseFileId}

                  onChange={handleChange}
                  displayEmpty
                  MenuProps={customMenuProps}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <span style={{ color: "#9ca3af" }}>Select Parent Case File </span>;
                    }
                    return caseFiles?.find((item) => item._id === selected)?.TreatmentType;
                  }}
                >
                  <MenuItem value="">
                    <em>Select Parent Case File </em>
                  </MenuItem>
                  {
                    caseFiles?.map((type) => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.TreatmentType}-
                        ({new Date(type.Date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })})
                      </MenuItem>
                    ))
                  }


                </Select>
              </FormControl>


              <FormControl fullWidth size="small">
                <label className="form-label">Patient Name </label>
                <TextField
                  type='text'
                  placeholder="Patient Name"
                  name="Date"
                  size="small"
                  inputProps={{ readOnly: true }}
                  value={patient_details?.Name}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl fullWidth size="small">
                <label className="form-label">Date Of Birth</label>
                <TextField
                  type='date'
                  placeholder="Date"
                  name="Date"
                  size="small"
                  value={patient_details?.DateOfBirth ?
                    new Date(patient_details.DateOfBirth).toISOString().split("T")[0]
                    : ""
                  }
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl fullWidth size="small">
                <label className="form-label">Gender</label>

                <RadioGroup size="small"
                  row
                  name="Gender"
                  value={patient_details?.Gender}
                  // onChange={handlechange}
                  sx={{ flexDirection: 'row', alignItems: 'flex-start', gap: 1 }}
                >


                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />


                </RadioGroup>
              </FormControl>

              <FormControl fullWidth size="small">
                <label className="form-label">Medical Speciality </label>
                <Select
                  labelId="content-type-label"
                  name="MedicalSpeciality"
                  value={medical_case_file.MedicalSpeciality}
                  onOpen={() => {
                    if (allmedical_speciality.length === 0) { // prevent multiple calls
                      getallmedical_speciality();
                    }
                  }}
                  onChange={handleChange}
                  displayEmpty
                  MenuProps={customMenuProps}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <span style={{ color: "#9ca3af" }}>Medical Speciality </span>;
                    }
                    return allmedical_speciality?.find((item) => item._id === selected)?.lookup_value;
                  }}
                >
                  <MenuItem value="">
                    <em>Medical Speciality </em>
                  </MenuItem>
                  {loadingSpeciality ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : (
                    allmedical_speciality?.map((type) => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.lookup_value}
                      </MenuItem>
                    ))
                  )}


                </Select>
              </FormControl>


              <FormControl fullWidth size="small">
                <label className="form-label">Select Doctor</label>
                <Select
                  labelId="content-type-label"
                  name="DoctorId"
                  value={medical_case_file.DoctorId}
                  onOpen={() => {
                    if (allDoctor.length === 0) { // prevent multiple calls
                      getallmedical_speciality();
                    }
                  }}
                  onChange={handleChange}
                  displayEmpty
                  MenuProps={customMenuProps}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <span style={{ color: "#9ca3af" }}>Select Doctor </span>;
                    }
                    return allDoctor?.find((item) => item._id === selected)?.AssetName;
                  }}
                >
                  <MenuItem value="">
                    <em>Select Doctor </em>
                  </MenuItem>
                  {loadingSpeciality ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : (
                    allDoctor?.map((type) => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.AssetName}
                      </MenuItem>
                    ))
                  )}


                </Select>
              </FormControl>


              <FormControl fullWidth size="small">
                <label className="form-label">Doctor Name </label>
                <TextField
                  type='text'
                  placeholder="Doctor Name"
                  name="DoctorName"
                  size="small"
                  value={medical_case_file.DoctorName}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl fullWidth size="small">
                <label className="form-label">Select Hospital</label>
                <Select
                  labelId="content-type-label"
                  name="HospitalId"
                  value={medical_case_file.HospitalId}
                  onOpen={() => {
                    if (allHospital.length === 0) { // prevent multiple calls
                      getallmedical_speciality();
                    }
                  }}
                  onChange={handleChange}
                  displayEmpty
                  MenuProps={customMenuProps}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <span style={{ color: "#9ca3af" }}>Select Hospital </span>;
                    }
                    return allHospital?.find((item) => item._id === selected)?.AssetName;
                  }}
                >
                  <MenuItem value="">
                    <em>Select Hospital </em>
                  </MenuItem>
                  {loadingSpeciality ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : (
                    allHospital?.map((type) => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.AssetName}
                      </MenuItem>
                    ))
                  )}


                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <label className="form-label">Hospital/Clinic Name </label>
                <TextField
                  type='text'
                  placeholder="Hospital Name"
                  name="HospitalName"
                  size="small"
                  value={medical_case_file.HospitalName}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl fullWidth size="small">
                <label className="form-label">Date Of Treatment </label>
                <TextField
                  type='date'
                  placeholder="Date"
                  name="Date"
                  size="small"
                  value={medical_case_file.Date}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl fullWidth size="small">
                <label className="form-label">Status </label>
                <Select
                  labelId="content-type-label"
                  name="Status"
                  value={medical_case_file.Status}
                  onChange={handleChange}
                  displayEmpty
                  MenuProps={customMenuProps}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <span style={{ color: "#9ca3af" }}>Select Status </span>;
                    }
                    return selected;
                  }}
                >
                  <MenuItem value="">
                    <em>Select Status </em>
                  </MenuItem>

                  <MenuItem value="Ongoing">Ongoing</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                  <MenuItem value="Past">Past</MenuItem>
                </Select>

              </FormControl>

              <FormControl fullWidth size="small">
                <label className="form-label">Disease</label>
                <Select
                  multiple
                  labelId="content-type-label"
                  name="Disease"
                  value={medical_case_file.Disease || []}
                  onOpen={() => {
                    if (all_disease_master.length === 0) { // prevent multiple calls
                      getall_disease_master();
                    }
                  }}
                  onChange={handleChange}
                  displayEmpty
                  MenuProps={customMenuProps}
                  renderValue={(selected) => {
                    // Show placeholder if no items are selected
                    if (!selected || selected.length === 0) {
                      return <span className="text-gray-400">Select Disease</span>;
                    }

                    // Otherwise show selected items as comma-separated text
                    const selectedLabels = selected
                      .map((id) => all_disease_master.find((item) => item._id === id)?.lookup_value)
                      .filter(Boolean);
                    return selectedLabels.join(", ");
                  }}
                >
                  <MenuItem value="">
                    <em>Select Disease </em>
                  </MenuItem>
                  {loadingDiseases ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : (
                    all_disease_master?.map((type) => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.lookup_value}
                      </MenuItem>
                    ))
                  )}


                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <label className="form-label">Accident</label>
                <Select
                  multiple
                  labelId="content-type-label"
                  name="Accident"
                  value={medical_case_file.Accident || []}
                  onOpen={() => {
                    if (all_truma_master.length === 0) { // prevent multiple calls
                      getall_truma_master();
                    }
                  }}
                  onChange={handleChange}
                  displayEmpty
                  MenuProps={customMenuProps}
                  renderValue={(selected) => {
                    // Show placeholder if no items are selected
                    if (!selected || selected.length === 0) {
                      return <span className="text-gray-400">Select Accident</span>;
                    }

                    // Otherwise show selected items as comma-separated text
                    const selectedLabels = selected
                      .map((id) => all_truma_master.find((item) => item._id === id)?.lookup_value)
                      .filter(Boolean);
                    return selectedLabels.join(", ");
                  }}
                >
                  <MenuItem value="">
                    <em>Select Accident </em>
                  </MenuItem>
                  {loadingtrauma ? (
                    <MenuItem disabled>
                      <CircularProgress size={20} />
                    </MenuItem>
                  ) : (
                    all_truma_master?.map((type) => (
                      <MenuItem key={type._id} value={type._id}>
                        {type.lookup_value}
                      </MenuItem>
                    ))
                  )}


                </Select>
              </FormControl>

              <div className='col-span-2'>
                <FormControl fullWidth size="small">
                  <label className="form-label">Treatment Type </label>

                  <RadioGroup size="small"
                    row
                    name="TreatmentType"
                    value={medical_case_file.TreatmentType}
                    onChange={handleChange}
                    sx={{ flexDirection: 'row', alignItems: 'flex-start', gap: 1 }}
                  >


                    <FormControlLabel value="OPD Visit Record" control={<Radio />} label="OPD Visit Record" />
                    <FormControlLabel value="Day care Visit Record" control={<Radio />} label="Day Care Visit Record" />
                    <FormControlLabel value="Maternity Record" control={<Radio />} label="Maternity Record" />
                    <FormControlLabel value="General (Non-surgical) Hospitalisation Record" control={<Radio />} label="General(Non-Surgical) Hospitalisation Record" />
                    <FormControlLabel value="Surgery/ Procedure Record" control={<Radio />} label="Surgery/Procedure Record" />

                  </RadioGroup>
                </FormControl>
              </div>


            </div>



            <div className="flex justify-end mt-4">


              <button
                className='theme-btn-fill '
                onClick={save_patient_case_file}
              >
                Save
              </button>
            </div>

            <div className="col-span-1 mt-6 bg-[rgba(82, 103, 125, 0.10)]">
              {caseFiles?.length === 0 ? (
                <p>No case files yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-3 ">
                  {caseFiles?.map((file, index) => (
                    <div
                      key={index}
                      className="border rounded-lg shadow-md p-3 bg-[rgba(82,103,125,0.10)]"
                    >
                      <div className='flex justify-between'>
                        <h3 className=" text-lg text-gray-800 font-thin">
                          Medical Case File ID:<br></br>
                          <span className="form-title text-lg font-semibold text-gray-800">{file._id || 'N/A'}</span>
                        </h3>
                        <button onClick={() => handle_edit_case_file(file)} className="flex items-center space-x-2 text-[var(--primary-color)] hover:text-blue-700 transition-colors">
                          <Edit className="w-4 h-4" />
                          <span className="text-sm font-medium underline">Edit</span>
                        </button>
                      </div>
                      <p className="flex text-sm text-gray-600 gap-2">
                        {/* <img src={calendericon} alt='' className='h-5'></img> */}
                        {new Date(file.Date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-600">
                        Treatment Type: <strong>{file?.TreatmentType || 'N/A'}</strong>
                      </p>
                      <p className="form-title  text-gray-600">
                        {file?.DoctorName || file?.DoctorId?.AssetName}
                      </p>
                      <div className='flex justify-between'>
                        <p className=" flex text-sm text-gray-600">
                          <strong>Medical Speciality:</strong>

                          {
                            file.MedicalSpeciality?.lookup_value ? file.MedicalSpeciality.lookup_value : "N/A"
                          }

                        </p>

                        <p className=" flex text-sm text-gray-600">
                          <strong>Status:</strong>
                          {
                            file.Status
                          }

                        </p>

                        <div className='flex justify-between gap-2'>
                          <button className='classic-button' onClick={() => change_casefile_status(file._id, "Ongoing")} style={{ display: file.Status === "Ongoing" ? "none" : "flex" }}>
                            Ongoing
                          </button>
                          <button className='classic-button' onClick={() => change_casefile_status(file._id, "Past")} style={{ display: file.Status === "Past" ? "none" : "flex" }}>
                            Past
                          </button>
                          <button
                            className='classic-button'
                            onClick={() => {
                              setselected_case_file(file._id);
                              handleClose_medical_files();
                            }}
                          >
                            View
                          </button>

                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>



          </div>

        </div>
      </Dialog>

      {isloading_for && (
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
export default OpenMedicalCaseFiles;

