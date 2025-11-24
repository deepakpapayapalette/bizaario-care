import React, { useEffect, useState } from 'react'
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Radio, FormControlLabel, RadioGroup, FormLabel } from '@mui/material';
import { __postApiData, __putApiData } from '@utils/api';
import api from '../../../../api'
import Swal from 'sweetalert2';
import { __getApiData } from '../../../../utils/api';


export default function AddressDetails() {

  const [isloading_for, setisloading_for] = useState(false)
  const [address, setaddress] = useState({
    AddressLine1: '',
    AddressLine2: '',
    PostalCode: '',
    GeoLocation: { type: "Point", coordinates: [0, 0] },

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setaddress({ ...address, [name]: value });
  };


  const doctor_details = JSON.parse(localStorage.getItem("user"))

  const save_address = async () => {
    setisloading_for(true)
    try {
      const resp = await __putApiData(`/api/v1/asset-sections/address/${doctor_details._id}`, address,
        // {
        //   headers: { "Content-Type": "application/json" },
        // }
      )
      if (resp.status === 200) {
        console.log(resp, "resp");
        Swal.fire({
          icon: "success",
          title: "Details Updated",
          text: "Address Details Updated Successfully...",
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

  //================================ get address details=========================================


  const get_address_details = async () => {
    try {
      const resp = await __getApiData(`/api/v1/asset-sections/address/${doctor_details._id}`)
      if (resp.data) {
        const { _id, ...rest } = resp.data;
        setaddress(rest);
      }
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    get_address_details()
  }, [])

  console.log(address);


  return (
    <>
      <div >

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <FormControl fullWidth size="small">
            <label className="form-label">Address Line 1</label>
            <TextField
              placeholder="Address Line 1"
              name="AddressLine1"
              size="small"
              value={address.AddressLine1}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Address Line 2</label>
            <TextField
              placeholder="Address Line 2"
              name="AddressLine2"
              size="small"
              value={address.AddressLine2}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Postal Code</label>
            <TextField
              placeholder="Postal Code"
              name="PostalCode"
              size="small"
              value={address.PostalCode}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">GeoLocation (lat,lng)</label>
            <TextField
              size="small"
              placeholder="GeoLocation (lat,lng)"
              value={
                address.GeoLocation?.coordinates?.length === 2
                  ? `${address.GeoLocation.coordinates[1]},${address.GeoLocation.coordinates[0]}`
                  : ""
              }
              onChange={(e) => {
                const [latStr, lngStr] = e.target.value.split(",");
                const lat = parseFloat(latStr);
                const lng = parseFloat(lngStr);

                if (!isNaN(lat) && !isNaN(lng)) {
                  setaddress((prev) => ({
                    ...prev,
                    GeoLocation: { type: "Point", coordinates: [lng, lat] }, // GeoJSON format
                  }));
                }
              }}
            />
          </FormControl>


        </div>


        <div className="flex justify-end gap-3 mt-4">
          <button className='theme-btn-fill' onClick={save_address}>
            <div className='px-20' >Save</div>
          </button>
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
                    <p className="font-semibold">Address Details</p>

                  </div>
                  <div className="flex items-center gap-3 mb-4">

                    <div>

                      <div className="text-sm text-gray-600  flex-wrap gap-x-6 text-[12px]">
                        <p>Address Line 1 : <span  className="text-[#000000] font-semibold">{address?.AddressLine1 || ""}</span></p><br></br>
                        <p>Address Line 2 : <span  className="text-[#000000] font-semibold">{address?.AddressLine2 || ""}</span></p><br></br>
                        <p>Postal Code : <span  className="text-[#000000] font-semibold">{address?.PostalCode || ""}</span></p><br></br>
                        <p>Geo Location : <span  className="text-[#000000] font-semibold">{address?.GeoLocation.coordinates.join(',') || ""}</span></p>

                      </div>
                    </div>
                  </div>


                </div> */}






    </>
  )
}



