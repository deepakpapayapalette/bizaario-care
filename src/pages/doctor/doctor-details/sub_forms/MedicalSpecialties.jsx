import React, { useEffect, useState } from 'react'
import { TextField, Grid, Select, Chip, MenuItem, FormControl, InputLabel, Button, Radio, FormControlLabel, RadioGroup, FormLabel } from '@mui/material';
// import api from '../../../../api'
import Swal from 'sweetalert2';
import UniqueLoader from '../../../../components/common/UniqueLoader';
import { __postApiData, __putApiData, __getApiData } from '@utils/api';

export default function MedicalSpecialties() {
  const [isloading_for, setisloading_for] = useState(false)
  const [MedicalSpecialties, setMedicalSpecialties] = useState([]);
  const [Specialization, setSpecialization] = useState([]);
  const [currentSpecialization, setCurrentSpecialization] = useState("");
  // Add a new specialization
  const addSpecialization = () => {
    const value = currentSpecialization.trim();
    if (!value) return; // ignore empty input
    setSpecialization((prev) => [...prev, value]);
    setCurrentSpecialization(""); // clear input
  };

  // Remove specialization by index
  const removeSpecialization = (index) => {
    setSpecialization((prev) => prev.filter((_, i) => i !== index));
  };

  //=========================== get all list of medical speciality================================
  const [allmedical_speciality, setallmedical_speciality] = useState([])
  const getallmedical_speciality = async () => {
    try {
      const resp = await __postApiData('/api/v1/admin/LookupList', { lookupcodes: "medical_speciality" })
      setallmedical_speciality(resp.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getallmedical_speciality()

  }, [])

  const handleMedicalSpecialtiesChange = (event) => {
    const { value } = event.target;

    // Material-UI returns a string if autofill or comma-separated
    setMedicalSpecialties(typeof value === "string" ? value.split(",") : value);
  };


  const doctor_details = JSON.parse(localStorage.getItem("user"))

  const save_medical_specialities = async () => {
    setisloading_for(true)
    try {

      const payload = { MedicalSpecialties, Specialization };

      const resp = await __putApiData(`/api/v1/asset-sections/medical-specialties/${doctor_details._id}`, payload,
        // {
        //   headers: { "Content-Type": "application/json" },
        // }
      )
      console.log(resp, "resp65")
      if (resp?.response?.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Details Updated",
          text: "Medical Specialities Details Updated Successfully...",
          showConfirmButton: true,
          customClass: {
            confirmButton: 'my-swal-button',
          },
        }).then(() => {
          window.location.reload()
        })
      }
      console.log(resp);


    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "error ",
        text: error.message,
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

  // ======================get medical specialities data====================================

  const get_medical_specialties = async () => {
    try {
      const resp = await __getApiData(`/api/v1/asset-sections/medical-specialties/${doctor_details._id}`);
      console.log(resp);

      if (resp.data) {
        const selectedIds = resp.data.MedicalSpecialties.map(item =>
          typeof item === "string" ? item : item._id
        );
        setMedicalSpecialties(selectedIds);
        setSpecialization(resp.data.Specialization)
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    get_medical_specialties()
  }, [])




  return (
    <>
      <div >

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

          <FormControl fullWidth size="small">
            <label className="form-label">Medical Specialties</label>
            <Select
              multiple
              name="MedicalSpecialties"
              value={MedicalSpecialties} // must be an array
              onChange={handleMedicalSpecialtiesChange}
              MenuProps={{
                disablePortal: true,
                disableScrollLock: true,
              }}
              displayEmpty
              renderValue={(selected) => {
                if (selected.length === 0) {
                  return <span style={{ color: "#9ca3af" }}>Medical Specialties</span>;
                }
                // Map over selected IDs and get their lookup_value
                return selected
                  .map((id) => {
                    const item = allmedical_speciality.find((opt) => opt._id === id);
                    return item ? item.lookup_value : "";
                  })
                  .join(", ");
              }}
            >
              {allmedical_speciality.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.lookup_value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/*
          <FormControl fullWidth size="small">
            <label className="form-label">Specialization</label>
            <TextField
            placeholder="Specialization"
            name="NoOfLecturesDelivered"
            size="small"
            value={Specialization}
            // onChange={handleChange}
            />
            </FormControl> */}

          <FormControl fullWidth size="small">
            <label variant="subtitle1" className='form-label'>
              Specialization
            </label>
            <div className="flex space-x-2">
              <TextField
                placeholder="Add Specialization"
                value={currentSpecialization}
                onChange={(e) => setCurrentSpecialization(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSpecialization()}
                fullWidth
                size="small"
              />
              <Button
                onClick={addSpecialization}
                variant="outlined"
              // startIcon={<AddIcon />}
              >
                Add
              </Button>
            </div>
            {Specialization.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {Specialization.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => removeSpecialization(index)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </div>
            )}
          </FormControl>





        </div>


        <div className="flex justify-end gap-3 mt-4">
          <Button style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }} onClick={save_medical_specialities}>Save</Button>
        </div>

      </div>

      {/* <div className="bg-white rounded-xl shadow p-4">
                  <h3 className="font-semibold mb-4">Preview</h3>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold">Medical Specialties Details</p>

                  </div>
                  <div className="flex items-center gap-3 mb-4">

                    <div>

                      <div className="text-sm text-gray-600  flex-wrap gap-x-6 text-[12px]">
                        <p>Medical Specialties : <span  className="text-[#000000] font-semibold">{MedicalSpecialties?.join(',') || ""}</span></p><br></br>

                      </div>
                    </div>
                  </div>


                </div> */}




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


    </>
  )
}



