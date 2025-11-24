import React, { useEffect, useState } from "react";
import { TextField, Button, FormControl } from "@mui/material";
import {
  __postApiData,
  __putApiData,
  __getApiData,
} from "@utils/api";
import Swal from "sweetalert2";
import UniqueLoader from "../../../../components/common/UniqueLoader";

export default function OnlineClinicLink() {
  const [isLoading, setIsLoading] = useState(false);
  const [onlineClinicLink, setOnlineClinicLink] = useState("");

  const doctorDetails = JSON.parse(localStorage.getItem("user"));

  // ----------------------- Fetch Existing Link -----------------------
  const getOnlineClinic = async () => {
    try {
      const resp = await __getApiData(
        `/api/v1/asset-sections/online-clinic/${doctorDetails._id}`
      );

      if (resp?.data?.OnlineClinicLink) {
        setOnlineClinicLink(resp.data.OnlineClinicLink);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOnlineClinic();
  }, []);

  // ----------------------- Save Link -----------------------
  const saveOnlineClinicLink = async () => {
    if (!onlineClinicLink.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Required",
        text: "Online clinic link cannot be empty.",
      });
    }

    setIsLoading(true);

    try {
      const payload = { OnlineClinicLink: onlineClinicLink };

      const resp = await __putApiData(
        `/api/v1/asset-sections/online-clinic/${doctorDetails._id}`,
        payload
      );

      if (resp?.response?.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Online clinic link saved successfully!",
          timer: 1800,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: resp?.response?.response_message?.errorType || "Error",
          text:
            resp?.response?.response_message?.error ||
            "Something went wrong",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Input Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <FormControl fullWidth size="small">
          <label className="form-label">Online Clinic Link</label>
          <TextField
            placeholder="Enter Online Clinic Link"
            size="small"
            value={onlineClinicLink}
            onChange={(e) => setOnlineClinicLink(e.target.value)}
          />
        </FormControl>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button onClick={saveOnlineClinicLink} className="theme-btn-fill">
          <div className="px-10">
            Save
          </div>
        </button>
      </div>

      {/* Loader Overlay */}
      {isLoading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(255, 255, 255, 0.6)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <UniqueLoader />
        </div>
      )}
    </>
  );
}
