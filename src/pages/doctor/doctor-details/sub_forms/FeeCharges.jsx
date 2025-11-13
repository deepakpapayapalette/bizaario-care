import React, { useEffect, useState } from 'react'
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Radio, FormControlLabel, RadioGroup, FormLabel } from '@mui/material';
// import api from '../../../../api'
import Swal from 'sweetalert2';
// import UniqueLoader from '../../../loader';

export default function FeeCharges() {

  const[isloading_for,setisloading_for]=useState(false)

  const [feecharges, setfeecharges] = useState([{
    ServiceCategory: null,
    FeeCurrency: null,
    FeeAmount: '',
  }]);



const handleChange = (index, field, value) => {
  const updated = [...feecharges];
  updated[index][field] = value;
  setfeecharges(updated);
};



    // Add new package form
  const addMore = () => {
    setfeecharges([
      ...feecharges,
      {
        ServiceCategory: '',
        FeeCurrency: '',
        FeeAmount: '',
      },
    ]);
  };

  //============================== get all service category======================================

     const[allservice,setallservice]=useState([])
      const getallservice=async()=>
      {
        try {
          const resp=await api.post('api/v1/admin/LookupList',{ lookupcodes:"service_category"})
          setallservice(resp.data.data)

        } catch (error) {
          console.log(error);

        }
      }

      useEffect(()=>
      {
        getallservice()

      },[])

//====================================== get all currency type=======================================

   const[all_currency,setall_currency]=useState([])
      const get_all_currency=async()=>
      {
        try {
          const resp=await api.post('api/v1/admin/LookupList',{ lookupcodes:"currency_type"})
          setall_currency(resp.data.data)

        } catch (error) {
          console.log(error);

        }
      }

      useEffect(()=>
      {
        get_all_currency()

      },[])



  const doctor_details=JSON.parse(localStorage.getItem("user"))

 const save_fee_details = async () => {
  setisloading_for(true)
  try {
       const payload = feecharges.map(({ _id, ...rest }) => rest);
    const resp = await api.put(
      `api/v1/asset-sections/fees-charges/${doctor_details._id}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );



    // Check response_code instead of HTTP status
    if (resp.data?.response?.response_code === "200") {
      Swal.fire({
        icon: "success",
        title: "Details Updated",
        text: "Doctor Social Media Details Updated Successfully...",
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


// ==================================get feecharges data========================================

const get_fee_charges = async () => {
  try {
    const resp = await api.get(
      `api/v1/asset-sections/fees-charges/${doctor_details._id}`
    );

    if (resp.data?.data) {
      // Remove top-level _id
      const { _id, ...rest } = resp.data.data;

      // Map each fee object to only what you need for form
      const normalizedFees = rest.FeesAndCharges.map((fee) => ({
        _id:fee._id,
        FeeAmount: fee.FeeAmount,
        FeeCurrency: fee.FeeCurrency._id,       // store only ID
        ServiceCategory: fee.ServiceCategory._id // store only ID
      }));

      setfeecharges(normalizedFees); // now state is clean
    }
  } catch (error) {
    console.log(error);
  }
};


  useEffect(()=>
  {
    get_fee_charges()
  },[])


// ================================delete fee charges===========================================

  const delete_fee_charge=async(id)=>
  {
    try {
      const resp=await api.delete(`api/v1/asset-sections/fees-charges/${doctor_details._id}/${id}`)
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

           {feecharges?.map((fee, index) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">


          <FormControl fullWidth size="small">
             <label className='form-label'>Service Category</label>
              <Select
                name="ServiceCategory"
                value={fee.ServiceCategory}
                onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                MenuProps={{
                  disablePortal: true,
                  disableScrollLock: true,
                }}
                  displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: "#9ca3af" }}>Service Category</span>; // grey placeholder
                  }
                  return allservice.find((item) => item._id === selected)?.lookup_value;
                }}
              >
             <MenuItem value="">
              <em>Select Service Category</em>
            </MenuItem>
                {
                  allservice.map((item)=>
                  (
                     <MenuItem value={item._id}>{item.lookup_value}</MenuItem>
                  ))
                }

              </Select>
            </FormControl>

             <FormControl fullWidth size="small">
             <label className='form-label'>Fee Currency</label>
              <Select
                name="FeeCurrency"
                value={fee.FeeCurrency}
                onChange={(e) => handleChange(index, e.target.name, e.target.value)}
                MenuProps={{
                  disablePortal: true,
                  disableScrollLock: true,
                }}
                    displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: "#9ca3af" }}>Fee Currency</span>; // grey placeholder
                  }
                  return all_currency.find((item) => item._id === selected)?.lookup_value;
                }}
              >
                 <MenuItem value="">
              <em>Select Fee Currency</em>
            </MenuItem>
                {
                  all_currency.map((item)=>
                  (
                     <MenuItem value={item._id}>{item.lookup_value}</MenuItem>
                  ))
                }

              </Select>
            </FormControl>

             <FormControl fullWidth size="small">
             <label className='form-label'>Fee Amount</label>
            <TextField
            placeholder="Fee Amount"
            name="FeeAmount"
            size="small"
            value={fee.FeeAmount}
            onChange={(e) => handleChange(index, e.target.name, e.target.value)}
            />
        </FormControl>

               <button
              style={{fontFamily:"Lora"}}
                type="button"
                 onClick={() => delete_fee_charge(fee._id)}
                className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm sm:text-base w-[155px] whitespace-nowrap"
              >
                {/* <span className="material-icons text-red-500 text-xl">delete</span> */}
                Delete Fee
              </button>

          </div>
             ))}


          <div className="flex justify-between mt-4">
            <Button variant="outlined" onClick={addMore}>Add More</Button>

            <Button style={{backgroundColor:"#52677D",fontFamily:"Lora",color:"white"}} onClick={save_fee_details}>Save</Button>

          </div>
        </div>

           {/* <div className="bg-white rounded-xl shadow p-4">
                  <h3 className="font-semibold mb-4">Preview</h3>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold">Charges And Fee Details</p>

                  </div>
                  <div className="flex items-center gap-3 mb-4">

                    <div>


                    {feecharges.map((fee, index) => (
                      <div className="text-sm text-gray-600  flex-wrap gap-x-6 text-[12px]">
                        <p>Service Category : <span  className="text-[#000000] font-semibold">{fee?.ServiceCategory || ""}</span></p><br></br>
                        <p>Fee Currency : <span  className="text-[#000000] font-semibold">{fee?.FeeCurrency || ""}</span></p><br></br>
                        <p>Fee Amount : <span  className="text-[#000000] font-semibold">{fee?.FeeAmount || ""}</span></p><br></br>

                      </div>
                    ))}
                    </div>
                  </div>


                </div> */}




       {isloading_for&& (
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




