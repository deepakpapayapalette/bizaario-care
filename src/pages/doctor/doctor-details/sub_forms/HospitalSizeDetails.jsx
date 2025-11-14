import React, { useEffect, useState } from 'react'
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Radio, FormControlLabel, RadioGroup, FormLabel } from '@mui/material';
// import api from '../../../../api'
import { __postApiData, __putApiData } from '@utils/api';
import Swal from 'sweetalert2';
// import UniqueLoader from '../../../loader';

export default function HospitalSizeDetails() {

  const [isloading_for, setisloading_for] = useState(false)
  const [hospital_size, sethospital_size] = useState({
    NumberOfDepartments: '',
    NumberOfDoctors: '',
    NumberOfConsultingPhysicians: '',
    NumberOfNursingStaff: '',
    NumberOfBeds: '',
    NumberOfICUBeds: '',
    NumberOfOTs: '',
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    sethospital_size({ ...hospital_size, [name]: value });
  };


  const doctor_details = JSON.parse(localStorage.getItem("user"));
  console.log(doctor_details);



  const save_hospital_size = async () => {
    setisloading_for(true)
    try {
      const resp = await __putApiData(`/api/v1/asset-sections/hospital-size/${doctor_details._id}`, hospital_size,
        //     {
        //   headers: { "Content-Type": "application/json" },
        // }
      )
      console.log(resp);

      if (resp.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Details Updated",
          text: "Hospital Size Details Updated Successfully...",
          showConfirmButton: true,
          customClass: {
            confirmButton: 'my-swal-button',
          },
        }).then(() => {
          window.location.reload()
        })
      }

    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "error ",
        text: error.response.data.message,
        showConfirmButton: true,
        customClass: {
          confirmButton: 'my-swal-button',
        },
      })

    }
    finally {
      setisloading_for(false)
    }
  }


  //=========================== update hospital_size=========================================

  const get_hospital_size = async () => {
    try {
      const resp = await __postApiData(`/api/v1/asset-sections/hospital-size/${doctor_details._id}`)
      if (resp.data) {
        // ✅ remove _id from API response before setting state
        const { _id, ...rest } = resp.data;
        sethospital_size(rest);
      }

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    // get_hospital_size()
  }, [])



  return (
    <>
      <div >

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <FormControl fullWidth size="small">
            <label className="form-label">Number Of Departments</label>
            <TextField
              type='number'
              placeholder="Number Of Departments"
              name="NumberOfDepartments"
              size="small"
              value={hospital_size.NumberOfDepartments}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Number Of Doctors</label>
            <TextField
              type='number'
              placeholder="Number Of Doctors"
              name="NumberOfDoctors"
              size="small"
              value={hospital_size.NumberOfDoctors}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Number Of Consulting Physicians</label>
            <TextField
              type='number'
              placeholder="Number Of Consulting Physicians"
              name="NumberOfConsultingPhysicians"
              size="small"
              value={hospital_size.NumberOfConsultingPhysicians}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Number Of Nursing Staff</label>
            <TextField
              type='number'
              placeholder="Number Of Nursing Staff"
              name="NumberOfNursingStaff"
              size="small"
              value={hospital_size.NumberOfNursingStaff}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Number Of Beds</label>
            <TextField
              type='number'
              placeholder="Number Of Beds"
              name="NumberOfBeds"
              size="small"
              value={hospital_size.NumberOfBeds}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Number Of ICU Beds</label>
            <TextField
              type='number'
              placeholder="Number Of ICU Beds"
              name="NumberOfICUBeds"
              size="small"
              value={hospital_size.NumberOfICUBeds}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Number Of OTs</label>
            <TextField
              type='number'
              placeholder="Number Of OTs"
              name="NumberOfOTs"
              size="small"
              value={hospital_size.NumberOfOTs}
              onChange={handleChange}
            />
          </FormControl>


        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }} onClick={save_hospital_size}>Save</Button>
        </div>

        {/* {isloading_for && (
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
        )} */}

      </div>

      {/* <div className="bg-white rounded-xl shadow p-4">
                  <h3 className="font-semibold mb-4">Preview</h3>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold">Hospital Size Details</p>

                  </div>
                  <div className="flex items-center gap-3 mb-4">

                    <div>

                      <div className="text-sm text-gray-600  flex-wrap gap-x-6 text-[12px]">
                        <p>Number Of Departments : <span  className="text-[#000000] font-semibold">{hospital_size?.NumberOfDepartments || ""}</span></p><br></br>
                        <p>Number Of Doctors : <span  className="text-[#000000] font-semibold">{hospital_size?.NumberOfDoctors || ""}</span></p><br></br>
                        <p>Number Of Consulting Physicians : <span  className="text-[#000000] font-semibold">{hospital_size?.NumberOfConsultingPhysicians || ""}</span></p><br></br>
                        <p>Number Of Nursing Staff : <span  className="text-[#000000] font-semibold">{hospital_size?.NumberOfNursingStaff || ""}</span></p><br></br>
                        <p>Number Of Beds : <span  className="text-[#000000] font-semibold">{hospital_size?.NumberOfBeds || ""}</span></p><br></br>
                        <p>Number Of ICU Beds : <span  className="text-[#000000] font-semibold">{hospital_size?.NumberOfICUBeds || ""}</span></p><br></br>
                        <p>Number Of OTs : <span  className="text-[#000000] font-semibold">{hospital_size?.NumberOfOTs || ""}</span></p>
                      </div>
                    </div>
                  </div>
                </div> */}
    </>
  )
}



