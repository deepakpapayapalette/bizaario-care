import React, { useState, useEffect, useCallback } from "react";
import {
  TextField,
  FormControl,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";
import { CloudUpload } from "lucide-react";
import UniqueLoader from "@components/common/UniqueLoader";
import { __postApiData } from "@utils/api";
import { __putApiData } from "../../../../utils/api";

export default function AssetProfile() {
  const [loadingType, setLoadingType] = useState(null);
  const doctor = JSON.parse(localStorage.getItem("user"));

  const [assetProfile, setAssetProfile] = useState({
    ShortDescription: "",
    LongDescription: "",
    NoofSurgeriesPerformed: "",
    NoofSatisfiedPatients: "",
    NoofArticlesPublished: "",
    NoofLecturesDelivered: "",
    Fellowships: [],
    ProfilePicture: "",
    Logo: "",
    PictureGallery: [],
    VideoGallery: [],
    ProfilePDF: "",
    VideoBio: "",
  });

  const [fellowshipInput, setFellowshipInput] = useState("");

  // ==============================================
  // 📦 Generic File Upload Handler
  // ==============================================
  const handleUpload = async (e, field, multiple = false) => {
    const files = e.target.files;
    if (!files?.length) return;

    setLoadingType(field);

    try {
      const formData = new FormData();
      [...files].forEach((file) => formData.append("file", file));

      const resp = await __postApiData("/api/v1/common/AddImage", formData, "form");
      if (resp.response?.response_code === "200") {
        const urls = resp.data.map((f) => f.full_URL);

        setAssetProfile((prev) => ({
          ...prev,
          [field]: multiple
            ? [...(prev[field] || []), ...urls]
            : urls[0],
        }));
      }
    } catch (err) {
      console.error("Upload error:", err);
      Swal.fire("Error", "File upload failed!", "error");
    } finally {
      setLoadingType(null);
    }
  };

  // ==============================================
  // Fellowship Add / Remove
  // ==============================================
  const addFellowship = () => {
    const val = fellowshipInput.trim();
    if (!val) return;
    setAssetProfile((p) => ({ ...p, Fellowships: [...p.Fellowships, val] }));
    setFellowshipInput("");
  };

  const removeFellowship = (i) => {
    setAssetProfile((p) => ({
      ...p,
      Fellowships: p.Fellowships.filter((_, idx) => idx !== i),
    }));
  };

  // ==============================================
  // Save Profile
  // ==============================================
  const saveProfile = async () => {
    try {
      setLoadingType("Save");
      const resp = await __putApiData(
        `/api/v1/asset-sections/profile/${doctor._id}`,
        assetProfile
      );
      console.log(resp, " resp95")
      if (resp.response?.response_code === "200") {
        Swal.fire("Success", "Profile updated successfully!", "success").then(() =>
          window.location.reload()
        );
      } else {
        Swal.fire("Error", resp.response?.response_message?.error || "Update failed!", "error");
      }
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setLoadingType(null);
    }
  };

  // ==============================================
  // 🔁 Reusable Upload UI Component
  // ==============================================
  const UploadField = ({ id, label, field, multiple }) => (
    <div className="flex items-center gap-3 border border-gray-300 px-3 py-2 rounded-md">
      <input
        type="file"
        id={id}
        multiple={multiple}
        style={{ display: "none" }}
        onChange={(e) => handleUpload(e, field, multiple)}
      />
      <label
        htmlFor={id}
        className="cursor-pointer flex items-center gap-2 text-webprimary mb-0"
      >
        <CloudUpload size={22} />
        <span>
          {label}
          {loadingType === field && (
            <CircularProgress size={18} className="ml-2" color="inherit" />
          )}
        </span>
      </label>

      {assetProfile[field]?.length > 0 && (
        <span className="text-gray-700 text-sm">
          {Array.isArray(assetProfile[field])
            ? `${assetProfile[field].length} file(s)`
            : "1 file"}
        </span>
      )}
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        {/* ================= Inputs ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ["ShortDescription", "Short Description"],
            ["LongDescription", "Long Description"],
            ["NoofSurgeriesPerformed", "No of Surgeries Performed"],
            ["NoofSatisfiedPatients", "No of Satisfied Patients"],
            ["NoofArticlesPublished", "No of Articles Published"],
            ["NoofLecturesDelivered", "No of Lectures Delivered"],
          ].map(([name, label]) => (
            <FormControl fullWidth size="small" key={name}>
              <label className="form-label">{label}</label>
              <TextField
                name={name}
                placeholder={label}
                value={assetProfile[name]}
                onChange={(e) =>
                  setAssetProfile((p) => ({ ...p, [name]: e.target.value }))
                }
                size="small"
              />
            </FormControl>
          ))}
        </div>

        {/* ================= Fellowships ================= */}
        <div>
          <label className="form-label">Fellowships</label>
          <div className="flex gap-2">
            <TextField
              placeholder="Add Fellowship"
              size="small"
              value={fellowshipInput}
              onChange={(e) => setFellowshipInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addFellowship()}
              fullWidth
            />
            <Button
              variant="outlined"
              onClick={addFellowship}
              className="theme-btn-outline"
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {assetProfile.Fellowships.map((f, i) => (
              <Chip key={i} label={f} onDelete={() => removeFellowship(i)} color="primary" />
            ))}
          </div>
        </div>

        {/* ================= Upload Fields ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <UploadField id="profile-pic" label="Upload Profile Picture" field="ProfilePicture" />
          <UploadField id="logo" label="Upload Logo" field="Logo" />
          <UploadField id="picture-gallery" label="Upload Picture Gallery" field="PictureGallery" multiple />
          <UploadField id="video-gallery" label="Upload Video Gallery" field="VideoGallery" multiple />
          <UploadField id="profile-pdf" label="Upload Profile PDF" field="ProfilePDF" />
          <UploadField id="bio-video" label="Upload Bio Video" field="VideoBio" />
        </div>

        {/* ================= Save Button ================= */}
        <div className="flex justify-end">
          <button
            className="theme-btn-fill min-w-[120px]"
            onClick={saveProfile}
            disabled={loadingType === "Save"}
          >
            {loadingType === "Save" ? <UniqueLoader /> : "Save"}
          </button>
        </div>

        {/* ================= Full Page Loader ================= */}
        {loadingType === "Save" && (
          <div className="fixed inset-0 bg-white/60 z-[9999] flex items-center justify-center">
            <UniqueLoader />
          </div>
        )}
      </div>
    </>
  );
}
