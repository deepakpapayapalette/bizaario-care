import React, { useEffect, useState } from 'react'
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Radio, FormControlLabel, RadioGroup, FormLabel } from '@mui/material';
// import api from '../../../../api'
import Swal from 'sweetalert2';
// import UniqueLoader from '../../../loader';

export default function BankDetails() {

  const [isloading_for, setisloading_for] = useState(false)

  const [bankdetails, setbankdetails] = useState({
    AccountName: '',
    AccountNumber: '',
    BankName: '',
    SwiftIFSCCode: '',
    PaymentQRCode: '',
    OnlinePaymentURL: '',
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setbankdetails({ ...bankdetails, [name]: value });
  };


  const doctor_details = JSON.parse(localStorage.getItem("user"))

  const save_bank_details = async () => {
    setisloading_for(true)
    try {
      const resp = await api.put(
        `api/v1/asset-sections/bank-details/${doctor_details._id}`,
        bankdetails,
        { headers: { "Content-Type": "application/json" } }
      );

      // Check response_code instead of HTTP status
      if (resp.data?.response?.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Details Updated",
          text: "Doctor Bank Details Updated Successfully...",
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
    finally {
      setisloading_for(false)
    }
  };


  //=================================== get bank details=========================================

  const get_bank_details = async () => {
    try {
      const resp = await api.get(`api/v1/asset-sections/bank-details/${doctor_details._id}`)
      if (resp.data?.data) {
        const { _id, ...rest } = resp.data.data;
        setbankdetails(rest);
      }
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    get_bank_details()
  }, [])


  return (
    <>


      <div >

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <FormControl fullWidth size="small">
            <label className="form-label">Account Name</label>
            <TextField
              placeholder="Account Name"
              name="AccountName"
              size="small"
              value={bankdetails.AccountName}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Account Number</label>
            <TextField
              placeholder="Account Number"
              name="AccountNumber"
              size="small"
              value={bankdetails.AccountNumber}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Bank Name</label>
            <TextField
              placeholder="Bank Name"
              name="BankName"
              size="small"
              value={bankdetails.BankName}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Swift IFSCCode</label>
            <TextField
              placeholder="Swift IFSCCode"
              name="SwiftIFSCCode"
              size="small"
              value={bankdetails.SwiftIFSCCode}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Payment QR Code</label>
            <TextField
              placeholder="Payment QR Code"
              name="PaymentQRCode"
              size="small"
              value={bankdetails.PaymentQRCode}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Online Payment URL</label>
            <TextField
              placeholder="Online Payment URL"
              name="OnlinePaymentURL"
              size="small"
              value={bankdetails.OnlinePaymentURL}
              onChange={handleChange}
            />
          </FormControl>

        </div>



        <div className="flex justify-end gap-3 mt-4">
          <Button style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }} onClick={save_bank_details}>Save</Button>
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
                    <p className="font-semibold">Bank Details</p>

                  </div>
                  <div className="flex items-center gap-3 mb-4">

                    <div>


                      <div className="text-sm text-gray-600  flex-wrap gap-x-6 text-[12px]">
                        <p>Account Name : <span  className="text-[#000000] font-semibold">{bankdetails?.AccountName || ""}</span></p><br></br>
                        <p>Account Number : <span  className="text-[#000000] font-semibold">{bankdetails?.AccountNumber || ""}</span></p><br></br>
                        <p>Bank Name : <span  className="text-[#000000] font-semibold">{bankdetails?.BankName || ""}</span></p><br></br>
                        <p>Swift IFSCCode : <span  className="text-[#000000] font-semibold">{bankdetails?.SwiftIFSCCode || ""}</span></p><br></br>
                        <p>Payment QR Code : <span  className="text-[#000000] font-semibold">{bankdetails?.PaymentQRCode || ""}</span></p><br></br>
                        <p>Online Payment URL : <span  className="text-[#000000] font-semibold">{bankdetails?.OnlinePaymentURL || ""}</span></p><br></br>

                      </div>

                    </div>
                  </div>





      </div> */}



    </>
  )
}



