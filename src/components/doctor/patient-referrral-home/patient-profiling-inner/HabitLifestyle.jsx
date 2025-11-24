
import React from 'react';
import { Plus, Edit } from 'lucide-react';
import { useEffect, useState } from 'react'
import { TextField, Select, MenuItem, FormControl, Button, Dialog, } from '@mui/material';
// import api from '../../../../../api'
// import Swal from 'sweetalert2';
// import UniqueLoader from '../../../../loader';
// import { customMenuProps } from '../../../../../utils/mui_select_scroll_bar';
// import { Modal, } from 'react-bootstrap';
// import { __postApiData } from "../../../../../utils/api";

import { __postApiData, __putApiData, __getApiData } from "@utils/api";
import Swal from 'sweetalert2';
import UniqueLoader from '@components/common/UniqueLoader';
// import UniqueLoader from '../../common/UniqueLoader';
// import { customMenuProps } from '@utils/CustomMenuProps';

const HabitLifestyle = ({ patientId, selected_case_file, case_file_data, onRefresh }) => {
  const doctordetails = JSON.parse(localStorage.getItem("user"))
  const [habit_lifestyle, sethabit_lifestyle] = useState({
    HabitLifestyleItem: []
  });
  //========================== modal open or close start==========================================

  const [show, setShow] = useState(false)
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const toggleArrayField = (field, itemId) => {
    sethabit_lifestyle(prev => {
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

  //======================= get all data of habit master=========================================

  const [allhabit, setallhabit] = useState([])
  const gethabit = async () => {
    try {

      const resp = await __postApiData('/api/v1/common/LookupList', { lookup_type: "habit_master" })

      setallhabit(resp?.data || []);

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    gethabit()

  }, [])







  const [isloading, setisloading] = useState(false)

  const save_habit_lifestyle = async () => {
    setisloading(true);
    try {
      const payload =
      {
        ...habit_lifestyle,
        PatientId: patientId,
      }


      const resp = await __postApiData(`/api/v1/admin/patient/habit-lifestyle/add`,
        payload,
      );



      const { response_code, response_message } = resp.response;

      if (response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Details Added",
          text: "Habit Lifestyle Added Successfully...",
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        }).then(() => {
          // window.location.reload();
          onRefresh();
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


  const [patient_all_habit_lifestyle, setpatient_all_habit_lifestyle] = useState([])

  const getall_patient_all_habit_lifestyle = async () => {
    try {
      //  setLoadingSpeciality(true);
      const resp = await __getApiData(`/api/v1/admin/patient/habit-lifestyle/list?PatientId=${patientId}`);
      setpatient_all_habit_lifestyle(resp.data);
    } catch (error) {
      console.error(error);
    } finally {
      //  setLoadingSpeciality(false);
    }
  };

  useEffect(() => {
    getall_patient_all_habit_lifestyle()
  }, [])


  // ================================== edit code===============================================

  const handleRemoveHabit = async (habitId, index) => {
    // Show confirmation first
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This habit lifestyle will be removed permanently!",
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
        const resp = await __postApiData('/api/v1/admin/patient/habit-lifestyle/remove',
          { PatientId: patientId, HabitLifestyleItem: habitId }
        );
        const { response_code, response_message } = resp.response;
        if (response_code === '200') {
          Swal.fire({
            icon: 'success',
            title: 'Removed',
            text: 'Habit Lifestyle removed successfully',
            customClass: { confirmButton: "my-swal-button" },
          });
          // Remove from local state to update UI
          const updatedLifestyle = [...patient_all_habit_lifestyle];
          updatedLifestyle.splice(index, 1);
          setpatient_all_habit_lifestyle(updatedLifestyle);
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
          Habit Lifestyle
        </h3>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 text-[var(--primary-color)] hover:text-blue-700 transition-colors">
            <span className="text-sm font-medium underline" onClick={handleShow}>Add</span>
            <Plus className="w-4 h-4" />
          </button>
          {/* <button className="flex items-center space-x-2 text-[var(--primary-color)] hover:text-blue-700 transition-colors">
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium underline">Edit</span>
          </button> */}
        </div>
      </div>


      {/* Show patient_all_cheif_complaints section only if case_file_data is empty */}
      {
        <div className="flex flex-wrap gap-2 mt-2">
          {patient_all_habit_lifestyle.map((item, index) => (

            <span className="px-3 py-1 bg-[#e2e4f4] text-sm rounded-md" key={index}>
              {item.lookup_value}
              <span
                className="ml-1 text-xs font-bold cursor-pointer text-red-500"
                onClick={() => handleRemoveHabit(item._id, index)}
              >
                ✕
              </span>
            </span>



          ))}
        </div>

      }



      {/* Footer Note */}
      <div className="p-4 bg-gray-50 border-t border-gray-200" style={{ display: selected_case_file ? "flex" : "none" }}>
        <p className="text-xs text-gray-600">
          1. Added By Dr Gaurav Pande (Cardiology) (Regards M1234), (Contact 8373915529, Date/ Time 20 Sep 2025, 11:57 AM IST, Noida
        </p>
      </div>

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
          <h2 className='mb-3'>Add Habit LifeStyle</h2>

          <div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">


              {/*======================== habit lifestyle ============================================ */}

              <div className='col-span-2'>
                <h5 className='form-title'>Habit Lifestyle</h5>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">
                  <div className="col-span-2">
                    <FormControl fullWidth size="small">
                      <label className="form-label">HabitLifestyle Item</label>
                      <div className="flex flex-wrap gap-2">
                        {allhabit.map((item) => {
                          const selected = habit_lifestyle.HabitLifestyleItem.includes(item._id);
                          return (
                            <span
                              key={item._id}
                              onClick={() => toggleArrayField("HabitLifestyleItem", item._id)}
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
                        })}
                      </div>
                    </FormControl>
                  </div>
                </div>


              </div>
            </div>



            <div className="flex justify-end mt-4">


              <Button
                style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                onClick={save_habit_lifestyle}
              >
                Save
              </Button>
            </div>


          </div>
        </div>
      </Dialog>






      {/* ===========================loader================================================ */}
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

export default HabitLifestyle

