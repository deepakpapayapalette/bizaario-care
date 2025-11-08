import React, { useState } from 'react'
import { IoEarth } from "react-icons/io5";
import { FaFlag } from "react-icons/fa6";
import { RiStethoscopeFill } from "react-icons/ri";
import { LiaFlagUsaSolid } from "react-icons/lia";
import { MdSchool } from "react-icons/md";
import { FaBriefcaseMedical } from "react-icons/fa";
import { BsPersonArmsUp } from "react-icons/bs";
import { FaUserDoctor } from "react-icons/fa6";
import { MdDeleteForever } from "react-icons/md";
import { DataGrid } from "@mui/x-data-grid";
// import { Button } from "@mui/material";

import { FaEye } from "react-icons/fa";
import FormButton from '../../../components/common/FormButton';
const Admindashboard = ({ handleView, handleDelete }) => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
  const [editId, setEditId] = useState(null);
  const overviewData = [
    {
      icon: <IoEarth />,
      bg: "#FF6B35",
      title: "Continent",
      value: "20k",
      textColor: "#FFFFFF"
    },
    {
      icon: <FaFlag />,
      bg: "#2E86AB",
      title: "Countries",
      value: "20k",
      textColor: "#FFFFFF"
    },
    {
      icon: <LiaFlagUsaSolid />,
      bg: "#A23B72",
      title: "Countries Group",
      value: "20k",
      textColor: "#FFFFFF"
    },
    {
      icon: <RiStethoscopeFill />,
      bg: "#F18F01",
      title: "Partner Hospitals",
      value: "20k",
      textColor: "#000000"
    },
    {
      icon: <MdSchool />,
      bg: "#2A9D8F",
      title: "Medical Colleges",
      value: "20k",
      textColor: "#FFFFFF"
    },
    {
      icon: <FaUserDoctor />,
      bg: "#E63946",
      title: "Doctors",
      value: "20k",
      textColor: "#FFFFFF"
    },
    {
      icon: <FaBriefcaseMedical />,
      bg: "#7209B7",
      title: "Medical Associations",
      value: "20k",
      textColor: "#FFFFFF"
    },
    {
      icon: <BsPersonArmsUp />,
      bg: "#F72585",
      title: "Patient Referrals",
      value: "20k",
      textColor: "#FFFFFF"
    },
  ];

  const doctors = [
    {
      name: "Lorraine Drake",
      phone: "+91 1234567890",
      specialty: "Cardiologist",
      hospital: "Apollo Hospital",
    },
    {
      name: "Dominic Stonehart",
      phone: "+91 1234567890",
      specialty: "Cardiologist",
      hospital: "Apollo Hospital",
    },
    {
      name: "Lorraine Drake",
      phone: "+91 1234567890",
      specialty: "Cardiologist",
      hospital: "Apollo Hospital",
    },
    {
      name: "Dominic Stonehart",
      phone: "+91 1234567890",
      specialty: "Cardiologist",
      hospital: "Apollo Hospital",
    },
    {
      name: "Lorraine Drake",
      phone: "+91 1234567890",
      specialty: "Cardiologist",
      hospital: "Apollo Hospital",
    },
    {
      name: "Dominic Stonehart",
      phone: "+91 1234567890",
      specialty: "Cardiologist",
      hospital: "Apollo Hospital",
    },
  ];
  const columns = [
    {
      field: "name",
      headerName: "Doctor Name",
      flex: 1,
      renderCell: (params) => (
        <span className="doctor-link">{params.row.name}</span>
      ),
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "specialty",
      headerName: "Speciality",
      flex: 1,
    },
    {
      field: "hospital",
      headerName: "Hospital",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <div className='flex gap-4 items-center mt-3'>
          <FormButton
            variant="outlined"
            size="small"
            onClick={() => handleView(params.row)}

          >
            <FaEye size={18} />
          </FormButton>

          <FormButton
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row)}
            bgColor='rgb(174 8 20)'
          >
            <MdDeleteForever size={18} />
          </FormButton>
        </div>
      ),
    },
  ];
  const rows = doctors.map((doc, index) => ({
    id: index + 1,
    ...doc,
  }));
  return (
    <div className='container mt-8'>
      <div className="main-content">
        <h2 className="md:text-2xl text-2xl font-semibold mb-4">Overview</h2>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4 ">
          {overviewData.map((card, idx) => (
            <div
              className=" lg:min-h-[140px] h-[120px] rounded-lg hover:shadow-lg px-4 py-3 flex flex-col justify-between gap-3"
              key={idx}
              style={{ background: card.bg }}
            >
              <div className="text-white ">
                <div className="text-lg ">{card.title}</div>
                <span className="text-3xl font-semibold">{card.value}</span>
              </div>
              <div className="text-white flex justify-end">
                {card.icon && React.cloneElement(card.icon, { size: 40 })}
              </div>
            </div>

          ))}
        </div>
        <h3 className=" text-2xl font-semibold mb-4 mt-8">Doctor List</h3>
        <div className="table-responsive max-h-[600px] ">
          <div >
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
                  backgroundColor: "#000 ",
                  color: "black !important",
                  fontWeight: "normal",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admindashboard
