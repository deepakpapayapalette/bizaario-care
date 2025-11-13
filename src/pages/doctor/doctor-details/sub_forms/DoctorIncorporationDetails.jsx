import React, { useState } from 'react'
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Box, alertTitleClasses } from '@mui/material';
// import userProfile from '../../../../assets/images/profile-image.png'
import { LuCloudUpload } from "react-icons/lu";
// import api from '../../../../api'
import Swal from 'sweetalert2';
// import UniqueLoader from '../../../loader';


const DoctorIncorporationDetails = ({handleChange, incorporationdetails}) => {

  const[isloading_for,setisloading_for]=useState(false

  )
  const doctor_details=JSON.parse(localStorage.getItem("user"))

  const save_incorporation_details=async()=>
  {
    setisloading_for(true)
    try {
      const resp=await api.put(`api/v1/asset-sections/incorporation-details/${doctor_details._id}`,incorporationdetails,
          {
        headers: { "Content-Type": "application/json" },
      }
      )
    if(resp.status===200)
       {
          Swal.fire({
           icon:"success",
           title:"Details Updated",
           text:"Doctor Incorporation Details Updated Successfully...",
           showConfirmButton:true,
           customClass: {
           confirmButton: 'my-swal-button',
         },
         }).then(()=>
         {
           window.location.reload()
         })
       }

    } catch (error) {
      console.log(error);
       Swal.fire({
            icon:"error",
            title:"error ",
            text:error.response.data.message,
            showConfirmButton:true,
              customClass: {
              confirmButton: 'my-swal-button',
            },
          })

    }
    finally
    {
      setisloading_for(false)
    }
  }



  return (
    <>
           <div >

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <FormControl fullWidth size="small">
          <label className="form-label">Registration Body</label>
          <TextField
            placeholder="Registration Body"
            name="RegistrationBody"
            size="small"
            value={incorporationdetails?.RegistrationBody}
            onChange={handleChange}
          />
          </FormControl>

          <FormControl fullWidth size="small">
          <label className="form-label">Registration Certificate</label>
          <TextField
           placeholder="Registration Certificate"
          name="RegistrationCertificate"
          size="small"
          value={incorporationdetails?.RegistrationCertificate}
          onChange={handleChange}
            />
            </FormControl>

          <FormControl fullWidth size="small">
          <label className="form-label">Registration Year</label>
          <TextField
           placeholder="Registration Year"
           type='number'
          name="RegistrationYear"
          size="small"
          value={incorporationdetails?.RegistrationYear}
          onChange={handleChange}
          />
          </FormControl>

          <FormControl fullWidth size="small">
          <label className="form-label">Registration Number</label>
          <TextField
          placeholder="Registration Number"
          name="RegistrationNumber"
          size="small"
          value={incorporationdetails?.RegistrationNumber}
          onChange={handleChange}
          />
          </FormControl>

          <FormControl fullWidth size="small">
          <label className="form-label">Validity Expiry</label>
          <TextField
          placeholder="Validity Expiry"
          type='date'
          InputLabelProps={{ shrink: true }}
          name="ValidityExpiry"
          size="small"
          value={
            incorporationdetails?.ValidityExpiry
              ? incorporationdetails.ValidityExpiry.split("T")[0] // ✅ converts "2025-09-11T..." → "2025-09-11"
              : ""
          }
          onChange={handleChange}
          />
          </FormControl>

        </div>


        <div className="flex justify-end gap-3 mt-4">
          <Button style={{backgroundColor:"#52677D",fontFamily:"Lora",color:"white"}} onClick={save_incorporation_details}>Save</Button>
        </div>

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
    </>
  )
}

export default DoctorIncorporationDetails
