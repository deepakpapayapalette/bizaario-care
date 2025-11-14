import React, { useEffect, useState, useRef } from 'react'
import { TextField, Paper, Select, MenuItem, FormControl, Box, Avatar, Tooltip, IconButton, CircularProgress, Button, Radio, FormControlLabel, RadioGroup, FormLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import api from '../../api'
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from 'react-router-dom';
// import ProfileCard1 from '../AllSubForms/UI/ProfileCard1';
// import ProfileCard2 from '../AllSubForms/UI/ProfileCard2';
import Swal from 'sweetalert2';
import ProfileCard1 from '../../components/doctor/patient-referral/ProfileCard1';
import ProfileCard2 from '../../components/doctor/patient-referral/ProfileCard2';
import { __postApiData, __putApiData, __getApiData } from "@utils/api";

const PatientReferral = () => {
  const [selectedOption, setSelectedOption] = useState("mobile");
  const [inputValue, setInputValue] = useState("");

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(20);
  const [isResendAvailable, setIsResendAvailable] = useState(false);
  const inputRefs = useRef([]);

  const [otpBox, setOtpBox] = useState(false);
  const [showReferralForm, setShowReferralForm] = useState(true);
  const [patientReferralPreview, setPatientReferralPreview] = useState(false);
  const [submittedPhone, setSubmittedPhone] = useState("");

  let phoneNumber = submittedPhone || inputValue;
  // console.log(showReferralForm, "showReferralForm")

  //=========================== get all patient details=========================================

  const navigate = useNavigate();

  const [patient_details, setpatient_details] = useState("");

  const get_patient_details = async () => {
    try {
      const resp = await __getApiData(`/api/v1/admin/getPatientbyphonenumber/${inputValue}`);
      console.log(resp);

      if (resp.response.response_code !== "200") {
        Swal.fire({
          icon: "error",
          title: "Not Found",
          text: "No patient found with the provided Mobile Number, UHID/EMR Number, or National ID. Please proceed with creating a new patient file.",
          showConfirmButton: true,
          customClass: {
            confirmButton: "my-swal-button",
            htmlContainer: "my-swal-text",
          },
        }).then(() => {
          setPatientReferralPreview(true);
        });
        return false; // ❌ not found
      }
      setpatient_details(resp.data);
      return true;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    get_patient_details();
  }, []);

  // ===============OTP-form==========================

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsResendAvailable(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    const newOtp = pastedData.split("").concat(["", "", "", ""]).slice(0, 4);
    setOtp(newOtp);
    // Focus the next empty input or the last input
    const nextIndex = Math.min(pastedData.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  // Verify OTP
  const handleVerifyOTP = () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      alert("Please enter complete OTP");
      return;
    }

    // Here you would typically verify the OTP with your backend
    // console.log('Verifying OTP:', otpValue);
    // alert(`Verifying OTP: ${otpValue}`);
    setPatientReferralPreview(true);
    setShowReferralForm(true);
    setOtpBox(false);
  };

  // Resend OTP
  const handleResendOTP = () => {
    setTimer(20);
    setIsResendAvailable(false);
    setOtp(["", "", "", ""]);
    inputRefs.current[0]?.focus();

    // Here you would typically make an API call to resend OTP
    // console.log('Resending OTP to:', phoneNumber);
    alert("New OTP sent!" + phoneNumber);
  };

  // Edit phone number
  const handleEdit = () => {
    // This would typically navigate back or show edit form
    // console.log('Edit phone number');
    // alert('Redirecting to edit phone number...');
    // setOpenOtp(false)
    // handlePatientReferral(true)
    // setReferralPreview(true)
    setShowReferralForm(true);
    setOtpBox(false);
  };

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // ==============referral-form========================
  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setInputValue(""); // Clear input when switching options
  };

  const [show_add_patient_button, setshow_add_patient_button] = useState("");

  const handleGenerateOTP = async () => {
    const patientFound = await get_patient_details();
    if (!patientFound) {
      setshow_add_patient_button("not exist");

      return; // ❌ stop here, no OTP box
    }
    setshow_add_patient_button("exist");

    if (!validateInput()) {
      alert("Please enter a valid value");
      return;
    }

    // capture the phone (or other identifier) at submit time
    if (selectedOption === "mobile") {
      setSubmittedPhone(inputValue);
    } else {
      setSubmittedPhone("");
    }

    setOtpBox(true);
    setShowReferralForm(false);
  };

  const getPlaceholderText = () => {
    switch (selectedOption) {
      case "mobile":
        return "Mobile Number";
      case "uhid":
        return "UHID/EMR Number";
      case "national digital id":
        return "National Digital Id";
      default:
        return "Enter value";
    }
  };

  const validateInput = () => {
    if (!inputValue.trim()) return false;

    switch (selectedOption) {
      case "mobile":
        return /^[0-9]{10}$/.test(inputValue);
      case "uhid":
        return inputValue.length >= 5;
      case "national digital id":
        return inputValue.length >= 5;
      default:
        return true;
    }
  };

  useEffect(() => {
    if (patientReferralPreview) {
      setShowReferralForm(false);
    }
  }, [patientReferralPreview]);

  return (
    <div className='container mt-8'>
      <div className="content-wrapper">
        <div className="main-content">
          {/* ===========Form Section =================*/}
          {/* {showReferralForm ? ( */}

          <div className="flex justify-center">
            <div className={`p-6 ${showReferralForm ? "block" : "hidden"} `}>
              <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">
                      Patient Referral Services
                    </h1>
                  </div>

                  {/* <div className="flex justify-end pb-3 mt-[-10px]">
            <IconButton size="small" className="x-icon" onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </div> */}
                </div>
                <div className="space-y-6">
                  {/* Instructions */}
                  <div className="mb-6">
                    <p className="font-medium text-gray-700">
                      Please enter the following
                    </p>
                  </div>

                  {/* Radio Button Options */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-6">
                      {/* Mobile Number Option */}
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <div className="relative">
                          <input
                            type="radio"
                            name="referralOption"
                            value="mobile"
                            checked={selectedOption === "mobile"}
                            onChange={() => handleOptionChange("mobile")}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOption === "mobile"
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-400 bg-white"
                              }`}
                          >
                            {selectedOption === "mobile" && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                        </div>
                        <span className="font-medium text-gray-700">
                          Mobile Number
                        </span>
                      </label>

                      {/* UHID/EMR Number Option */}
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <div className="relative">
                          <input
                            type="radio"
                            name="referralOption"
                            value="uhid"
                            checked={selectedOption === "uhid"}
                            onChange={() => handleOptionChange("uhid")}
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOption === "uhid"
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-400 bg-white"
                              }`}
                          >
                            {selectedOption === "uhid" && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                        </div>
                        <span className="font-medium text-gray-700">
                          UHID/EMR Number
                        </span>
                      </label>

                      {/* Citizen ID Option */}
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <div className="relative">
                          <input
                            type="radio"
                            name="referralOption"
                            value="national digital id"
                            checked={selectedOption === "national digital id"}
                            onChange={() =>
                              handleOptionChange("national digital id")
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedOption === "national digital id"
                              ? "border-blue-600 bg-blue-600"
                              : "border-gray-400 bg-white"
                              }`}
                          >
                            {selectedOption === "national digital id" && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                        </div>
                        <span className="font-medium text-gray-700">
                          National Digital ID
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Input and Button Section */}
                  <div className="flex items-center mt-8 space-x-4">
                    {/* Input Field */}
                    <div className="flex-1 max-w-sm">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => {
                          const raw = e.target.value;
                          if (selectedOption === "mobile") {
                            const digitsOnly = raw
                              .replace(/\D/g, "")
                              .slice(0, 10);
                            setInputValue(digitsOnly);
                          } else {
                            setInputValue(raw);
                          }
                        }}
                        placeholder={getPlaceholderText()}
                        maxLength={
                          selectedOption === "mobile" ? 10 : undefined
                        }
                        inputMode={
                          selectedOption === "mobile" ? "numeric" : undefined
                        }
                        className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Generate OTP Button */}
                    <button
                      onClick={handleGenerateOTP}
                      disabled={!validateInput()}
                      className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${validateInput()
                        ? "bg-webprimary hover:bg-slate-700 cursor-pointer"
                        : "bg-gray-500 cursor-not-allowed"
                        }`}
                    >
                      {/* <Link to="/patient-referral/patient-verify"> */}
                      Generate OTP
                      {/* </Link> */}
                    </button>
                  </div>

                  {/* Validation Message */}
                  {inputValue && !validateInput() && (
                    <div className="mt-2 text-sm text-red-600">
                      {selectedOption === "mobile" &&
                        "Please enter a valid 10-digit mobile number"}
                      {selectedOption === "uhid" &&
                        "Please enter a valid UHID/EMR number (minimum 5 characters)"}
                      {selectedOption === "national digital id" &&
                        "Please enter a valid Citizen ID (minimum 5 characters)"}
                    </div>
                  )}
                </div>
              </Paper>
            </div>
          </div>
          {/* )  : <></> } */}

          {/*===================== =========== OTP-Preview =================================================*/}
          {otpBox ? (
            <div className="flex justify-center">
              <div
                className="p-6"
              // style={{ backgroundColor: '#f2f3f6' }}
              >
                <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between ">
                      <h1 className="mb-4 text-2xl font-bold text-gray-900">
                        Verify Phone
                      </h1>
                    </div>

                    {/* Phone Number Display */}
                    <div className="flex gap-10">
                      <div>
                        <span className="text-gray-700">OTP sent to </span>
                        <span className="font-semibold text-gray-900">
                          {phoneNumber}
                        </span>
                      </div>
                      <button
                        onClick={handleEdit}
                        className="font-medium text-blue-600 underline transition-colors hover:text-blue-700"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* OTP Input Section */}
                  <div className="mb-8">
                    <label className="block mb-4 font-medium text-gray-700">
                      Enter OTP
                    </label>

                    {/* OTP Input Boxes */}
                    <div className="flex space-x-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => (inputRefs.current[index] = el)}
                          type="text"
                          maxLength="1"
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          className="w-16 h-16 text-xl font-semibold text-center transition-colors border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          style={{ backgroundColor: "#f8f9fa" }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Verify Button */}
                  <button
                    onClick={handleVerifyOTP}
                    disabled={otp.join("").length !== 4}
                    className={`w-48 py-4 rounded-lg font-medium text-white transition-colors mb-6 ${otp.join("").length === 4
                      ? "bg-slate-600 hover:bg-slate-700 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                      }`}
                  >
                    Verify OTP
                  </button>

                  {/* Timer and Resend Section */}
                  <div className="flex gap-6">
                    <div className="text-gray-600">
                      {!isResendAvailable ? (
                        <span>Available in {formatTime(timer)} Sec</span>
                      ) : (
                        <span className="text-green-600">
                          Ready to resend
                        </span>
                      )}
                    </div>

                    <button
                      onClick={handleResendOTP}
                      disabled={!isResendAvailable}
                      className={`font-medium underline transition-colors ${isResendAvailable
                        ? "text-blue-600 hover:text-blue-700 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                        }`}
                    >
                      Resend OTP
                    </button>
                  </div>
                </Paper>
              </div>
            </div>
          ) : (
            <> </>
          )}

          {/* =========== referralPreview-Preview =================*/}
          {patientReferralPreview ? (
            <div className="p-6">
              <div className="flex flex-col gap-4 lg:flex-row">
                <Paper
                  elevation={3}
                  sx={{ p: 2, borderRadius: 2 }}
                  className="w-full"
                >
                  <div className="flex flex-col w-full gap-4 lg:flex-row">
                    <div className="flex-1">
                      <ProfileCard1 patient_details={patient_details} />
                    </div>
                    <div className="flex-1">
                      <ProfileCard2 patient_details={patient_details} />
                    </div>
                  </div>
                </Paper>
              </div>

              <div
                className="mt-4"
                style={{
                  display:
                    show_add_patient_button === "exist" ? "block" : "none",
                }}
              >
                <div className="flex justify-center">
                  <div className="flex gap-4 ">
                    <button
                      onClick={() =>
                        navigate("/doctordashboard/patient-referral-home", {
                          state: { patient_details },
                        })
                      }
                      className={`theme-btn-ouline
                   `}
                    >
                      <div className='px-10'>

                        Edit
                      </div>
                    </button>
                    <button
                      className={`theme-btn-fill `}
                    >
                      <div className='px-10'>
                        Preview
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div
                className="mt-4"
                style={{
                  display:
                    show_add_patient_button === "not exist"
                      ? "block"
                      : "none",
                }}
              >
                <div className="flex justify-center">
                  <div className="flex gap-4 ">
                    <button
                      onClick={() => navigate("/add-new-patient")}
                      className={`px-6 py-3 rounded-lg font-medium text-[var(--primary-color)] transition-colors border-[var(--primary-color)]  border-2 hover:bg-[var(--primary-color)] cursor-pointer
                      hover:text-white
                      w-[140px]
                   `}
                    >
                      Add Patient
                    </button>
                    <button
                      className={`px-6 py-3 rounded-lg font-medium text-white transition-colors bg-[var(--primary-color)] hover:bg-slate-700 cursor-pointer
                      w-[140px]
                   `}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <> </>
          )}
        </div>
      </div >
    </div >
  )
}

export default PatientReferral

