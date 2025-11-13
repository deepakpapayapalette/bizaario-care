import React, { useEffect, useState } from 'react'
import { TextField, Select, MenuItem, FormControl, Chip, InputLabel, Button, Radio, FormControlLabel, RadioGroup, CircularProgress } from '@mui/material';

import Swal from 'sweetalert2';
import { CloudUpload } from "lucide-react";
// import UniqueLoader from '../../../loader';

import { __postApiData } from '@utils/api';

export default function AssetProfile() {

  const [loading_for, setloading_for] = useState(null)


  const [assetprofile, setassetprofile] = useState({
    ShortDescription: '',
    LongDescription: '',
    NoofSurgeriesPerformed: '',
    NoofSatisfiedPatients: '',
    NoofArticlesPublished: '',
    NoofLecturesDelivered: '',
    Fellowships: [],
    ProfilePicture: '',
    Logo: '',
    PictureGallery: [],
    VideoGallery: [],
    ProfilePDF: '',
    VideoBio: '',

  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setassetprofile({ ...assetprofile, [name]: value });
  };


  const [currentFellowship, setCurrentFellowship] = useState("");

  // ➕ Add fellowship
  const addFellowship = () => {
    if (currentFellowship.trim() === "") return;
    setassetprofile((prev) => ({
      ...prev,
      Fellowships: [...(prev.Fellowships || []), currentFellowship.trim()],
    }));
    setCurrentFellowship(""); // clear input
  };


  // ❌ Remove fellowship
  const removeFellowship = (index) => {
    setassetprofile((prev) => ({
      ...prev,
      Fellowships: prev.Fellowships.filter((_, i) => i !== index),
    }));
  };

  const handleChangeprofile_pic = async (e) => {
    setloading_for("Profile Pic")
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file); // must match req.files.file in backend

      // const resp = await api.put("/api/v1/common/AddImage", formData, {
      //   headers: { "Content-Type": "multipart/form-data" },
      // });
      const resp = await __postApiData("/api/v1/common/AddImage", formData, "form",

      );

      // check if API returned success
      if (resp.response?.response_code === "200") {
        const uploadedFile = resp.data[0]; // first file
        const imageUrl = uploadedFile.full_URL;

        setassetprofile((prev) => ({
          ...prev,
          ProfilePicture: imageUrl,
        }));
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
    finally {
      setloading_for(null)
    }
  };

  const handlechange_logo = async (e) => {
    setloading_for("Logo")
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file); // must match req.files.file in backend

      const resp = await __postApiData("/api/v1/common/AddImage", formData, "form",);

      // check if API returned success
      if (resp.response?.response_code === "200") {
        const uploadedFile = resp.data[0]; // first file
        const imageUrl = uploadedFile.full_URL;

        setassetprofile((prev) => ({
          ...prev,
          Logo: imageUrl,
        }));
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
    finally {
      setloading_for(null)
    }
  };

  const handlechange_picture_gallary = async (e) => {
    setloading_for("Picture Gallary")
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const formData = new FormData();

      // loop through selected files
      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]); // must match backend multer config
      }

      const resp = await __postApiData("/api/v1/common/AddImage", formData, "form",);

      console.log(resp);

      if (resp.response?.response_code === "200") {
        const uploadedFiles = resp.data; // array of files
        const urls = uploadedFiles.map((file) => file.full_URL);

        // if storing in PictureGallery
        setassetprofile((prev) => ({
          ...prev,
          PictureGallery: [...prev.PictureGallery, ...urls],
        }));

        // if it's for single ProfilePicture (just take first file)
        // setassetprofile((prev) => ({ ...prev, ProfilePicture: urls[0] }));
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
    finally {
      setloading_for(null)
    }
  };

  const handlechange_video_gallary = async (e) => {

    setloading_for("Video Gallary")
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const formData = new FormData();

      // loop through selected files
      for (let i = 0; i < files.length; i++) {
        formData.append("file", files[i]); // must match backend multer config
      }

      const resp = await __postApiData("/api/v1/common/AddImage", formData, "form",);

      // console.log(resp);

      if (resp.response?.response_code === "200") {
        const uploadedFiles = resp.data; // array of files
        const urls = uploadedFiles.map((file) => file.full_URL);

        // if storing in PictureGallery
        setassetprofile((prev) => ({
          ...prev,
          VideoGallery: [...prev.VideoGallery, ...urls],
        }));

        // if it's for single ProfilePicture (just take first file)
        // setassetprofile((prev) => ({ ...prev, ProfilePicture: urls[0] }));
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
    finally {
      setloading_for(null)
    }
  };

  const handlechange_profile_pdf = async (e) => {
    setloading_for("Profile Pdf")
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file); // must match req.files.file in backend

      const resp = await __postApiData("/api/v1/common/AddImage", formData, "form",);

      // check if API returned success
      if (resp.response?.response_code === "200") {
        const uploadedFile = resp.data[0]; // first file
        const imageUrl = uploadedFile.full_URL;

        setassetprofile((prev) => ({
          ...prev,
          ProfilePDF: imageUrl,
        }));
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
    finally {
      setloading_for(null)
    }
  };

  const handlechange_bio_video = async (e) => {
    setloading_for("Bio Video")
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file); // must match req.files.file in backend

      const resp = await __postApiData("/api/v1/common/AddImage", formData, "form",);

      // check if API returned success
      if (resp.response?.response_code === "200") {
        const uploadedFile = resp.data[0]; // first file
        const imageUrl = uploadedFile.full_URL;

        setassetprofile((prev) => ({
          ...prev,
          VideoBio: imageUrl,
        }));
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
    finally {
      setloading_for(null)
    }
  };

  const doctor_details = JSON.parse(localStorage.getItem("user"))

  const save_profile_details = async () => {
    try {
      setloading_for("Save Profile")
      const { _id, ...payload } = assetprofile;
      const resp = await __postApiData(
        `/api/v1/asset-sections/profile/${doctor_details._id}`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      // Check response_code instead of HTTP status
      if (resp.response?.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Details Updated",
          text: "Doctor Profile Details Updated Successfully...",
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
      setloading_for(null)
    }
  };


  //=============================== get all assest data===========================================

  const get_assest_profile_details = async () => {
    try {
      const resp = await __postApiData(`/api/v1/asset-sections/profile/${doctor_details._id}`
      );
      console.log(resp);

      if (resp.data) {


        setassetprofile(resp.data); // now state is clean
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    get_assest_profile_details()
  }, [])


  // ====================================delete image ===================================================



  const deleteImageApi = async (imageUrl) => {
    try {
      const res = await __postApiData("/api/v1/common/DeleteImage", { imageUrl });
      console.log(res, "delete res");

      if (res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Details Updated",
          text: res.data.message,
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        })
      }

    } catch (err) {
      console.error("Error deleting image:", err);
      throw err;
    }
  };


  // Add this function inside your component
  const handleDeleteMedia = async (type, index = null) => {
    try {
      let urlToDelete;
      if (index !== null) {
        urlToDelete = assetprofile[type][index]; // array type
      } else {
        urlToDelete = assetprofile[type]; // single file
      }

      if (!urlToDelete) return;

      await deleteImageApi(urlToDelete); // delete from Cloudinary

      setassetprofile((prev) => {
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



  return (
    <>
      <div >

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <FormControl fullWidth size="small">
            <label className="form-label">Short Description</label>
            <TextField
              placeholder="Short Description"
              name="ShortDescription"
              size="small"
              value={assetprofile.ShortDescription}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Long Description</label>
            <TextField
              placeholder="Long Description"
              name="LongDescription"
              size="small"
              value={assetprofile.LongDescription}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">No of Surgeries Performed</label>
            <TextField
              placeholder="No Of Surgeries Performed"
              name="NoofSurgeriesPerformed"
              size="small"
              value={assetprofile.NoofSurgeriesPerformed}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">No of Satisfied Patients</label>
            <TextField
              placeholder="No Of Satisfied Patients"
              name="NoofSatisfiedPatients"
              size="small"
              value={assetprofile.NoofSatisfiedPatients}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">No of Articles Published</label>
            <TextField
              placeholder="No Of Articles Published"
              name="NoofArticlesPublished"
              size="small"
              value={assetprofile.NoofArticlesPublished}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">No of Lectures Delivered </label>
            <TextField
              placeholder="No Of Lectures Delivered"
              name="NoofLecturesDelivered"
              size="small"
              value={assetprofile.NoofLecturesDelivered}
              onChange={handleChange}
            />
          </FormControl>

          {/* <FormControl fullWidth size="small">
            <label className="form-label">Fellowships</label>
            <TextField
            placeholder="Fellowsiips"
            name="Fellowsiips"
            size="small"
            value={assetprofile.Fellowsiips}
            onChange={handleChange}
            />
            </FormControl> */}

          <FormControl fullWidth size="small">
            <label className="form-label">Fellowships</label>
            <div className="flex space-x-2">
              <TextField
                placeholder="Add Fellowships"
                value={currentFellowship}
                onChange={(e) => setCurrentFellowship(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addFellowship()} // add on Enter
                fullWidth
                size="small"
              />
              <button className='theme-btn-ouline min-w-[100px] ' onClick={addFellowship} variant="outlined">
                Add More
              </button>
            </div>

            {assetprofile?.Fellowships?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {assetprofile.Fellowships.map((fellowship, index) => (
                  <Chip
                    key={index}
                    label={fellowship}
                    onDelete={() => removeFellowship(index)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </div>
            )}
          </FormControl>


          <FormControl fullWidth size="small">

          </FormControl>



          <div className="col-span-2 flex items-center gap-3">
            {/* Hidden file input */}
            <input
              type="file"
              id="profile-picture-upload"
              style={{ display: "none" }}
              onChange={handleChangeprofile_pic}

            />

            {/* Cloud upload icon */}
            <label htmlFor="profile-picture-upload" className="cursor-pointer flex items-center gap-2 text-blue-600">
              <CloudUpload size={24} />
              <span>Upload Profile Pic
                {loading_for === "Profile Pic" ?
                  (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    ""
                  )}
              </span>
            </label>

            {/* Show file count */}
            {assetprofile.ProfilePicture && (
              <span className="text-gray-700 font-medium">
                {Array.isArray(assetprofile.ProfilePicture)
                  ? `${assetprofile.ProfilePicture.length} file(s) selected`
                  : "1 file selected"}
              </span>
            )}
          </div>




          <div className="col-span-2 flex items-center gap-3">
            {/* Hidden file input */}
            <input
              type="file"
              id="logo-upload"
              style={{ display: "none" }}
              onChange={handlechange_logo}

            />

            {/* Cloud upload icon */}
            <label htmlFor="logo-upload" className="cursor-pointer flex items-center gap-2 text-blue-600">
              <CloudUpload size={24} />
              <span>Upload Logo

                {loading_for === "Logo" ?
                  (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    ""
                  )}
              </span>
            </label>

            {/* Show file count */}
            {assetprofile.Logo && (
              <span className="text-gray-700 font-medium">
                {Array.isArray(assetprofile.Logo)
                  ? `${assetprofile.Logo.length} file(s) selected`
                  : "1 file selected"}
              </span>
            )}
          </div>



          <div className="col-span-2 flex items-center gap-3">
            {/* Hidden file input */}
            <input
              type="file"
              id="picture-gallary-upload"
              style={{ display: "none" }}
              onChange={handlechange_picture_gallary}
              multiple

            />

            {/* Cloud upload icon */}
            <label htmlFor="picture-gallary-upload" className="cursor-pointer flex items-center gap-2 text-blue-600">
              <CloudUpload size={24} />
              <span>Upload Picture Gallary

                {loading_for === "Picture Gallary" ?
                  (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    ""
                  )}

              </span>
            </label>

            {/* Show file count */}
            {assetprofile.PictureGallery && (
              <span className="text-gray-700 font-medium">
                {Array.isArray(assetprofile.PictureGallery)
                  ? `${assetprofile.PictureGallery.length} file(s) selected`
                  : "1 file selected"}
              </span>
            )}
          </div>



          <div className="col-span-2 flex items-center gap-3">
            {/* Hidden file input */}
            <input
              type="file"
              id="video-gallary-upload"
              style={{ display: "none" }}
              onChange={handlechange_video_gallary}
              multiple

            />

            {/* Cloud upload icon */}
            <label htmlFor="video-gallary-upload" className="cursor-pointer flex items-center gap-2 text-blue-600">
              <CloudUpload size={24} />
              <span>Upload Video Gallary

                {loading_for === "Video Gallary" ?
                  (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    ""
                  )}
              </span>
            </label>

            {/* Show file count */}
            {assetprofile.VideoGallery && (
              <span className="text-gray-700 font-medium">
                {Array.isArray(assetprofile.VideoGallery)
                  ? `${assetprofile.VideoGallery.length} file(s) selected`
                  : "1 file selected"}
              </span>
            )}
          </div>



          <div className="col-span-2 flex items-center gap-3">
            {/* Hidden file input */}
            <input
              type="file"
              id="pdf-upload"
              style={{ display: "none" }}
              onChange={handlechange_profile_pdf}
              multiple

            />

            {/* Cloud upload icon */}
            <label htmlFor="pdf-upload" className="cursor-pointer flex items-center gap-2 text-blue-600">
              <CloudUpload size={24} />
              <span>Upload Profile Pdf

                {loading_for === "Profile Pdf" ?
                  (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    ""
                  )}
              </span>
            </label>

            {/* Show file count */}
            {assetprofile.ProfilePDF && (
              <span className="text-gray-700 font-medium">
                {Array.isArray(assetprofile.ProfilePDF)
                  ? `${assetprofile.ProfilePDF.length} file(s) selected`
                  : "1 file selected"}
              </span>
            )}
          </div>


          <div className="col-span-2 flex items-center gap-3">
            {/* Hidden file input */}
            <input
              type="file"
              id="bio-video-upload"
              style={{ display: "none" }}
              onChange={handlechange_bio_video}


            />

            {/* Cloud upload icon */}
            <label htmlFor="bio-video-upload" className="cursor-pointer flex items-center gap-2 text-blue-600">
              <CloudUpload size={24} />
              <span>Upload Bio Video

                {loading_for === "Bio Video" ?
                  (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    ""
                  )}
              </span>
            </label>

            {/* Show file count */}
            {assetprofile.VideoBio && (
              <span className="text-gray-700 font-medium">
                {Array.isArray(assetprofile.VideoBio)
                  ? `${assetprofile.VideoBio.length} file(s) selected`
                  : "1 file selected"}
              </span>
            )}
          </div>


        </div>


        <div className="flex justify-end gap-3 mt-4">
          <Button style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }} onClick={save_profile_details}>Save</Button>
        </div>

        {loading_for === "Save Profile" && (
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
                    <p className="font-semibold">Asset Profile Details</p>
                    {/* <span className="text-gray-500"><TfiAngleUp /></span> *
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    {/* <img src={userProfile} alt="Patient" className="w-16 h-16 rounded-full object-cover" />
                    <div>
                      <div className="text-sm text-gray-600  flex-wrap gap-x-6 text-[12px]">
                        <p>ShortDescription : <span  className="text-[#000000] font-semibold">{assetprofile?.ShortDescription || ""}</span></p><br></br>
                        <p>LongDescription : <span  className="text-[#000000] font-semibold">{assetprofile?.LongDescription || ""}</span></p><br></br>

{/* =============================================profile picture======================================== *

                        <p>ProfilePicture :   </p>

                        <div style={{ position: "relative", display: "inline-block" }}>
                              <img
                                src={assetprofile?.ProfilePicture}
                                alt=""
                                style={{ height: "100px", borderRadius: "5px",
                                  border:assetprofile.ProfilePicture?"1px solid gray":"none" }}
                              />
                              <button
                                onClick={() => handleDeleteMedia("ProfilePicture")}
                                style={{
                                  display:assetprofile.ProfilePicture?"block":"none",
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

{/*========================================== logo===============================================

                        <p>Logo : </p>
                           <div style={{ position: "relative", display: "inline-block" }}>
                              <img
                                src={assetprofile?.Logo}
                                alt=""
                                style={{ height: "100px", borderRadius: "5px",
                                  border:assetprofile.Logo?"1px solid gray":"none" }}
                              />
                              <button
                                onClick={() => handleDeleteMedia("Logo")}
                                style={{
                                  display:assetprofile.Logo?"block":"none",
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

{/* =========================================picture gallary==========================================


                      <p>
                        Picture Gallery:    </p>
                        <span className="text-[#000000] font-semibold">
                          {assetprofile?.PictureGallery.length > 0
                            ? assetprofile.PictureGallery.map((item, idx) => (

                          <div style={{ position: "relative", display: "inline-block" }}>
                                    <img
                                      src={item}
                                      alt=""
                                      style={{
                                        height: "100px",
                                        width: "100px",
                                        borderRadius: "5px",
                                        border:assetprofile.PictureGallery?"1px solid gray":"none",
                                        display: "block",
                                        margin:"10px"
                                      }}
                                    />
                                    <button
                                      onClick={() => handleDeleteMedia("PictureGallery",idx)}
                                      style={{
                                        display:assetprofile.PictureGallery?"block":"none",
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        padding: "2px",
                                        border: "none",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <span
                                        className="material-icons"
                                        style={{ color: "red", fontSize: "18px" }}
                                      >
                                        delete
                                      </span>
                                    </button>
                                  </div>

                              ))
                            : ""}
                        </span>

                              <br></br>
  {/*=================================== video gallary =========================================*


                        <p>  Video Gallery:    </p>
                        <span className="text-[#000000] font-semibold">
                          {assetprofile?.VideoGallery.length > 0
                            ? assetprofile.VideoGallery.map((item, idx) => (

                             <div style={{ position: "relative", display: "inline-block" }}>
                                    <img
                                      src={item}
                                      alt=""
                                      style={{
                                        height: "100px",
                                        width: "100px",
                                        borderRadius: "5px",
                                        border:assetprofile.VideoGallery?"1px solid gray":"none",
                                        display: "block",
                                        margin:"10px"
                                      }}
                                    />
                                    <button
                                     onClick={() => handleDeleteMedia("VideoGallery",idx)}
                                      style={{
                                        display:assetprofile.VideoGallery?"block":"none",
                                        position: "absolute",
                                        top: "10px",
                                        right: "10px",
                                        padding: "2px",
                                        border: "none",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <span
                                        className="material-icons"
                                        style={{ color: "red", fontSize: "18px" }}
                                      >
                                        delete
                                      </span>
                                    </button>
                                  </div>
                              ))
                            : ""}
                        </span>

{/*=========================================== profile pdf==========================================


                        <p>Profile PDF :</p>
                        <div style={{ position: "relative", display: "inline-block" }}>
                              <img
                                src={assetprofile?.ProfilePDF}
                                alt=""
                                style={{ height: "100px", borderRadius: "5px",border:assetprofile.ProfilePDF?"1px solid gray":"none", }}
                              />
                              <button
                                onClick={() => handleDeleteMedia("ProfilePDF")}
                                style={{
                                  display:assetprofile.ProfilePDF?"block":"none",
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

{/*======================================== video bio ==============================================


                        <p>Video Bio :  </p>
                           <div style={{ position: "relative", display: "inline-block" }}>
                              <img
                                src={assetprofile?.VideoBio}
                                alt=""
                                style={{ height: "100px", borderRadius: "5px",border:assetprofile.VideoBio?"1px solid gray":"none",  }}
                              />
                              <button
                                onClick={() => handleDeleteMedia("VideoBio")}
                                style={{
                                  display:assetprofile.VideoBio?"block":"none",
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


                      </div>
                    </div>
                  </div>


                </div> */}






    </>
  )
}



