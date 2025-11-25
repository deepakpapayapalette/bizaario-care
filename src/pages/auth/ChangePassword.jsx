import React, { useState } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import { __postApiData, __putApiData, __getApiData } from "@utils/api";

const ChangePassword = ({ doctordetails }) => {
  const user = doctordetails || JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      return setMsg({ type: "error", text: "New passwords do not match!" });
    }

    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      const res = await __postApiData("/api/v1/admin/ChangePassword", {
        userId: userId,
        currentPassword: currentPassword,
        newPassword: newPassword,
      });

      setMsg({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      const errMsg =
        error?.response?.message || "Failed to change password!";
      setMsg({ type: "error", text: errMsg });
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10 lg:mt-12 xl:mt-20">
      {/* Heading */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Change Password
      </h2>

      {/* Message */}
      {msg.text && (
        <p
          className={`text-center mb-4 text-sm font-medium ${msg.type === "success" ? "text-green-600" : "text-red-600"
            }`}
        >
          {msg.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type={showCurrent ? "text" : "password"}
            placeholder="Current Password"
            className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-600"
            onClick={() => setShowCurrent(!showCurrent)}
          >
            {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type={showNew ? "text" : "password"}
            placeholder="New Password"
            className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-600"
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm New Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm New Password"
            className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-3 text-gray-600"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 text-white bg-webprimary hover:bg-webhoverprimary rounded-xl font-medium hover:opacity-90 transition flex justify-center items-center"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={22} />
          ) : (
            "Update Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
