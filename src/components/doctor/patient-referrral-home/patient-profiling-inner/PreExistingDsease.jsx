
import React from 'react';
import { Plus, Edit } from 'lucide-react';
import { useEffect, useState } from 'react'
import { CircularProgress, FormControl, Button, Dialog, } from '@mui/material';
// import api from '../../../../../api'
import Swal from 'sweetalert2';
import UniqueLoader from '../../../common/UniqueLoader';
// import UniqueLoader from '../../../../loader';
// import { Modal, } from 'react-bootstrap';
import { __postApiData, __putApiData, __getApiData } from "@utils/api";
import { customMenuProps } from '@utils/CustomMenuProps';


const PreExistingDisease = ({ patientId, selected_case_file, case_file_data, onRefresh }) => {

  const doctordetails = JSON.parse(localStorage.getItem("user"))


  const [pre_existing_disease, setpre_existing_disease] = useState({
    PreExistingDiseaseItem: []
  });


  //========================== modal open or close start==========================================

  const [show, setShow] = useState(false)
  const handleShow = () => {
    setShow(true);
    getall_disease_master()
  }
  const handleClose = () => setShow(false);


  //====================== onchage event for ChiefComplaints start=================================



  const toggleArrayField = (field, itemId) => {
    setpre_existing_disease(prev => {
      const currentArray = prev[field] || [];
      let updatedArray = [];

      if (currentArray.includes(itemId)) {
        // remove item
        updatedArray = currentArray.filter(id => id !== itemId);
      } else {
        // add item
        updatedArray = [...currentArray, itemId];
      }

      return {
        ...prev,
        [field]: updatedArray
      };
    });
  };


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





  const [isloading, setisloading] = useState(false)

  const save_preexisting_disease = async () => {
    setisloading(true);
    try {
      const payload =
      {
        ...pre_existing_disease,
        PatientId: patientId,
      }
      const resp = await __postApiData(`/api/v1/admin/patient/pre-existing-disease/add`,
        payload,
      );
      const { response_code, response_message } = resp.response;

      if (response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Details Added",
          text: "Pre Existing Disease Added Successfully...",
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

  const [all_pre_existing_disease, setall_pre_existing_disease] = useState([])
  const get_all_pre_existing_disease = async () => {
    try {
      //  setLoadingSpeciality(true);
      const resp = await __getApiData(`/api/v1/admin/patient/pre-existing-disease/list?PatientId=${patientId}`);
      setall_pre_existing_disease(resp.data);
    } catch (error) {
      console.error(error);
    } finally {
      //  setLoadingSpeciality(false);
    }
  };

  useEffect(() => {
    get_all_pre_existing_disease()
  }, [])



  //=========================================  edit code ==========================================

  const handleRemoveDisease = async (diseaseId, index) => {
    // Show confirmation first
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This disease will be removed permanently!",
      icon: 'warning',
      // showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!',
      // cancelButtonText: 'Cancel',
      customClass: { confirmButton: "my-swal-button" },
    });

    if (result.isConfirmed) {
      try {
        setisloading(true)
        const resp = await __postApiData('/api/v1/admin/patient/pre-existing-disease/remove',
          { PatientId: patientId, PreExistingDiseaseItem: diseaseId }
        );
        const { response_code, response_message } = resp.response;

        if (response_code === '200') {
          Swal.fire({
            icon: 'success',
            title: 'Removed',
            text: 'Disease removed successfully',
            customClass: { confirmButton: "my-swal-button" },
          });
          // Remove from local state to update UI
          const updatedDiseases = [...all_pre_existing_disease];
          updatedDiseases.splice(index, 1);
          setall_pre_existing_disease(updatedDiseases);
          onRefresh(); // optional: refresh parent data
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response_message.error || 'Something went wrong',
            customClass: { confirmButton: "my-swal-button" },
          });
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Request failed',
          text: error.message || 'Something went wrong',
          customClass: { confirmButton: "my-swal-button" },
        });
      }
      finally {
        setisloading(false)
      }
    }
  };

  return (
    <div className="space mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mt-2  border-b border-gray-200">
        <h3 className="text-xxl font-semibold text-gray-900">
          Pre Existing Disease (s)
        </h3>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-[var(--primary-color)] hover:text-blue-700 transition-colors">
            <span className="text-sm font-medium underline" onClick={handleShow}>Add</span>
            <Plus className="w-4 h-4" />
          </button>
          {/* <button className="flex items-center space-x-2 text-[var(--primary-color)] hover:text-blue-700 transition-colors">
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium underline" onClick={handleShowedit}>Edit</span>
          </button> */}
        </div>
      </div>

      {/* Table */}
      {
        <div className="flex flex-wrap gap-2 mt-2">
          {all_pre_existing_disease.map((item, index) => (

            <span className="px-3 py-1 bg-[#e2e4f4] text-sm rounded-md" key={index}>
              {item.lookup_value}
              <span
                className="ml-1 text-xs font-bold cursor-pointer text-red-500"
                onClick={() => handleRemoveDisease(item._id, index)}
              >
                ✕
              </span>
            </span>
          ))}
        </div>
      }
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
          <h2 className='mb-3'>Add Pre Existing Disease (s)</h2>
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">
              {/*======================== pre existing disease============================================ */}
              <div className='col-span-2'>
                <h5 className='form-title'>Pre Existing Disease</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">
                  <div className="col-span-2">
                    <FormControl fullWidth size="small">
                      <label className="form-label">Disease Name</label>
                      <div className="flex flex-wrap gap-2">
                        {loadingDiseases ?
                          (
                            <CircularProgress size={28} />
                          ) : all_disease_master.length > 0 ? (
                            all_disease_master.map((item) => {
                              const selected = pre_existing_disease.PreExistingDiseaseItem.includes(item._id);
                              return (
                                <span
                                  key={item._id}
                                  onClick={() => toggleArrayField("PreExistingDiseaseItem", item._id)}
                                  className={`px-3 py-1 text-sm rounded-md cursor-pointer flex items-center gap-2
                                ${selected ? 'bg-blue-500 text-white' : 'bg-[#e2e4f4] text-gray-800'}`}
                                >
                                  {item.lookup_value}
                                  {selected && (
                                    <span
                                      className="ml-1 text-xs font-bold cursor-pointer"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      ✕
                                    </span>
                                  )}
                                </span>
                              );
                            })
                          ) : (
                            <p className="text-gray-500 text-sm">No diseases found</p>
                          )}
                      </div>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                onClick={save_preexisting_disease}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Dialog>

      {/*=========================== loader======================================= */}

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

export default PreExistingDisease

