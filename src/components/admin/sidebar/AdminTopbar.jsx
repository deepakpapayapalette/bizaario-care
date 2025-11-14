import React, { useEffect, useState, useRef } from "react";
import { Bell, Mail, Menu, Search } from "lucide-react";
import { Avatar } from "@mui/material";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

const AdminTopbar = ({ toggleShow }) => {
  const doctordetails = JSON.parse(localStorage.getItem("user")) || {};
  const [user, setUser] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef();

  const handleLogout = async () => {
    try {
      // OPTIONAL: Call API logout if needed
      // await api.post("/api/v1/admin/logout");

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.clear();

      navigate("/login");           // redirect to login page
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };


  // Fetch profile
  const getDoctor = async () => {
    try {
      const resp = await api.get(`api/v1/admin/GetAsset/${doctordetails._id}`);
      setUser(resp.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDoctor();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center w-full md:w-1/3">
        <Menu className="md:hidden cursor-pointer" onClick={() => toggleShow(true)} />

        {/* Search Bar */}
        <div className="hidden md:flex items-center w-full max-w-sm ml-3 bg-gray-100 rounded-md overflow-hidden">
          <input
            type="text"
            placeholder="Search..."
            className="flex-grow px-3 py-3 bg-transparent text-gray-700 outline-none"
          />
          <button className="bg-webprimary px-3 flex items-center justify-center">
            <Search className="text-white" size={20} />
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {/* Language */}
        <div className="hidden lg:flex items-center space-x-1 cursor-pointer">
          <span className="text-sm text-gray-700">English</span>
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Notifications */}
        <div className="relative hidden lg:block cursor-pointer">
          <Bell className="text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-webprimary text-white text-xs rounded-full px-1">
            1
          </span>
        </div>

        {/* Mail */}
        <div className="relative hidden lg:block cursor-pointer">
          <Mail className="text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-webprimary text-white text-xs rounded-full px-1">
            5
          </span>
        </div>

        <div className="hidden lg:block h-6 border-l border-gray-300"></div>

        {/* Profile */}
        <div
          className="hidden lg:flex items-center space-x-2 cursor-pointer relative"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          ref={dropdownRef}
        >
          <Avatar className="w-8 h-8 rounded-full" />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-primary">{doctordetails?.AssetName}</span>
            <span className="text-xs text-gray-500">{user?.AssetType || "Admin"}</span>
          </div>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute top-12 right-0 bg-white shadow-xl rounded-xl w-48 py-2 border border-gray-100 z-40">
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Change Password</li>
                <li className="border-t my-2"></li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600" onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile settings + search */}
        <div className="md:hidden flex items-center space-x-3 cursor-pointer">
          <Search className="text-gray-600" />
          <Menu onClick={() => setDropdownOpen(!dropdownOpen)} />
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
