
import React from 'react';
import { Plus, Edit } from 'lucide-react';

import { useEffect, useState } from 'react'
import { TextField, Select, MenuItem, FormControl, Button, Dialog, } from '@mui/material';
import Swal from 'sweetalert2';
import { __postApiData, __putApiData, __getApiData } from "@utils/api";

import { customMenuProps } from '@utils/CustomMenuProps';
import UniqueLoader from '../../../common/UniqueLoader';

const CurrentTheripes = ({ patientId, selected_case_file, case_file_data, onRefresh }) => {
  const doctordetails = JSON.parse(localStorage.getItem("user"))
  const [current_therapy, setcurrent_therapy] = useState({
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
    setcurrent_therapy(prev => {
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
      const resp = await __postApiData('/api/v1/admin/LookupList/', { lookupcodes: "therapy_type" })
      setall_therapy_master(resp.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getall_therapy_master()

  }, [])

  //======================================= add more function====================================

  const handleAddMoreClinicalTherapy = () => {
    setcurrent_therapy(prev => ({
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
        ...current_therapy,
        PatientId: patientId,

      }
      const resp = await __postApiData(`/api/v1/admin/patient/current-therapy/add`,
        payload,
      );

      console.log(resp);

      const { response_code, response_message } = resp.response;

      if (response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Details Added",
          text: "Patient Current Therapy Added Successfully...",
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
          text: response_message.error || response_message,
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

  const getpatient_therapy = async () => {
    try {
      //  setLoadingSpeciality(true);
      const resp = await __getApiData(`/api/v1/admin/patient/current-therapies/list?PatientId=${patientId}`);
      setpatient_all_therapy(resp.data);

    } catch (error) {
      console.error(error);
    } finally {
      //  setLoadingSpeciality(false);
    }
  };

  useEffect(() => {
    getpatient_therapy()
  }, [])

  //======================================= edit modal============================================

  const [showEdit, setshowEdit] = useState(false)
  const handleShowEdit = async () => {
    setshowEdit(true);
    setcurrent_therapy({ ...current_therapy, Therapies: patient_all_therapy })


  }
  const handleCloseEdit = () => setshowEdit(false);


  const update_therapy = async () => {
    setisloading(true);
    try {
      const payload =
      {
        ...current_therapy,
        PatientId: patientId,
      }
      const resp = await __postApiData(`/api/v1/admin/patient/current-therapy/edit`,
        payload,

      );
      const { response_code, response_message } = resp.response;
      if (response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Details Added",
          text: "Patient Current Therapy Added Successfully...",
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

  const handleRemoveTherapy = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This therapy will be removed from the list.",
      icon: "warning",
      // showCancelButton: true,
      confirmButtonColor: "#52677D",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove it!",
      customClass: { confirmButton: "my-swal-button" },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTherapies = [...current_therapy.Therapies];
        updatedTherapies.splice(index, 1);
        setcurrent_therapy({ Therapies: updatedTherapies });

        Swal.fire({
          title: "Removed!",
          text: "Therapy has been removed.",
          icon: "success",
          customClass: {
            confirmButton: "my-swal-button", // your custom CSS class
          },
        });

      }
    });
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


      {/* Table Header */}
      {/* Table Header */}
      <div className="bg-webprimary text-white">
        <div className="grid grid-cols-2 gap-4 p-2">
          <h3 className="table-header text-left font-semibold">
            Therapy Name
          </h3>
          <h3 className="table-header text-left font-semibold">
            Clinical Outcome / Patient's Response
          </h3>
        </div>
      </div>

      {/* Table Body */}
      {patient_all_therapy && patient_all_therapy.length > 0 ? (
        patient_all_therapy.map((item, index) => (
          <div
            key={index}
            className={`grid grid-cols-2 gap-4 p-4 ${index % 2 === 0 ? "bg-[#f2f3f6]" : "bg-white"
              }`}
          >
            {/* Column 1: Therapy Name */}
            <div className="text-sm text-gray-900 font-medium text-left table-body">
              {item?.TherapyName?.lookup_value || "—"}
            </div>

            {/* Column 2: Patient Response */}
            <div className="text-sm text-gray-900 text-left table-body">
              {item?.PatientResponse || "—"}
            </div>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">No data available</div>
      )}



      <Dialog
        open={show}
        onClose={handleClose}
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
          <h2 className='mb-2'>Add Medical History(Therapy (ies))</h2>

          <div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">

              {/*==================================== add therapy============================================ */}

              <div className='col-span-2'>


                {current_therapy.Therapies.map((details, index) => (
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
        </div>
      </Dialog>

      <Dialog
        open={showEdit}
        onClose={handleCloseEdit}
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
          <h2 className='mb-2'>Edit Medical History (Therapy)</h2>
          <div className="border border-gray-300 rounded-lg p-4">
            <div className='col-span-2'>


              {current_therapy.Therapies.map((details, index) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 ">


                  <FormControl fullWidth size="small">
                    <label className="form-label">Therapy Name </label>
                    <Select
                      labelId="content-type-label"
                      name="TherapyName"
                      value={details?.TherapyName?._id || details?.TherapyName}
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
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveTherapy(index)}
                    >
                      Remove
                    </Button>
                  </div>

                </div>

              ))}

            </div>

            <div className="flex justify-between mt-4">

              <Button
                style={{ backgroundColor: '#52677D', fontFamily: 'Lora', color: 'white' }}
                onClick={handleAddMoreClinicalTherapy}
              >
                Add More
              </Button>

              <Button
                style={{ backgroundColor: '#52677D', fontFamily: 'Lora', color: 'white' }}
                onClick={update_therapy}
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

export default CurrentTheripes

