
import React from 'react';
import { Plus, Edit } from 'lucide-react';
import { useEffect, useState, useRef } from 'react'
import { TextField, Select, MenuItem, FormControl, Button, } from '@mui/material';
import api from '../../../../../api'
import Swal from 'sweetalert2';
import UniqueLoader from '../../../../loader';
import { customMenuProps } from '../../../../../utils/mui_select_scroll_bar';
import { Modal, } from 'react-bootstrap';



const ChiefComplaintsForCurrentProblem = ({ patientId, selected_case_file, case_file_data, onRefresh }) => {


  const doctordetails = JSON.parse(localStorage.getItem("user"))


  // Function to render severity grade as color bars
  const renderSeverityGrade = (severity) => {
    const segments = [
      { color: 'bg-green-600', active: severity >= 1 },
      { color: 'bg-green-500', active: severity >= 2 },
      { color: 'bg-yellow-300', active: severity >= 3 },
      { color: 'bg-yellow-500', active: severity >= 4 },
      { color: 'bg-orange-400', active: severity >= 5 },
      { color: 'bg-red-600', active: severity >= 6 },
    ];

    return (
      <div className="flex items-center space-x-1">
        {segments.map((segment, index) => (
          <div
            key={index}
            className={`h-6 ${index === 4 ? 'w-8' : 'w-8'} ${segment.active ? segment.color : 'bg-gray-200'
              } ${index === 4 ? 'rounded-none' : 'rounded-sm'}`}
          />
        ))}
      </div>
    );
  };


  const [medical_history, setmedical_history] = useState({
    ChiefComplaints: [{
      Symptoms: [],
      Duration: { Value: "", Unit: "" },
      SeverityGrade: '',
      AggravatingFactors: []
    }],

  });




  const handleChiefComplaintsChange = (index, field, value, subField = null) => {
    setmedical_history(prev => {
      const updatedChiefComplaints = [...prev.ChiefComplaints];
      const complaint = { ...updatedChiefComplaints[index] };

      if (subField) {
        // For nested objects like Duration {Value, Unit}
        complaint[field] = {
          ...complaint[field],
          [subField]: value
        };
      } else {
        // For direct fields like SeverityGrade, Symptoms, AggravatingFactors
        complaint[field] = value;
      }

      updatedChiefComplaints[index] = complaint;

      return {
        ...prev,
        ChiefComplaints: updatedChiefComplaints
      };
    });
  };

  const toggleArrayField = (index, field, item) => {
    setmedical_history(prev => {
      const updatedChiefComplaints = [...prev.ChiefComplaints];
      const complaint = { ...updatedChiefComplaints[index] };
      const currentArray = complaint[field] || [];

      const itemId = typeof item === "string" ? item : item?._id;

      // Check if item exists
      const exists = currentArray.some(s =>
        typeof s === "string" ? s === itemId : s?._id === itemId
      );

      if (exists) {
        // Remove item
        complaint[field] = currentArray.filter(s =>
          typeof s === "string" ? s !== itemId : s._id !== itemId
        );
      } else {
        // Add item
        complaint[field] = [...currentArray, item];
      }

      updatedChiefComplaints[index] = complaint;

      return {
        ...prev,
        ChiefComplaints: updatedChiefComplaints,
      };
    });
  };



  //========================================= color bar=============================================

  const renderColorBar = (index) => {
    const segments = [
      { color: 'bg-green-600', title: "H1", desc: "Mild", value: 1 },
      { color: 'bg-green-500', title: "H2", desc: "Mild", value: 2 },
      { color: 'bg-yellow-300', title: "H3", desc: "Mild", value: 3 },
      { color: 'bg-yellow-500', title: "H4", desc: "Mild", value: 4 },
      { color: 'bg-orange-400', title: "H5", desc: "Mild", value: 5 },
      { color: 'bg-red-600', title: "H6", desc: "Mild", value: 6 },
    ];

    // Map bg classes to corresponding text color classes
    const textColorMap = {
      'bg-green-600': 'text-green-600',
      'bg-green-500': 'text-green-500',
      'bg-yellow-300': 'text-yellow-300',
      'bg-yellow-500': 'text-yellow-500',
      'bg-orange-400': 'text-orange-400',
      'bg-red-600': 'text-red-600',
    };

    const handleClick = (value) => {
      setmedical_history(prev => {
        const updatedChiefComplaints = [...prev.ChiefComplaints];
        updatedChiefComplaints[index] = {
          ...updatedChiefComplaints[index],
          SeverityGrade: value,
        };
        return { ...prev, ChiefComplaints: updatedChiefComplaints };
      });
    };

    const selectedValue = medical_history.ChiefComplaints[index].SeverityGrade;
    const selectedSegment = segments.find(seg => seg.value === selectedValue);

    return (
      <div>
        {/* Color Bar */}
        <div className="flex w-full h-10 mb-2">
          {segments.map((segment, idx) => (
            <div
              key={idx}
              onClick={() => handleClick(segment.value)}
              className={`flex-1 flex flex-col items-center justify-center cursor-pointer ${segment.color} text-white hover:opacity-80 transition`}
            >
              <span className="text-sm font-bold">{segment.title}</span>
              <span className="text-xs">{segment.desc}</span>
            </div>
          ))}
        </div>

        {/* Selected Value with matching text color */}
        <div style={{ display: selectedSegment ? "block" : "none", position: "absolute" }} className={`text-center font-semibold py-1 ${textColorMap[selectedSegment?.color] || 'text-black'}`}>
          Value: {selectedValue || "-"}
        </div>
      </div>
    );
  };



  // ==============================all add more function start=====================================

  const handleAddMore = () => {
    setmedical_history(prev => ({
      ...prev,
      ChiefComplaints: [
        ...(prev.ChiefComplaints || []),
        { Symptoms: [], Duration: "", SeverityGrade: "", AggravatingFactors: [] } // new item
      ],
    }));
  };


  //============================ get symptom class data=======================================


  const [all_symptom_class_master, setall_symptom_class_master] = useState([])
  const getall_symptom_class_master = async () => {
    try {
      const resp = await api.post('api/v1/admin/LookupList/', { lookupcodes: "symptom_class_type" })
      setall_symptom_class_master(resp.data.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getall_symptom_class_master()

  }, [])


  //============================ get symptom master data=======================================


  const [all_symptom_master, setall_symptom_master] = useState([])

  const [selectedSymptomClass, setSelectedSymptomClass] = useState([]);

  const handleSymptomClassClick = (id) => {
    setSelectedSymptomClass((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };


  const getall_symptom_master = async (selectedSymptomClass) => {

    if (!selectedSymptomClass || selectedSymptomClass.length === 0) return;

    try {
      const resp = await api.post('api/v1/admin/LookupList/', {
        lookupcodes: "symptom_master",
        parent_lookup_id: selectedSymptomClass, // send array or first ID
      });



      setall_symptom_master(resp.data.data);
    } catch (error) {
      console.error(error);
    }
  };





  useEffect(() => {
    getall_symptom_master(selectedSymptomClass);
  }, [selectedSymptomClass]);




  //= ================================get all aggravatingFactor======================================


  const [allaggravating_master, setallaggravating_master] = useState([])
  const getall_aggravating_master = async () => {
    try {
      const resp = await api.post('api/v1/admin/LookupList/', { lookupcodes: "aggravating_factor_master" })
      setallaggravating_master(resp.data.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getall_aggravating_master()

  }, [])

  //================================== get unit list============================================

  const [all_unit_list, setall_unit_list] = useState([])
  const getall_unitlist = async () => {
    try {
      const resp = await api.post('api/v1/admin/LookupList/', { lookupcodes: "duration_unit_type" })
      setall_unit_list(resp.data.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getall_unitlist()

  }, [])




  const [isloading, setisloading] = useState(false)

  const save_chif_complaints = async () => {
    setisloading(true);
    try {
      const payload =
      {
        ...medical_history,
        CaseFileId: patient_all_cheif_complaints[0].caseFileId._id,
        CreatedBy: doctordetails._id

      }


      const resp = await api.post(
        `api/v1/admin/medical-history/chief-complaints/add-multiple`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );



      const { response_code, response_message } = resp.data.response;

      if (response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Details Added",
          text: "Chief Complaints Added Successfully...",
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        }).then(() => {
          // window.location.reload();
          onRefresh()
        });
      } else if (response_code === "400") {
        // Show server validation error here
        Swal.fire({
          icon: "error",
          title: response_message.errorType || "Error",
          text: response_message.error,
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        });
      } else {
        // Optional: handle other response codes
        Swal.fire({
          icon: "warning",
          title: "Unexpected response",
          text: "Something went wrong. Please try again.",
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Request failed",
        text: error.message || "Something went wrong",
        showConfirmButton: true,
        customClass: { confirmButton: "my-swal-button" },
      });
    } finally {
      setisloading(false);
    }
  };


  const [patient_all_cheif_complaints, setpatient_all_cheif_complaints] = useState([])

  const getall_patient_medical_history = async () => {
    try {
      //  setLoadingSpeciality(true);
      const resp = await api.get(`api/v1/admin/medical-history/list?PatientId=${patientId}&Status=Ongoing`);

      const formatted = resp.data.data.list.map(item => ({
        caseFileId: item.CaseFileId,
        complaints: item.ChiefComplaints
      }));
      setpatient_all_cheif_complaints(formatted);



    } catch (error) {
      console.error(error);
    } finally {
      //  setLoadingSpeciality(false);
    }
  };

  useEffect(() => {
    getall_patient_medical_history()
  }, [])


  //========================== modal open or close start==========================================

  const [show, setShow] = useState(false)
  const handleShow = async () => {
    setisloading(true);

    try {
      // ✅ If no medical history exists, save and then fetch
      if (!patient_all_cheif_complaints || patient_all_cheif_complaints.length === 0) {
        await save_patient_case_file();
        await getall_patient_medical_history();
      } else {
        // ✅ If already available, just refresh data
        await getall_patient_medical_history();
      }

      setShow(true); // ✅ open modal after data ready
    } catch (error) {
      console.error("Error while opening modal:", error);
    } finally {
      setisloading(false);
    }
  };
  //       const hasLoadedOnce = useRef(false); // ✅ remember if it ran already

  // const handleShow = async () => {
  //   setShow(true);

  //   // ✅ run only once
  //   if (!hasLoadedOnce.current) {
  //     setisloading(true);
  //     await save_patient_case_file();
  //     await getall_patient_medical_history();
  //     hasLoadedOnce.current = true; // ✅ mark as done
  //     setisloading(false);
  //   }
  // };

  const handleClose = () => setShow(false);


  //====================== onchage event for ChiefComplaints start=================================



  // ==============================edit chief complaints============================================

  const [showEdit, setShowEdit] = useState(false)

  const handleShowEdit = () => {
    if (patient_all_cheif_complaints && patient_all_cheif_complaints.length > 0 && patient_all_cheif_complaints[0].complaints) {
      const normalizedComplaints = patient_all_cheif_complaints[0].complaints.map(
        ({ createdAt, updatedAt, _id, ...cc }) => ({
          ...cc,
          Symptoms: cc.Symptoms?.map((s) => (typeof s === "string" ? s : s?._id)),
          AggravatingFactors: cc.AggravatingFactors?.map((a) =>
            typeof a === "string" ? a : a._id
          ),
          Duration: {
            Value: cc.Duration?.Value || "",
            Unit:
              typeof cc.Duration?.Unit === "string"
                ? cc.Duration.Unit
                : cc.Duration?.Unit?._id || "",
          },
        })
      );

      setmedical_history((prev) => ({
        ...prev,
        ChiefComplaints: normalizedComplaints,
      }));

    }

    setShowEdit(true);
  };


  const handleCloseEdit = () => {
    setShowEdit(false);
    setmedical_history({
      ChiefComplaints: [
        {
          Symptoms: [],
          Duration: { Value: "", Unit: "" },
          SeverityGrade: "",
          AggravatingFactors: [],
        },
      ],
    });
  };




  const update_chif_complaints = async () => {
    setisloading(true);
    try {
      const payload =
      {
        ...medical_history,
        CaseFileId: patient_all_cheif_complaints[0].caseFileId._id,
        UpdatedBy: doctordetails._id
      }


      const resp = await api.put(
        `api/v1/admin/medical-history/chief-complaints/edit-multiple`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { response_code, response_message } = resp.data.response;

      if (response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Details Added",
          text: "Chief Complaints Updated Successfully...",
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        }).then(() => {
          // window.location.reload();
          onRefresh()
        });
      } else if (response_code === "400") {
        // Show server validation error here
        Swal.fire({
          icon: "error",
          title: response_message.errorType || "Error",
          text: response_message.error,
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        });
      } else {
        // Optional: handle other response codes
        Swal.fire({
          icon: "warning",
          title: "Unexpected response",
          text: "Something went wrong. Please try again.",
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Request failed",
        text: error.message || "Something went wrong",
        showConfirmButton: true,
        customClass: { confirmButton: "my-swal-button" },
      });
    } finally {
      setisloading(false);
    }
  };


  //=================== auto generate medical case file for ongoing status============================

  const [medical_case_file, setmedical_case_file] = useState({
    ParentCaseFileId: null,
    TreatmentType: 'OPD Visit Record',
    DoctorId: doctordetails._id,
    DoctorName: '',
    HospitalId: null,
    HospitalName: '',
    Date: new Date().toISOString().split('T')[0],
    MedicalSpeciality: null,
    Status: "Ongoing",
    Disease: [],
    Accident: []
  });

  const save_patient_case_file = async () => {
    // setisloading_for(true);
    try {
      const payload = {
        ...medical_case_file,
        PatientId: patientId
      }
      const resp = await api.post(
        `api/v1/admin/patientCaseFile/savepatientCaseFile`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );




      // const { response_code, response_message } = resp.data.response;

      // if (response_code === "200") {
      //   Swal.fire({
      //     icon: "success",
      //     title: "Details Added",
      //     text: "Medical Case File Added Successfully...",
      //     showConfirmButton: true,
      //     customClass: { confirmButton: "my-swal-button" },
      //   }).then(() => {
      //     window.location.reload();
      //   });
      // } else if (response_code === "400") {

      //   Swal.fire({
      //     icon: "error",
      //     title: response_message.errorType || "Error",
      //     text: response_message.error,
      //     showConfirmButton: true,
      //     customClass: { confirmButton: "my-swal-button" },
      //   });
      // } else {

      //   Swal.fire({
      //     icon: "warning",
      //     title: "Unexpected response",
      //     text: "Something went wrong. Please try again.",
      //     showConfirmButton: true,
      //     customClass: { confirmButton: "my-swal-button" },
      //   });
      // }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Request failed",
        text: error.message || "Something went wrong",
        showConfirmButton: true,
        customClass: { confirmButton: "my-swal-button" },
      });
    } finally {
      // setisloading_for(false);
    }
  };



  return (
    <div className="space mt-4">


      {/* Header */}
      <div className="flex items-center justify-between mt-2  border-b border-gray-200">
        <h3 className="text-xxl font-semibold text-gray-900">
          Chief Complaints
        </h3>
        {/* <div className="flex items-center space-x-4" style={{display:selected_case_file?"flex":"none"}}> */}
        <div className="flex items-center space-x-4" >
          <button className="flex items-center space-x-2 text-[var(--primary-color)] hover:text-blue-700 transition-colors">
            <span className="text-sm font-medium underline" onClick={handleShow}>Add</span>
            <Plus className="w-4 h-4" />
          </button>
          <button className="flex items-center space-x-2 text-[var(--primary-color)] hover:text-blue-700 transition-colors">
            <Edit className="w-4 h-4" />
            <span className="text-sm font-medium underline" onClick={handleShowEdit}>Edit</span>
          </button>
        </div>
      </div>

      {/* Table */}

      {/* Show case_file_data section */}
      {/* <div
  className="overflow-x-auto"
  style={{ display: selected_case_file ? "block" : "none" }}
>

  <div className="bg-[var(--button-back-color)] text-white">
    <div className="grid grid-cols-4 gap-4 p-2 text-[20px]">
      <h3 className="table-header">Chief Complaints</h3>
      <h3 className="table-header">Duration (Months)</h3>
      <h3 className="table-header">Severity Grade</h3>
      <h3 className="table-header">Aggravating Factor (s)</h3>
    </div>
  </div>


  <div className="divide-y divide-gray-200">
    {case_file_data?.length > 0 && case_file_data[0]?.Status === "Ongoing" &&
    case_file_data[0]?.ChiefComplaints?.map((item, index) => (
      <div
        key={item.id}
        className={`grid grid-cols-4 gap-4 p-4 ${
          index % 2 === 0 ? "bg-[#f2f3f6]" : "bg-white"
        }`}
      >
        <div className="text-sm text-gray-900 font-medium table-body">
            {item?.Symptoms?.map(sym => sym?.lookup_value).join(", ")}
        </div>
        <div className="text-sm text-gray-900">
          {item?.Duration?.Value} {item.Duration?.Unit?.lookup_value}
        </div>
        <div className="flex items-center">
          {renderSeverityGrade(item?.SeverityGrade)}
        </div>
        <div className="text-sm text-gray-900">
          {item?.AggravatingFactors?.map(ag => ag?.lookup_value).join(", ")}
        </div>
      </div>
    ))}
  </div>
</div> */}

      {/* Show patient_all_cheif_complaints section only if case_file_data is empty */}
      {
        // (!case_file_data || case_file_data.length === 0) &&
        patient_all_cheif_complaints.map((caseFile, caseIndex) => (
          <div key={caseFile.caseFileId} className="mb-6">
            {/* Case File Header */}
            <h3 className="text-xl font-bold mb-2">
              {caseFile.caseFileId.TreatmentType} (Case File ID: {caseFile.caseFileId._id})-
              {new Date(caseFile.caseFileId.Date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}

            </h3>

            {/* Table Header */}
            <div className="bg-[var(--button-back-color)] text-white">
              <div className="grid grid-cols-4 gap-4 p-2 text-[16px] font-semibold">
                <h3 className="table-header">Chief Complaints</h3>
                <h3 className="table-header">Duration</h3>
                <h3 className="table-header">Severity Grade</h3>
                <h3 className="table-header">Aggravating Factor(s)</h3>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {caseFile.complaints.map((item, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-4 gap-4 p-4 ${index % 2 === 0 ? "bg-[#f2f3f6]" : "bg-white"
                    }`}
                >
                  {/* Chief Complaints Symptoms */}


                  <div className="text-sm text-gray-900 font-medium table-body">
                    {item?.Symptoms?.map(sym => sym?.lookup_value).join(", ") || "—"}
                  </div>

                  {/* Duration */}
                  <div className="text-sm text-gray-900 table-body">
                    {item?.Duration?.Value || "—"} {item?.Duration?.Unit?.lookup_value || ""}
                  </div>

                  {/* Severity Grade */}
                  <div className="flex items-center table-body">
                    {renderSeverityGrade(item?.SeverityGrade)}
                  </div>

                  {/* Aggravating Factors */}
                  <div className="text-sm text-gray-900 table-body">
                    {(item?.AggravatingFactors || [])
                      .map(ag => ag?.lookup_value)
                      .join(", ") || "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}



      {/* Footer Note */}
      <div className="p-4 bg-gray-50 border-t border-gray-200" style={{ display: selected_case_file ? "flex" : "none" }}>
        <p className="text-xs text-gray-600">
          1. Added By Dr Gaurav Pande (Cardiology) (Regards M1234), (Contact 8373915529, Date/ Time 20 Sep 2025, 11:57 AM IST, Noida
        </p>
      </div>


      <Modal show={show} onHide={handleClose} centered size="lg">

        <Modal.Header closeButton>
          <Modal.Title className='form-title'>Add Medical History(Chief Complaints) </Modal.Title>
        </Modal.Header>
        <Modal.Body>


          <div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">

              {/*======================== chief complaints============================================ */}

              <div className='col-span-2'>
                <h5 className='form-title'>Chief Complaints</h5>
                {medical_history.ChiefComplaints.map((details, index) => (

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">

                    <div className="col-span-2">
                      <FormControl fullWidth size="small">
                        <label className="form-label">Symptom Class</label>
                        <div className="flex flex-wrap gap-2">
                          {all_symptom_class_master.map((item) => {
                            const selected = selectedSymptomClass.includes(item._id);
                            return (
                              <span
                                key={item._id}
                                onClick={() => handleSymptomClassClick(item._id)}
                                className={`px-3 py-1 text-sm rounded-md cursor-pointer flex items-center gap-2
              ${selected ? 'bg-blue-500 text-white' : 'bg-[#e2e4f4] text-gray-800'}`}
                              >
                                {item.lookup_value}
                                {selected && (
                                  <span
                                    className="ml-1 text-xs font-bold cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSymptomClassClick(item._id);
                                    }}
                                  >
                                    ✕
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      </FormControl>
                    </div>



                    <div className="col-span-2">
                      <FormControl fullWidth size="small">
                        <label className="form-label">Compliant </label>
                        <div className="flex flex-wrap gap-2">
                          {all_symptom_master?.map((item) => {
                            const selected = (details?.Symptoms || []).includes(item._id);
                            return (
                              <span
                                key={item._id}
                                onClick={() => toggleArrayField(index, "Symptoms", item._id)}
                                className={`px-3 py-1 text-sm rounded-md cursor-pointer flex items-center gap-2
                                        ${selected ? 'bg-blue-500 text-white' : 'bg-[#e2e4f4] text-gray-800'}`}
                              >
                                {item.lookup_value}
                                {selected && (
                                  <span
                                    className="ml-1 text-xs font-bold cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // handleSymptomSelect(item._id,index);
                                    }}
                                  >
                                    ✕
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      </FormControl>
                    </div>




                    <div className="col-span-2">
                      <FormControl fullWidth size="small">
                        <label className="form-label">Aggravating Factors</label>
                        <div className="flex flex-wrap gap-2">
                          {allaggravating_master.map((item) => {
                            const selected = (details?.AggravatingFactors || []).includes(item._id);
                            return (
                              <span
                                key={item._id}
                                onClick={() => toggleArrayField(index, "AggravatingFactors", item._id)}
                                className={`px-3 py-1 text-sm rounded-md cursor-pointer flex items-center gap-2
                          ${selected ? 'bg-blue-500 text-white' : 'bg-[#e2e4f4] text-gray-800'}`}
                              >
                                {item.lookup_value}
                                {selected && (
                                  <span
                                    className="ml-1 text-xs font-bold cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // handleSymptomSelect(item._id,index);
                                    }}
                                  >
                                    ✕
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      </FormControl>
                    </div>



                    <FormControl fullWidth size="small">
                      <label className="form-label">Duration</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {/* Number input */}
                        <TextField
                          type="number"
                          name="Value"
                          placeholder="Enter Number"
                          size="small"
                          value={details.Duration.Value}
                          onChange={(e) => handleChiefComplaintsChange(index, "Duration", e.target.value, "Value")}
                          style={{ flex: 1 }}
                        />

                        <Select
                          labelId="content-type-label"
                          name="InvestigationCategory"
                          value={details.Duration.Unit}
                          onChange={(e) => handleChiefComplaintsChange(index, "Duration", e.target.value, "Unit")}
                          displayEmpty
                          MenuProps={customMenuProps}
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: "#9ca3af" }}>Unit </span>;
                            }
                            return all_unit_list?.find((item) => item._id === selected)?.lookup_value;
                          }}
                        >
                          <MenuItem value="">
                            <em>Unit </em>
                          </MenuItem>
                          {all_unit_list?.map((type) => (
                            <MenuItem key={type._id} value={type._id}>
                              {type.lookup_value}
                            </MenuItem>
                          ))}


                        </Select>

                      </div>
                    </FormControl>

                    <FormControl fullWidth size="small">
                      <label className="form-label">Severity Grade </label>
                      {renderColorBar(index)}
                    </FormControl>

                    <div className="flex justify-between mt-2">
                      <Button
                        style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                        onClick={handleAddMore}
                      >
                        Add More
                      </Button>


                    </div>

                  </div>



                ))}

              </div>

            </div>



            <div className="flex justify-end mt-4">


              <Button
                style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                onClick={save_chif_complaints}
              >
                Save
              </Button>
            </div>


          </div>

        </Modal.Body>


      </Modal>



      {/* ====================================edit modal ============================================*/}


      <Modal show={showEdit} onHide={handleCloseEdit} centered size="lg">

        <Modal.Header closeButton>
          <Modal.Title className='form-title'>Edit Medical History(Chief Complaints) </Modal.Title>
        </Modal.Header>
        <Modal.Body>


          <div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">

              {/*======================== chief complaints============================================ */}

              <div className='col-span-2'>
                <h5 className='form-title'>Chief Complaints</h5>
                {medical_history.ChiefComplaints.map((details, index) => (

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-4 border border-gray-300 rounded-lg p-4">

                    <div className="col-span-2">
                      <FormControl fullWidth size="small">
                        <label className="form-label">Symptom Class</label>
                        <div className="flex flex-wrap gap-2">
                          {all_symptom_class_master.map((item) => {
                            const selected = selectedSymptomClass.includes(item._id);
                            return (
                              <span
                                key={item._id}
                                onClick={() => handleSymptomClassClick(item._id)}
                                className={`px-3 py-1 text-sm rounded-md cursor-pointer flex items-center gap-2
              ${selected ? 'bg-blue-500 text-white' : 'bg-[#e2e4f4] text-gray-800'}`}
                              >
                                {item.lookup_value}
                                {selected && (
                                  <span
                                    className="ml-1 text-xs font-bold cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSymptomClassClick(item._id);
                                    }}
                                  >
                                    ✕
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      </FormControl>
                    </div>



                    <div className="col-span-2">
                      <FormControl fullWidth size="small">
                        <label className="form-label">Compliant </label>
                        <div className="flex flex-wrap gap-2">
                          {all_symptom_master?.map((item) => {
                            const selected = (details?.Symptoms || []).includes(item._id);
                            return (
                              <span
                                key={item._id}
                                onClick={() => toggleArrayField(index, "Symptoms", item._id)}
                                className={`px-3 py-1 text-sm rounded-md cursor-pointer flex items-center gap-2
                                        ${selected ? 'bg-blue-500 text-white' : 'bg-[#e2e4f4] text-gray-800'}`}
                              >
                                {item.lookup_value}
                                {selected && (
                                  <span
                                    className="ml-1 text-xs font-bold cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // handleSymptomSelect(item._id,index);
                                    }}
                                  >
                                    ✕
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      </FormControl>
                    </div>




                    <div className="col-span-2">
                      <FormControl fullWidth size="small">
                        <label className="form-label">Aggravating Factors</label>
                        <div className="flex flex-wrap gap-2">
                          {allaggravating_master.map((item) => {
                            const selected = (details?.AggravatingFactors || []).includes(item._id);
                            return (
                              <span
                                key={item._id}
                                onClick={() => toggleArrayField(index, "AggravatingFactors", item._id)}
                                className={`px-3 py-1 text-sm rounded-md cursor-pointer flex items-center gap-2
                          ${selected ? 'bg-blue-500 text-white' : 'bg-[#e2e4f4] text-gray-800'}`}
                              >
                                {item.lookup_value}
                                {selected && (
                                  <span
                                    className="ml-1 text-xs font-bold cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // handleSymptomSelect(item._id,index);
                                    }}
                                  >
                                    ✕
                                  </span>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      </FormControl>
                    </div>



                    <FormControl fullWidth size="small">
                      <label className="form-label">Duration</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {/* Number input */}
                        <TextField
                          type="number"
                          name="Value"
                          placeholder="Enter Number"
                          size="small"
                          value={details.Duration.Value}
                          onChange={(e) => handleChiefComplaintsChange(index, "Duration", e.target.value, "Value")}
                          style={{ flex: 1 }}
                        />

                        <Select
                          labelId="content-type-label"
                          name="InvestigationCategory"
                          value={details.Duration.Unit}
                          onChange={(e) => handleChiefComplaintsChange(index, "Duration", e.target.value, "Unit")}
                          displayEmpty
                          MenuProps={customMenuProps}
                          renderValue={(selected) => {
                            if (!selected) {
                              return <span style={{ color: "#9ca3af" }}>Unit </span>;
                            }
                            return all_unit_list?.find((item) => item._id === selected)?.lookup_value;
                          }}
                        >
                          <MenuItem value="">
                            <em>Unit </em>
                          </MenuItem>
                          {all_unit_list?.map((type) => (
                            <MenuItem key={type._id} value={type._id}>
                              {type.lookup_value}
                            </MenuItem>
                          ))}


                        </Select>

                      </div>
                    </FormControl>

                    <FormControl fullWidth size="small">
                      <label className="form-label">Severity Grade </label>
                      {renderColorBar(index)}
                    </FormControl>

                    <div className="flex justify-between mt-2">
                      <Button
                        style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                        onClick={handleAddMore}
                      >
                        Add More
                      </Button>


                    </div>

                  </div>



                ))}

              </div>

            </div>



            <div className="flex justify-end mt-4">


              <Button
                style={{ backgroundColor: "#52677D", fontFamily: "Lora", color: "white" }}
                onClick={update_chif_complaints}
              >
                Update
              </Button>
            </div>


          </div>

        </Modal.Body>


      </Modal>

      {isloading && (
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
  );
}

export default ChiefComplaintsForCurrentProblem

