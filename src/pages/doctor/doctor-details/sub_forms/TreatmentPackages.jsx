import React, { useEffect, useState } from 'react'
import { TextField, Select, MenuItem, FormControl, InputLabel,CircularProgress, Button, Radio, FormControlLabel, RadioGroup, FormLabel } from '@mui/material';
// import api from '../../../../api'
import Swal from 'sweetalert2';
import { CloudUpload } from "lucide-react";
import { deleteImageApi } from "@utils/delete_image_from_cloudinary"
// import UniqueLoader from '../../../loader';

export default function TreatmentPackages() {

  const[isloading_for,setisloading_for]=useState("")
  const [TreatmentPackages, setTreatmentPackages] = useState([{

    PackageAnnouncementDate: '',
    PackageName: '',
    PackageCurrency: '',
    PackagePrice: '',
    Discount: '',
    DiscountValidity: '',
    PackageImage: '',
    ShortDescription:'',
    LongDescription:''

  }]);


  const handleChange = async (index, e) => {

  const { name, value, files } = e.target;
  const newPackages = [...TreatmentPackages];

  if (files) {
      setisloading_for("Package Image")
    try {
      const formData = new FormData();
      formData.append("file", files[0]); // single file per PackageImage

      const resp = await api.post("api/v1/common/AddImage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(resp);


      if (resp.data?.response?.response_code === "200") {
        const uploadedFile = resp.data.data[0];
        const imageUrl = uploadedFile.full_URL;

        newPackages[index][name] = imageUrl; // save URL instead of File object
        setTreatmentPackages(newPackages);
      }
    } catch (error) {
      console.error("Image upload error:", error);
    }
    finally
    {
      setisloading_for(null)
    }
  } else {
    // regular text input
    newPackages[index][name] = value;
    setTreatmentPackages(newPackages);
  }
};


    // Add new package form
  const addMore = () => {
    setTreatmentPackages([
      ...TreatmentPackages,
      {
        PackageAnnouncementDate: '',
        PackageName: '',
        PackageCurrency: '',
        PackagePrice: '',
        Discount: '',
        DiscountValidity: '',
        PackageImage: '',
        ShortDescription: '',
        LongDescription: '',
      },
    ]);
  };

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

 const save_treatement_packages = async () => {

  setisloading_for("Save Treatment Package")
  try {
       const payload = TreatmentPackages.map(({ _id, ...rest }) => rest);

    const resp = await api.put(
      `api/v1/asset-sections/treatment-packages/${doctor_details._id}`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log(resp);


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
    setisloading_for(null)
  }
};


// ===============================get all TreatmentPackages details=================================

const get_treatment_packages = async () => {
  try {
    const resp = await api.get(
      `api/v1/asset-sections/treatment-packages/${doctor_details._id}`
    );

    if (resp.data?.data?.TreatmentPackages) {
      const normalizedPackages = resp.data.data.TreatmentPackages.map((pkg) => ({
        _id: pkg._id,
        PackageName: pkg.PackageName,
        PackagePrice: pkg.PackagePrice,
        PackageCurrency: pkg.PackageCurrency?._id, // only ID
        PackageImage: pkg.PackageImage,
        ShortDescription: pkg.ShortDescription,
        LongDescription: pkg.LongDescription,
        Discount: pkg.Discount,
        DiscountValidity: pkg.DiscountValidity,
        PackageAnnouncementDate: pkg.PackageAnnouncementDate,
      }));

      setTreatmentPackages(normalizedPackages);
    }
  } catch (error) {
    console.log(error);
  }
};



  useEffect(()=>
  {
    get_treatment_packages()
  },[])


  //============================= delete treatment package=======================================

   const delete_treatment_package=async(id)=>
  {
    try {
      const resp=await api.delete(`api/v1/asset-sections/treatment-packages/${doctor_details._id}/${id}`)
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


// Add this function inside your component
const handleDeleteMedia = async (type, index = null) => {
  try {
    let urlToDelete;
    if (index !== null) {
      urlToDelete = TreatmentPackages[index][type]; // array type
    } else {
      urlToDelete = TreatmentPackages[type]; // single file
    }

    console.log(urlToDelete);

    if (!urlToDelete) return;

    await deleteImageApi(urlToDelete); // delete from Cloudinary

    setTreatmentPackages((prev) => {
      const updated = { ...prev };
      if (index !== null) {
        const arr = [...updated[type]];
        arr.splice(index, 1);
        updated[type] = arr;
      } else {
        updated[type] = "";
      }
      return updated;
    });

  } catch (err) {
    console.error("Failed to delete:", err);
  }
};


console.log(TreatmentPackages);


  return (
    <>


        <div >


           {TreatmentPackages?.map((pkg, index) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">

            <FormControl fullWidth size="small" >
            <label className='form-label'>Package Announcement Date</label>
            <TextField
            type='date'
            placeholder="Package Announcement Date"
            name="PackageAnnouncementDate"
            size="small"
            value={pkg?.PackageAnnouncementDate? pkg.PackageAnnouncementDate.split("T")[0] : ""}
            InputLabelProps={{ shrink: true }}
            onChange={(e)=>handleChange(index,e)}
            />
            </FormControl>

             <FormControl fullWidth size="small" >
            <label className='form-label'>Packag Name</label>
            <TextField
            placeholder="Packag Name"
            name="PackageName"
            size="small"
            value={pkg.PackageName}
            onChange={(e)=>handleChange(index,e)}
            />
            </FormControl>

          <FormControl fullWidth size="small" >
            <label className='form-label'>Package Currency</label>
              <Select
                name="PackageCurrency"
                value={pkg.PackageCurrency}
                onChange={(e)=>handleChange(index,e)}
                MenuProps={{
                  disablePortal: true,
                  disableScrollLock: true,
                }}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: "#9ca3af" }}>Package Currency</span>; // grey placeholder
                  }
                  return all_currency.find((item) => item._id === selected)?.lookup_value;
                }}
              >
               <MenuItem value="">
              <em>Select Package Currency</em>
            </MenuItem>
                 {
                    all_currency.map((item)=>
                    (
                        <MenuItem value={item._id}>{item.lookup_value}</MenuItem>
                    ))
                  }
              </Select>
            </FormControl>

           <FormControl fullWidth size="small" >
            <label className='form-label'>Package Price</label>
            <TextField
            placeholder="Package Price"
            name="PackagePrice"
            size="small"
            value={pkg.PackagePrice}
            onChange={(e)=>handleChange(index,e)}
            />
            </FormControl>

          <FormControl fullWidth size="small" >
            <label className='form-label'>Discount</label>
            <TextField
            placeholder="Discount"
            name="Discount"
            size="small"
            value={pkg.Discount}
            onChange={(e)=>handleChange(index,e)}
            />
            </FormControl>

            <FormControl fullWidth size="small" >
            <label className='form-label'>Discount Validity</label>
            <TextField
            type='date'
            placeholder="Discount Validity"
            name="DiscountValidity"
            size="small"
            value={pkg?.DiscountValidity? pkg.DiscountValidity.split("T")[0] : ""}
            InputLabelProps={{ shrink: true }}
            onChange={(e)=>handleChange(index,e)}
            />
            </FormControl>


           <FormControl fullWidth size="small" >
            <label className='form-label'>Short Description</label>
            <TextField
            placeholder="Short Description"
            name="ShortDescription"
            size="small"
            value={pkg.ShortDescription}
            onChange={(e)=>handleChange(index,e)}
            />
            </FormControl>

            <FormControl fullWidth size="small" >
            <label className='form-label'>Long Description</label>
            <TextField
            placeholder="Long Description"
            name="LongDescription"
            size="small"
            value={pkg.LongDescription}
            onChange={(e)=>handleChange(index,e)}
            />
            </FormControl>

            <TextField
            style={{visibility:"hidden"}}

            />

            <div className=" flex items-center gap-3">
                {/* Hidden file input */}
                <input
                  name="PackageImage"
                  type="file"
                  id={`package-image-upload-${index}`}
                  style={{ display: "none" }}
                  onChange={(e) => handleChange(index, e)}
                  // multiple // uncomment if multiple files needed
                />

                {/* Cloud upload icon */}
                <label
                  htmlFor={`package-image-upload-${index}`}
                  className="cursor-pointer flex items-center gap-2 text-blue-600"
                >
                  <CloudUpload size={24} />
                  <span>Upload Package Image
                     {isloading_for==="Package Image" ?
                      (
                      <CircularProgress size={24} color="inherit" />
                    ) :(
                      ""
                    )}
                  </span>
                </label>

                {/* Show selected file name */}
                {pkg.PackageImage && (
                  <span className="text-gray-700 font-medium">
                    1 file selected
                  </span>
                )}
              </div>
               <FormControl fullWidth size="small" >
                <label className='form-label' style={{visibility:"hidden"}}>.</label>
              <button
              style={{fontFamily:"Lora"}}
                type="button"
                  onClick={() => delete_treatment_package(pkg._id)}
                className="flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm sm:text-base w-[155px] whitespace-nowrap"
              >
                {/* <span className="material-icons text-red-500 text-xl">delete</span> */}
                Delete Package
              </button>
       </FormControl>

          </div>
             ))}


          <div className="flex justify-between mt-4">
            <Button variant="outlined" onClick={addMore}>Add More</Button>

              <Button style={{backgroundColor:"#52677D",fontFamily:"Lora",color:"white"}} onClick={save_treatement_packages}>Save</Button>

          </div>
        </div>

           {/* <div className="bg-white rounded-xl shadow p-4">
                  <h3 className="font-semibold mb-4">Preview</h3>
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold">Treatment Packages Details</p>

                  </div>
                  <div className="flex items-center gap-3 mb-4">

                    <div>


                    {TreatmentPackages.map((pkg, index) => (
                      <div className="text-sm text-gray-600  flex-wrap gap-x-6 text-[12px]">
                        <p>Package Announcement Date : <span  className="text-[#000000] font-semibold">{pkg?.PackageAnnouncementDate || ""}</span></p><br></br>
                        <p>Package Name : <span  className="text-[#000000] font-semibold">{pkg?.PackageName || ""}</span></p><br></br>
                        <p>Package Currency : <span  className="text-[#000000] font-semibold">{pkg?.PackageCurrency || ""}</span></p><br></br>
                        <p>Package Price : <span  className="text-[#000000] font-semibold">{pkg?.PackagePrice || ""}</span></p><br></br>
                        <p>Discount : <span  className="text-[#000000] font-semibold">{pkg?.Discount || ""}</span></p><br></br>
                        <p>Discount Validity : <span  className="text-[#000000] font-semibold">{pkg?.DiscountValidity || ""}</span></p><br></br>
                        <p>PackageImage :</p>


                            <div style={{ position: "relative", display: "inline-block" }}>
                              <img
                                src={pkg?.PackageImage}
                                alt=""
                                style={{ height: "100px", borderRadius: "5px",
                                  border:pkg.PackageImage?"1px solid gray":"none" }}
                              />
                              <button
                                onClick={() => handleDeleteMedia("PackageImage",index)}
                                style={{
                                  display:pkg.PackageImage?"block":"none",
                                  position: "absolute",
                                  top: "1px",
                                  right: "1px",
                                  padding: "2px",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                <span
                                  className="material-icons"
                                  style={{ color: "red", fontSize: "20px" }}
                                >
                                  delete
                                </span>
                              </button>
                            </div>
                         <br></br>
                        <p>Short Description : <span  className="text-[#000000] font-semibold">{pkg?.ShortDescription || ""}</span></p><br></br>
                        <p>Long Description : <span  className="text-[#000000] font-semibold">{pkg?.LongDescription || ""}</span></p><br></br>
                      </div>
                    ))}
                    </div>
                  </div>


                </div> */}


    {isloading_for==="Save Treatment Package" && (
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



