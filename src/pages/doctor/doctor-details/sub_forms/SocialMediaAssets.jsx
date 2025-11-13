import React, { useEffect, useState } from 'react'
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Radio, FormControlLabel, RadioGroup, FormLabel } from '@mui/material';
// import api from '../../../../api'
import Swal from 'sweetalert2';
// import UniqueLoader from '../../../loader';

export default function SocialMediaAssets({ initialData = {}, onPrevious, onNext }) {

  const[isloading_for,setisloading_for]=useState(false)
  const [social_media_assets, setsocial_media_assets] = useState({
    Website: '',
    YouTubeChannel: '',
    FacebookPage: '',
    InstagramAccount: '',
    LinkedInAccount: '',
    WhatsAppCommunity: '',
    TelegramChannel: '',

  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setsocial_media_assets({ ...social_media_assets, [name]: value });
  };


const doctor_details=JSON.parse(localStorage.getItem("user"))

 const save_social_media_details = async () => {
  try {
    setisloading_for(true)
    const resp = await api.put(
      `api/v1/asset-sections/social-media/${doctor_details._id}`,
      social_media_assets,
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


//======================== get social_media_assets==========================================

const get_social_media_details=async()=>
  {
    try {
      const resp=await api.get(`api/v1/asset-sections/social-media/${doctor_details._id}`)
         if (resp.data?.data) {
          const { _id, ...rest } = resp.data.data;
          setsocial_media_assets(rest);
        }
    } catch (error) {
      console.log(error);

    }
  }

  useEffect(()=>
  {
    get_social_media_details()
  },[])



  return (
    <>
      <div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

             <FormControl fullWidth size="small">
              <label className="form-label">Website</label>
            <TextField
            placeholder="Website"
            name="Website"
            size="small"
            value={social_media_assets.Website}
            onChange={handleChange}
            />
            </FormControl>

            <FormControl fullWidth size="small">
            <label className="form-label">YouTube Channel</label>
            <TextField
            placeholder="YouTube Channel"
            name="YouTubeChannel"
            size="small"
            value={social_media_assets.YouTubeChannel}
            onChange={handleChange}
            />
            </FormControl>

           <FormControl fullWidth size="small">
            <label className="form-label">Facebook Page</label>
            <TextField
            placeholder="FacebookPage"
            name="FacebookPage"
            size="small"
            value={social_media_assets.FacebookPage}
            onChange={handleChange}
            />
            </FormControl>

            <FormControl fullWidth size="small">
            <label className="form-label">Instagram Account</label>
            <TextField
            placeholder="Instagram Account"
            name="InstagramAccount"
            size="small"
            value={social_media_assets.InstagramAccount}
            onChange={handleChange}
            />
            </FormControl>

            <FormControl fullWidth size="small">
            <label className="form-label">LinkedIn Account</label>
            <TextField
            placeholder="Linked InAccount"
            name="LinkedInAccount"
            size="small"
            value={social_media_assets.LinkedInAccount}
            onChange={handleChange}
            />
            </FormControl>

            <FormControl fullWidth size="small">
            <label className="form-label">What's App Community</label>
            <TextField
            placeholder="What's App Community"
            name="WhatsAppCommunity"
            size="small"
            value={social_media_assets.WhatsAppCommunity}
            onChange={handleChange}
            />
            </FormControl>

           <FormControl fullWidth size="small">
            <label className="form-label">Telegram Channel</label>
            <TextField
            placeholder="Telegram Channel"
            name="TelegramChannel"
            size="small"
            value={social_media_assets.TelegramChannel}
            onChange={handleChange}
            />
            </FormControl>


          </div>


          <div className="flex justify-end gap-3 mt-4">
              <Button style={{backgroundColor:"#52677D",fontFamily:"Lora",color:"white"}} onClick={save_social_media_details}>Save</Button>
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
                    <p className="font-semibold">Social Media Details</p>
                  </div>
                  <div className="flex items-center gap-3 mb-4">

                    <div>

                      <div className="text-sm text-gray-600  flex-wrap gap-x-6 text-[12px]">
                        <p>Website : <span  className="text-[#000000] font-semibold">{social_media_assets?.Website || ""}</span></p><br></br>
                        <p>YouTube Channel : <span  className="text-[#000000] font-semibold">{social_media_assets?.YouTubeChannel || ""}</span></p><br></br>
                        <p>Facebook Page : <span  className="text-[#000000] font-semibold">{social_media_assets?.FacebookPage || ""}</span></p><br></br>
                        <p>Instagram Account : <span  className="text-[#000000] font-semibold">{social_media_assets?.InstagramAccount || ""}</span></p><br></br>
                        <p>LinkedIn Account : <span  className="text-[#000000] font-semibold">{social_media_assets?.LinkedInAccount || ""}</span></p><br></br>
                        <p>WhatsApp Community : <span  className="text-[#000000] font-semibold">{social_media_assets?.WhatsAppCommunity || ""}</span></p><br></br>
                        <p>Telegram Channel : <span  className="text-[#000000] font-semibold">{social_media_assets?.TelegramChannel || ""}</span></p>
                      </div>
                    </div>
                  </div>


                </div> */}


    </>
    )
}



