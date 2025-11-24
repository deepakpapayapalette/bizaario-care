import React, { useState, useMemo } from "react";
import { IoEarth } from "react-icons/io5";
import { FaFlag, FaUserDoctor } from "react-icons/fa6";
import { RiStethoscopeFill } from "react-icons/ri";
import { LiaFlagUsaSolid } from "react-icons/lia";
import { MdSchool, MdDeleteForever } from "react-icons/md";
import { FaBriefcaseMedical } from "react-icons/fa";
import { BsPersonArmsUp } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import FormButton from "../../../components/common/FormButton";

const Admindashboard = ({
  handleView = () => { },
  handleDelete = () => { },
}) => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  // ---------------------------
  // ✅ OVERVIEW CARDS (STATIC)
  // ---------------------------
  const overviewData = useMemo(
    () => [
      { icon: <IoEarth />, bg: "#FF6B35", title: "Continent", value: "20k", textColor: "#fff" },
      { icon: <FaFlag />, bg: "#2E86AB", title: "Countries", value: "20k", textColor: "#fff" },
      { icon: <LiaFlagUsaSolid />, bg: "#A23B72", title: "Countries Group", value: "20k", textColor: "#fff" },
      { icon: <RiStethoscopeFill />, bg: "#F18F01", title: "Partner Hospitals", value: "20k", textColor: "#fff" },
      { icon: <MdSchool />, bg: "#2A9D8F", title: "Medical Colleges", value: "20k", textColor: "#fff" },
      { icon: <FaUserDoctor />, bg: "#E63946", title: "Doctors", value: "20k", textColor: "#fff" },
      { icon: <FaBriefcaseMedical />, bg: "#7209B7", title: "Medical Associations", value: "20k", textColor: "#fff" },
      { icon: <BsPersonArmsUp />, bg: "#F72585", title: "Patient Referrals", value: "20k", textColor: "#fff" },
    ],
    []
  );

  // ---------------------------
  // ✅ DOCTOR LIST (DEMO DATA)
  // ---------------------------
  const doctors = useMemo(
    () => [
      { name: "Lorraine Drake", phone: "+91 1234567890", specialty: "Cardiologist", hospital: "Apollo Hospital" },
      { name: "Dominic Stonehart", phone: "+91 1234567890", specialty: "Cardiologist", hospital: "Apollo Hospital" },
      { name: "Sarah Williams", phone: "+91 1234567890", specialty: "Cardiologist", hospital: "Apollo Hospital" },
    ],
    []
  );

  // Add ID for DataGrid
  const rows = doctors.map((doc, idx) => ({ id: idx + 1, ...doc }));

  // ---------------------------
  // ✅ COLUMNS with ACTIONS
  // ---------------------------
  const columns = useMemo(
    () => [
      {
        field: "name",
        headerName: "Doctor Name",
        flex: 1,
        renderCell: (params) => (
          <span className="text-blue-700 font-medium cursor-pointer hover:underline">
            {params.value}
          </span>
        ),
      },
      { field: "phone", headerName: "Phone Number", flex: 1 },
      { field: "specialty", headerName: "Speciality", flex: 1 },
      { field: "hospital", headerName: "Hospital", flex: 1 },

      {
        field: "action",
        headerName: "Action",
        flex: 1,
        sortable: false,
        renderCell: (params) => (
          <div className="flex gap-3 items-center">
            <FormButton variant="outlined" size="small" onClick={() => handleView(params.row)}>
              <FaEye size={18} />
            </FormButton>

            <FormButton
              variant="contained"
              color="error"
              size="small"
              onClick={() => handleDelete(params.row)}
            >
              <MdDeleteForever size={18} />
            </FormButton>
          </div>
        ),
      },
    ],
    [handleView, handleDelete]
  );

  return (
    <div className="container mt-8">
      <div className="main-content">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>

        {/* OVERVIEW CARDS */}
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
          {overviewData.map((card, idx) => (
            <div
              key={idx}
              className="rounded-xl px-4 py-4 shadow hover:shadow-xl transition-all cursor-pointer"
              style={{ background: card.bg, color: card.textColor }}
            >
              <div>
                <div className="text-lg text-white">{card.title}</div>
                <div className="text-3xl font-bold text-white">{card.value}</div>
              </div>

              <div className="flex justify-end mt-3">
                {React.cloneElement(card.icon, { size: 42, color: card.textColor })}
              </div>
            </div>
          ))}
        </div>

        {/* DOCTOR TABLE */}
        <h3 className="text-2xl font-semibold mt-10 mb-4">Doctor List</h3>

        <div className="max-h-[600px] border rounded-lg overflow-hidden">
          <DataGrid
            rows={rows}
            columns={columns}
            disableColumnMenu
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10]}
            sx={{
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#000",
                color: "",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Admindashboard;
