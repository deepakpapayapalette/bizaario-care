import React, { useEffect, useState } from "react";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Button,
} from "@mui/material";

import { CloudUpload } from "lucide-react";
import Swal from "sweetalert2";

import { __postApiData, __putApiData, __getApiData } from "@utils/api";
import { __deleteApiData } from "../../../../utils/api";
import { deleteImageApi } from "@utils/delete_image_from_cloudinary";

export default function TreatmentPackages() {
  const [isloading_for, setisloading_for] = useState("");
  const [all_currency, setall_currency] = useState([]);

  const [TreatmentPackages, setTreatmentPackages] = useState([
    {
      PackageAnnouncementDate: "",
      PackageName: "",
      PackageCurrency: "",
      PackagePrice: "",
      Discount: "",
      DiscountValidity: "",
      PackageImage: "",
      ShortDescription: "",
      LongDescription: "",
    },
  ]);

  const doctor_details = JSON.parse(localStorage.getItem("user"));

  // ====================================================
  // ✅ GET CURRENCY TYPES
  // ====================================================
  const get_all_currency = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList", {
        lookupcodes: "currency_type",
      });
      setall_currency(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ====================================================
  // ✅ GET SAVED TREATMENT PACKAGES
  // ====================================================
  const get_treatment_packages = async () => {
    try {
      const resp = await __getApiData(
        `/api/v1/asset-sections/treatment-packages/${doctor_details._id}`
      );

      if (resp.data?.data?.TreatmentPackages) {
        const normalized = resp.data.data.TreatmentPackages.map((pkg) => ({
          _id: pkg._id,
          PackageName: pkg.PackageName,
          PackagePrice: pkg.PackagePrice,
          PackageCurrency: pkg.PackageCurrency?._id,
          PackageImage: pkg.PackageImage,
          ShortDescription: pkg.ShortDescription,
          LongDescription: pkg.LongDescription,
          Discount: pkg.Discount,
          DiscountValidity: pkg.DiscountValidity,
          PackageAnnouncementDate: pkg.PackageAnnouncementDate,
        }));

        setTreatmentPackages(normalized);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    get_all_currency();
    get_treatment_packages();
  }, []);

  // ====================================================
  // ✅ HANDLE INPUTS (TEXT + SELECT + FILE)
  // ====================================================
  const handleChange = async (index, e) => {
    const { name, value, files } = e.target;

    // ------------------------------
    // ✅ If Image Upload
    // ------------------------------
    if (files) {
      setisloading_for(`upload-${index}`);

      try {
        const formData = new FormData();
        formData.append("file", files[0]);

        const resp = await __postApiData("/api/v1/common/AddImage", formData);

        if (resp.response?.response_code === "200") {
          const imageUrl = resp.data[0].full_URL;

          setTreatmentPackages((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], PackageImage: imageUrl };
            return updated;
          });
        }
      } catch (error) {
        console.error("Image upload error:", error);
      } finally {
        setisloading_for("");
      }

      return; // stop further execution
    }

    // ------------------------------
    // ✅ If Text/Select
    // ------------------------------
    setTreatmentPackages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
  };

  // ====================================================
  // ✅ ADD NEW PACKAGE ROW
  // ====================================================
  const addMore = () => {
    setTreatmentPackages((prev) => [
      ...prev,
      {
        PackageAnnouncementDate: "",
        PackageName: "",
        PackageCurrency: "",
        PackagePrice: "",
        Discount: "",
        DiscountValidity: "",
        PackageImage: "",
        ShortDescription: "",
        LongDescription: "",
      },
    ]);
  };

  // ====================================================
  // ✅ DELETE IMAGE FROM CLOUD
  // ====================================================
  const handleDeleteMedia = async (index) => {
    try {
      const url = TreatmentPackages[index].PackageImage;
      if (!url) return;

      await deleteImageApi(url);

      // Clear image from UI
      setTreatmentPackages((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], PackageImage: "" };
        return updated;
      });
    } catch (error) {
      console.log("Delete image error:", error);
    }
  };

  // ====================================================
  // ✅ DELETE PACKAGE
  // ====================================================
  const delete_treatment_package = async (id) => {
    try {
      const resp = await __deleteApiData(
        `/api/v1/asset-sections/treatment-packages/${doctor_details._id}/${id}`
      );

      if (resp.response?.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Package Deleted",
          text: resp.data.data.message,
          confirmButtonText: "OK",
        }).then(() => window.location.reload());
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ====================================================
  // ✅ SAVE TREATMENT PACKAGES
  // ====================================================
  const save_treatement_packages = async () => {
    setisloading_for("save");

    try {
      const payload = TreatmentPackages.map(({ _id, ...rest }) => rest);

      const resp = await __putApiData(
        `/api/v1/asset-sections/treatment-packages/${doctor_details._id}`,
        payload
      );

      if (resp.response?.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Saved",
          text: "Treatment Packages Updated",
          confirmButtonText: "OK",
        }).then(() => window.location.reload());
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    } finally {
      setisloading_for("");
    }
  };

  // ====================================================
  // ✅ UI STARTS HERE
  // ====================================================

  return (
    <>
      <div>
        {/* ===================== FIELDS ===================== */}
        {TreatmentPackages.map((pkg, index) => (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4" key={index}>
            <FormControl fullWidth size="small">
              <label className="form-label">Package Announcement Date</label>
              <TextField
                type="date"
                name="PackageAnnouncementDate"
                size="small"
                value={
                  pkg.PackageAnnouncementDate
                    ? pkg.PackageAnnouncementDate.split("T")[0]
                    : ""
                }
                onChange={(e) => handleChange(index, e)}
              />
            </FormControl>

            <FormControl fullWidth size="small">
              <label className="form-label">Package Name</label>
              <TextField
                name="PackageName"
                size="small"
                value={pkg.PackageName}
                onChange={(e) => handleChange(index, e)}
              />
            </FormControl>

            <FormControl fullWidth size="small">
              <label className="form-label">Package Currency</label>
              <Select
                name="PackageCurrency"
                value={pkg.PackageCurrency}
                onChange={(e) => handleChange(index, e)}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select Currency</em>
                </MenuItem>
                {all_currency.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.lookup_value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <label className="form-label">Package Price</label>
              <TextField
                name="PackagePrice"
                size="small"
                value={pkg.PackagePrice}
                onChange={(e) => handleChange(index, e)}
              />
            </FormControl>

            <FormControl fullWidth size="small">
              <label className="form-label">Discount</label>
              <TextField
                name="Discount"
                size="small"
                value={pkg.Discount}
                onChange={(e) => handleChange(index, e)}
              />
            </FormControl>

            <FormControl fullWidth size="small">
              <label className="form-label">Discount Validity</label>
              <TextField
                type="date"
                name="DiscountValidity"
                size="small"
                value={
                  pkg.DiscountValidity
                    ? pkg.DiscountValidity.split("T")[0]
                    : ""
                }
                onChange={(e) => handleChange(index, e)}
              />
            </FormControl>

            <FormControl fullWidth size="small">
              <label className="form-label">Short Description</label>
              <TextField
                name="ShortDescription"
                size="small"
                value={pkg.ShortDescription}
                onChange={(e) => handleChange(index, e)}
              />
            </FormControl>

            <FormControl fullWidth size="small">
              <label className="form-label">Long Description</label>
              <TextField
                name="LongDescription"
                size="small"
                value={pkg.LongDescription}
                onChange={(e) => handleChange(index, e)}
              />
            </FormControl>

            {/* ===================== IMAGE UPLOAD ===================== */}
            <div className="flex items-center gap-3">
              <input
                name="PackageImage"
                type="file"
                id={`package-image-upload-${index}`}
                style={{ display: "none" }}
                onChange={(e) => handleChange(index, e)}
              />

              <label
                htmlFor={`package-image-upload-${index}`}
                className="cursor-pointer flex items-center gap-2 text-blue-600"
              >
                <CloudUpload size={22} />
                <span>
                  Upload Image{" "}
                  {isloading_for === `upload-${index}` && (
                    <CircularProgress size={20} />
                  )}
                </span>
              </label>

              {pkg.PackageImage && (
                <span className="text-gray-700">1 file selected</span>
              )}
            </div>

            {/* ===================== DELETE PACKAGE BUTTON ===================== */}
            <FormControl fullWidth size="small">
              <label className="form-label" style={{ visibility: "hidden" }}>
                .
              </label>
              <button
                type="button"
                onClick={() => delete_treatment_package(pkg._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete Package
              </button>
            </FormControl>
          </div>

        ))}

        {/* Actions */}
        <div className="flex justify-between mt-4">
          <Button variant="outlined" onClick={addMore}>
            Add More
          </Button>


          <button onClick={save_treatement_packages} className="theme-btn-fill">
            <div className="px-10">
              Save
            </div>
          </button>
        </div>
      </div>

      {/* Global Loading */}
      {isloading_for === "save" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(255,255,255,0.7)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={70} />
        </div>
      )}
    </>
  );
}
