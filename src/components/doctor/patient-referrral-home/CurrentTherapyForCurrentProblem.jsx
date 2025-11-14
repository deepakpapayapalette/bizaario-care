
import React from 'react';
import { Plus, Edit } from 'lucide-react';
import { useEffect, useState } from 'react'
import { TextField, Select, MenuItem, FormControl, Button, } from '@mui/material';
import api from '../../../../../api'
import Swal from 'sweetalert2';
import UniqueLoader from '../../../../loader';
import { customMenuProps } from '../../../../../utils/mui_select_scroll_bar';
import { Modal, } from 'react-bootstrap';



const CurrentTherapyForCurrentProblem = ({ patientId, selected_case_file, case_file_data, onRefresh }) => {

  const doctordetails = JSON.parse(localStorage.getItem("user"))



  const [medical_history, setmedical_history] = useState({
    Therapies: [{
      TherapyName: "",
      PatientResponse: ""
    }]

  });

  //========================== modal open or close start==========================================

  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  //=========================== modal open or close end===============================================
  // ===============================onchange events for therapy start============================


  const handleTherapyChange = (index, field, value) => {
    setmedical_history(prev => {
      const updatedTherapy = [...prev.Therapies];
      const newtherapy = { ...updatedTherapy[index] };


      newtherapy[field] = value;

      updatedTherapy[index] = newtherapy;

      return {
        ...prev,
        Therapies: updatedTherapy
      };
    });
  };

  // ===============================get all therapy data(change for medical speciality)====================================

  const [all_therapy_master, setall_therapy_master] = useState([])
  const getall_therapy_master = async () => {
    try {
      const resp = await api.post('api/v1/admin/LookupList/', { lookupcodes: "therapy_type" })


      setall_therapy_master(resp.data.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getall_therapy_master()

  }, [])

  //======================================= add more function====================================

  const handleAddMoreClinicalTherapy = () => {
    setmedical_history(prev => ({
      ...prev,
      Therapies: [
        ...(prev.Therapies || []),
        { TherapyName: "", PatientResponse: "" }
      ],
    }));
  };

  const [isloading, setisloading] = useState(false)

  const save_therapy = async () => {
    setisloading(true);
    try {
      const payload =
      {
        ...medical_history,
        CaseFileId: patient_all_therapy[0]?.caseFileId._id,
        CreatedBy: doctordetails._id

      }
      const resp = await api.post(
        `api/v1/admin/medical-history/therapies/add-multiple`,
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


  const [patient_all_therapy, setpatient_all_therapy] = useState([])

  const getall_patient_medical_history = async () => {
    try {
      //  setLoadingSpeciality(true);
      const resp = await api.get(`api/v1/admin/medical-history/list?PatientId=${patientId}&Status=Ongoing`);


      const formatted = resp.data.data.list.map(item => ({
        caseFileId: item.CaseFileId,
        treatmentType: item.CaseFileId.TreatmentType,
        therapy: item.Therapies
      }));
      setpatient_all_therapy(formatted);



    } catch (error) {
      console.error(error);
    } finally {
      //  setLoadingSpeciality(false);
    }
  };

  useEffect(() => {
    getall_patient_medical_history()
  }, [])




  //========================================= edit==============================================

  const [showEdit, setShowEdit] = useState(false)

  const handleCloseEdit = () => {
    setShowEdit(false);
    setmedical_history({
      Therapies: [
        {
          TherapyName: "",
          PatientResponse: "",
        },
      ],
    });
  };


  const handleShowEdit = () => {
    if (patient_all_therapy && patient_all_therapy.length > 0) {
      const normalizedComplaints = patient_all_therapy[0].therapy.map(
        ({ createdAt, updatedAt, _id, ...cc }) => ({
          ...cc,
          TherapyName: cc.TherapyName ? typeof cc.TherapyName === "string" ?
            cc.TherapyName : cc.TherapyName._id : "",
          PatientResponse: cc.PatientResponse

        })
      );

      setmedical_history(prev => ({
        ...prev,
        Therapies: normalizedComplaints
      }));
    }

    setShowEdit(true);
  };


  const update_therapy = async () => {
    setisloading(true);
    try {
      const payload =
      {
        ...medical_history,
        CaseFileId: patient_all_therapy[0]?.caseFileId._id,
        UpdatedBy: doctordetails._id

      }
      const resp = await api.put(
        `api/v1/admin/medical-history/therapies/edit-multiple`,
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
    <div className="space ">
      {/* Header */}
      <div className="flex items-center justify-between mt-4 border-b border-gray-200">
        <h3 className="text-xxl font-semibold text-gray-900">
          Current Therapy (ies)
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

            <div className="bg-slate-600 text-white">
               <div className="grid grid-cols-2 gap-4 p-2">
                <div className="table-header">Therapy Name</div>
                <div className="table-header">Clinical Outcome/Patient's Response</div>
              </div>
            </div>


            <div className="divide-y divide-gray-200">
              {
              case_file_data?.length > 0 && case_file_data[0]?.Status === "Past" &&
              case_file_data[0]?.Therapies?.map((item, index) => (
                <div
                  key={item.id}
                  className={`grid grid-cols-2 gap-4 p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                >
                 <div className="text-sm text-gray-900 font-medium table-body">
                    {item?.TherapyName?.lookup_value || "—"}
                  </div>


                  <div className="text-sm text-gray-900 table-body">
                    {item?.PatientResponse || "—"}
                  </div>
                </div>
              ))}
            </div>
          </div> */}

      {/* Footer Note */}
      {/* <div className="p-4  border-t border-gray-200" style={{display:selected_case_file?"block":"none"}}>
            <p className="text-xs text-gray-600">
              1. Added By Dr Gaurav Pande (Cardiology) (Regards M1234), (Contact 8373915529, Date/ Time 20 Sep 2025, 11:57 AM IST, Noida
            </p>
          </div> */}

      {/* Show patient_all_cheif_complaints section only if case_file_data is empty */}
      {
        // (!case_file_data || case_file_data.length === 0) &&
        patient_all_therapy.map((caseFile, caseIndex) => (
          <div key={caseFile.caseFileId} className="mb-6">
            {/* Case File Header */}
            <h3 className="text-xl font-bold mb-2">
              {caseFile.caseFileId.TreatmentType} (Case File ID: {caseFile.caseFileId._id})-
              {new Date(caseFile.caseFileId.Date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </h3>

            {/* Table Header */}
            <div className="bg-[var(--button-back-color)] text-white">
              <div className="grid grid-cols-2 gap-4 p-2">
                <h3 className="table-header">Therapy Name</h3>
                <h3 className="table-header">Clinical Outcome/Patient's Response</h3>

              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {caseFile.therapy.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-2 gap-4 p-4 ${index % 2 === 0 ? "bg-[#f2f3f6]" : "bg-white"
                    }`}
                >



                  <div className="text-sm text-gray-900 font-medium table-body">
                    {item?.TherapyName?.lookup_value || "—"}
                  </div>

                  {/* Duration */}
                  <div className="text-sm text-gray-900 table-body">
                    {item?.PatientResponse || "—"}
                  </div>




                </div>
              ))}
            </div>
          </div>
        ))}



      <Modal show={show} onHide={handleClose} centered size="lg">

        <Modal.Header closeButton>
          <Modal.Title className='form-title'>Add Medical History(Therapy (ies))</Modal.Title>
        </Modal.Header>
        <Modal.Body>


          <div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">

              {/*==================================== add therapy============================================ */}

              <div className='col-span-2'>


                {medical_history.Therapies.map((details, index) => (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 ">


                    <FormControl fullWidth size="small">
                      <label className="form-label">Therapy Name </label>
                      <Select
                        labelId="content-type-label"
                        name="TherapyName"
                        value={details.TherapyName}
                        onChange={(e) => handleTherapyChange(index, "TherapyName", e.target.value,)}
                        displayEmpty
                        MenuProps={customMenuProps}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <span style={{ color: "#9ca3af" }}>Therapy Name </span>;
                          }
                          return all_therapy_master?.find((item) => item._id === selected)?.lookup_value;
                        }}
                      >
                        <MenuItem value="">
                          <em>Therapy Name</em>
                        </MenuItem>
                        {all_therapy_master?.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.lookup_value}
                          </MenuItem>
                        ))}
                      </Select>

                    </FormControl>

                    <FormControl fullWidth size="small">
                      <label className="form-label">Patient’s Response  </label>
                      <TextField
                        type='text'
                        placeholder="Patient Response"
                        name="PatientResponse"
                        size="small"
                        value={details.PatientResponse}
                        onChange={(e) => handleTherapyChange(index, "PatientResponse", e.target.value,)}
                      />
                    </FormControl>





                    <div className="flex justify-between mt-2">
                      <Button
                        style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                        onClick={handleAddMoreClinicalTherapy}
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
                onClick={save_therapy}
              >
                Save
              </Button>
            </div>


          </div>

        </Modal.Body>


      </Modal>



      {/*================================== edit modal ============================================*/}


      <Modal show={showEdit} onHide={handleCloseEdit} centered size="lg">

        <Modal.Header closeButton>
          <Modal.Title className='form-title'>Add Medical History(Therapy (ies))</Modal.Title>
        </Modal.Header>
        <Modal.Body>


          <div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">

              {/*==================================== add therapy============================================ */}

              <div className='col-span-2'>


                {medical_history.Therapies.map((details, index) => (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 ">


                    <FormControl fullWidth size="small">
                      <label className="form-label">Therapy Name </label>
                      <Select
                        labelId="content-type-label"
                        name="TherapyName"
                        value={details.TherapyName}
                        onChange={(e) => handleTherapyChange(index, "TherapyName", e.target.value,)}
                        displayEmpty
                        MenuProps={customMenuProps}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <span style={{ color: "#9ca3af" }}>Therapy Name </span>;
                          }
                          return all_therapy_master?.find((item) => item._id === selected)?.lookup_value;
                        }}
                      >
                        <MenuItem value="">
                          <em>Therapy Name</em>
                        </MenuItem>
                        {all_therapy_master?.map((type) => (
                          <MenuItem key={type._id} value={type._id}>
                            {type.lookup_value}
                          </MenuItem>
                        ))}
                      </Select>

                    </FormControl>

                    <FormControl fullWidth size="small">
                      <label className="form-label">Patient’s Response  </label>
                      <TextField
                        type='text'
                        placeholder="Patient Response"
                        name="PatientResponse"
                        size="small"
                        value={details.PatientResponse}
                        onChange={(e) => handleTherapyChange(index, "PatientResponse", e.target.value,)}
                      />
                    </FormControl>

                    <div className="flex justify-between mt-2">
                      <Button
                        style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                        onClick={handleAddMoreClinicalTherapy}
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
                onClick={update_therapy}
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

export default CurrentTherapyForCurrentProblem

