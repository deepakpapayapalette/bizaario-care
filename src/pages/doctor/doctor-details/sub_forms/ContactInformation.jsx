import React, { useEffect, useState } from 'react'
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Radio, FormControlLabel, RadioGroup, FormLabel } from '@mui/material';
import { __postApiData, __putApiData, __getApiData } from '@utils/api';
import Swal from 'sweetalert2';
import UniqueLoader from '../../../../components/common/UniqueLoader';
// import UniqueLoader from '../../../loader';

export default function ContactInformation() {

  const [isloading_for, setisloading_for] = useState(false)
  const [contact_details, setcontact_details] = useState({
    ContactName: '',
    ContactPhoneNumber: '',
    ContactEmailAddress: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setcontact_details({ ...contact_details, [name]: value });
  };

  const doctor_details = JSON.parse(localStorage.getItem("user"))

  const save_contact_information = async () => {
    setisloading_for(true)
    try {
      const resp = await __putApiData(
        `/api/v1/asset-sections/contact-info/${doctor_details._id}`,
        contact_details,
        // { headers: { "Content-Type": "application/json" } }
      );

      // Check response_code instead of HTTP status
      if (resp.response?.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Details Updated",
          text: "Doctor Contact Information Updated Successfully...",
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        }).then(() => {
          window.location.reload();
        });
      } else {
        const errType = resp.response?.response_message?.errorType || "Error";
        const errMsg = resp.response?.response_message?.error || "Something went wrong";

        Swal.fire({
          icon: "error",
          title: errType,
          text: errMsg,
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        });
      }
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Network/Error",
        text: error.message,
        showConfirmButton: true,
        customClass: { confirmButton: "my-swal-button" },
      });
    }
    finally {
      setisloading_for(false)
    }
  };


  //================================== get contact details=========================================

  const get_online_clinic = async () => {
    try {
      const resp = await __getApiData(`/api/v1/asset-sections/contact-info/${doctor_details._id}`)
      if (resp.data) {
        const { _id, ...rest } = resp.data;
        setcontact_details(rest);
      }
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    get_online_clinic()
  }, [])


  return (
    <>


      <div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

          <FormControl fullWidth size="small">
            <label className="form-label">Contact Name</label>
            <TextField
              placeholder="Contact Name"
              name="ContactName"
              size="small"
              value={contact_details.ContactName}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Contact Phone Number</label>
            <TextField
              placeholder="Contact Phone Number"
              name="ContactPhoneNumber"
              size="small"
              value={contact_details.ContactPhoneNumber}
              onChange={handleChange}
            />
          </FormControl>


          <FormControl fullWidth size="small">
            <label className="form-label">Contact Email Address</label>
            <TextField
              placeholder="Contact Email Address"
              name="ContactEmailAddress"
              size="small"
              value={contact_details.ContactEmailAddress}
              onChange={handleChange}
            />
          </FormControl>



        </div>



        <div className="flex justify-end gap-3 mt-4">
          <Button style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }} onClick={save_contact_information}>Save</Button>
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

      {/* <div className="bg-white rounded-xl shadow p-4">
                  <h3 className="font-semibold mb-4">Preview</h3>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold">Contact Details</p>
                  </div>
                  <div className="flex items-center gap-3 mb-4">

                    <div>


                      <div className="text-sm text-gray-600  flex-wrap gap-x-6 text-[12px]">
                        <p>Contact Name : <span  className="text-[#000000] font-semibold">{contact_details?.ContactName || ""}</span></p><br></br>
                        <p>Contact Phone Number : <span  className="text-[#000000] font-semibold">{contact_details?.ContactPhoneNumber || ""}</span></p><br></br>
                        <p>Contact Email Address : <span  className="text-[#000000] font-semibold">{contact_details?.ContactEmailAddress || ""}</span></p><br></br>

                      </div>

                    </div>
                  </div>


                </div> */}






    </>
  )
}



