import Swal from "sweetalert2";
import api from "../api"; // adjust the path to your api instance

export const deleteImageApi = async (imageUrl) => {
  try {
    const res = await api.post("api/v1/common/DeleteImage", { imageUrl });

    if (res.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Details Updated",
        text: res.data.message || "Image deleted successfully",
        showConfirmButton: true,
        customClass: { confirmButton: "my-swal-button" },
      });
    }

    return res.data; // so calling component can also use the response
  } catch (err) {
    console.error("Error deleting image:", err);

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Failed to delete image. Please try again.",
    });

    throw err; // rethrow for component-specific handling if needed
  }
};
