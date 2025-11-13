import React, { useEffect, useState } from 'react'
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Radio, FormControlLabel, RadioGroup, FormLabel } from '@mui/material';
// import api from '../../../../api'
import Swal from 'sweetalert2';
// import UniqueLoader from '../../../loader';

export default function OnlineClinicLink({ initialData = {}, onPrevious, onNext }) {

  const[isloading_for,setisloading_for]=useState(false)

  const [OnlineClinicLink, setOnlineClinicLink] = useState('');


const handleChange = (e) => {
  const { value } = e.target;
  setOnlineClinicLink(value); // just store the value directly
};


 const doctor_details=JSON.parse(localStorage.getItem("user"))

 const save_online_clinic_link = async () => {
  setisloading_for(true)
  try {
    const payload={OnlineClinicLink}
    const resp = await api.put(
      `api/v1/asset-sections/online-clinic/${doctor_details._id}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log(resp);
    console.log(payload);


    // Check response_code instead of HTTP status
    if (resp.data?.response?.response_code === "200") {
      Swal.fire({
        icon: "success",
        title: "Details Updated",
        text: "Doctor Online Clinic Link Updated Successfully...",
        showConfirmButton: true,
        customClass: { confirmButton: "my-swal-button" },
      }).then(() => {
        window.location.reload();
      });
    } else {
      const errType = resp.data?.response?.response_message?.errorType || "Error";
      const errMsg = resp.data?.response?.response_message?.error || "Something went wrong";

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
  finally{
    setisloading_for(false)
  }
};


//============================== get online clinic details=======================================

const get_online_clinic=async()=>
  {
    try {
      const resp=await api.get(`api/v1/asset-sections/online-clinic/${doctor_details._id}`)
      console.log(resp);

         if (resp.data?.data) {
          const { _id, ...rest } = resp.data.data;
          setOnlineClinicLink(rest);
        }
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(()=>
  {
    get_online_clinic()
  },[])




  return (
    <>


       <div >

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <FormControl fullWidth size="small">
            <label className="form-label">Online Clinic Link</label>
            <TextField
            placeholder="Online Clinic Link"
            name="OnlineClinicLink"
            size="small"
            value={OnlineClinicLink.OnlineClinicLink}
            onChange={handleChange}
            />
        </FormControl>

          </div>
          </div>



           <div className="flex justify-end gap-3 mt-4">
              <Button style={{backgroundColor:"#52677D",fontFamily:"Lora",color:"white"}} onClick={save_online_clinic_link}>Save</Button>
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

           {/* <div className="bg-white rounded-xl shadow p-4">
                  <h3 className="font-semibold mb-4">Preview</h3>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold">Online Clinic Link</p>

                  </div>
                  <div className="flex items-center gap-3 mb-4">

                    <div>

                      <div className="text-sm text-gray-600  flex-wrap gap-x-6 text-[12px]">
                        <p>Online Clinic Link : <span  className="text-[#000000] font-semibold">{OnlineClinicLink.OnlineClinicLink || ""}</span></p><br></br>

                      </div>

                    </div>
                  </div>


                </div> */}

    </>
    )
}




