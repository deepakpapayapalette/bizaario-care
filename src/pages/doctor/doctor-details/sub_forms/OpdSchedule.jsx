import React, { useEffect, useState } from 'react'
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Radio, FormControlLabel, RadioGroup, FormLabel } from '@mui/material';
// import api from '../../../../api'
import Swal from 'sweetalert2';
// import UniqueLoader from '../../../loader';

export default function OpdSchedule() {

  const[isloading_for,setisloading_for]=useState(false)

  const [opd_schedule, setopd_schedule] = useState([{
    OPDDay: '',
    OPDTimeFrom: '',
    OPDTimeTo: '',
    AvailableSlots: '',
  }]);



  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newopd = [...opd_schedule];

    newopd[index][name] = value;

    setopd_schedule(newopd);
  }

    // Add new package form
  const addMore = () => {
    setopd_schedule([
      ...opd_schedule,
      {
        OPDDay: '',
        OPDTimeFrom: '',
        OPDTimeTo: '',
        AvailableSlots: '',
      },
    ]);
  };



  const doctor_details=JSON.parse(localStorage.getItem("user"))

 const save_opd_details = async () => {
  setisloading_for(true)
  try {
     const payload = opd_schedule.map(({ _id, ...rest }) => rest);
    const resp = await api.put(
      `api/v1/asset-sections/opd-schedule/${doctor_details._id}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log(resp);

    // Check response_code instead of HTTP status
    if (resp.data?.response?.response_code === "200") {
      Swal.fire({
        icon: "success",
        title: "Details Updated",
        text: "Doctor OPD Details Updated Successfully...",
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
  finally
  {
    setisloading_for(false)
  }
};

// ===================================get all opd details==========================================

const get_opd_scheduled=async()=> {
  try {
    const resp = await api.get(
      `api/v1/asset-sections/opd-schedule/${doctor_details._id}`
    );

    console.log(resp);

    if (resp.data?.data) {

      setopd_schedule(resp.data.data.OPDSchedule);
    }
  } catch (error) {
    console.log(error);
  }
};


  useEffect(()=>
  {
    get_opd_scheduled()
  },[])


// =====================================delete opd schedule===========================================

const delete_opd_scheduled=async(id)=>
  {
    try {
      const resp=await api.delete(`api/v1/asset-sections/opd-schedule/${doctor_details._id}/${id}`)

       if(resp.status===200)
          {
             Swal.fire({
              icon:"success",
              title:"Profile Updated",
              text:resp.data.data.message,
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

    }
  }





  return (
    <>


      <div >

           {opd_schedule?.map((opd, index) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">


          <FormControl fullWidth size="small" >
              <label className='form-label'>OPD Day</label>
              <Select
                name="OPDDay"
                value={opd.OPDDay}
                onChange={(e)=>handleChange(index,e)}
                MenuProps={{
                  disablePortal: true,
                  disableScrollLock: true,
                }}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: "#9ca3af" }}>OPD Day</span>; // grey placeholder
                  }
                  return opd.OPDDay=== selected?opd.OPDDay:"";
                }}
              >
                 <MenuItem value="">
                    <em>Select OPD Day</em>
                  </MenuItem>

                <MenuItem value="Monday"> Monday</MenuItem>
                <MenuItem value="Tuesday"> Tuesday</MenuItem>
                <MenuItem value="Wednesday"> Wednesday</MenuItem>
                <MenuItem value="Thursday"> Thursday</MenuItem>
                <MenuItem value="Friday"> Friday</MenuItem>
                <MenuItem value="Saturday"> Saturday</MenuItem>
                <MenuItem value="Sunday"> Sunday</MenuItem>

              </Select>
            </FormControl>


             <FormControl fullWidth size="small" >
              <label className='form-label'>OPD Time From</label>
            <TextField
            placeholder="OPD Time From"
            name="OPDTimeFrom"
            size="small"
            value={opd.OPDTimeFrom}
            onChange={(e)=>handleChange(index,e)}
            />
            </FormControl>

             <FormControl fullWidth size="small" >
              <label className='form-label'>OPD Time From</label>
            <TextField
            placeholder="OPD Time To"
            name="OPDTimeTo"
            size="small"
            value={opd.OPDTimeTo}
            onChange={(e)=>handleChange(index,e)}
            />
          </FormControl>

              <FormControl fullWidth size="small" >
              <label className='form-label'>Available Slots</label>
            <TextField
            type='number'
            placeholder="Available Slots"
            name="AvailableSlots"
            size="small"
            value={opd.AvailableSlots}
            onChange={(e)=>handleChange(index,e)}
            />
            </FormControl>

           <FormControl fullWidth size="small" >
                <label className='form-label' style={{visibility:"hidden"}}>.</label>
              <button
              style={{fontFamily:"Lora"}}
                type="button"
                onClick={() => delete_opd_scheduled(opd._id)}
                className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm sm:text-base w-[155px] whitespace-nowrap"
              >
                {/* <span className="material-icons text-red-500 text-xl">delete</span> */}
                Delete Schedule
              </button>
       </FormControl>

          </div>
             ))}

        </div>

          <div className="flex justify-between mt-4">
            <Button variant="outlined" onClick={addMore}>Add More</Button>

            <Button style={{backgroundColor:"#52677D",fontFamily:"Lora",color:"white"}} onClick={save_opd_details}>Save</Button>

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
                    <p className="font-semibold">OPD Schedule</p>

                  </div>
                  <div className="flex items-center gap-3 mb-4">

                    <div>


                    {opd_schedule.map((opd, index) => (
                      <div className="text-sm text-gray-600  flex-wrap gap-x-6 text-[12px]">
                        <p>OPD Day : <span  className="text-[#000000] font-semibold">{opd?.OPDDay || ""}</span></p><br></br>
                        <p>OPD Time From : <span  className="text-[#000000] font-semibold">{opd?.OPDTimeFrom || ""}</span></p><br></br>
                        <p>OPD Time To : <span  className="text-[#000000] font-semibold">{opd?.OPDTimeTo || ""}</span></p><br></br>
                        <p>Available Slots : <span  className="text-[#000000] font-semibold">{opd?.AvailableSlots || ""}</span></p><br></br>

                      </div>
                    ))}
                    </div>
                  </div>


                </div> */}






    </>
    )
}




