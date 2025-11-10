import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Paper,
  FormControl,
  TextField,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import { __postApiData } from '@utils/api';
import FormButton from "../../../components/common/FormButton";



const MedicalSpeciality = () => {
  const [specialities, setSpecialities] = useState([]);
  const [medicalSpeciality, setMedicalSpeciality] = useState("");
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);
  // const [medical_speciality, setmedicalspeciality] = useState("")

  // ✅ Fetch Speciality List
  const getMedicalSpecialities = useCallback(async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList", {
        lookupcodes: "medical_speciality",
      });
      setSpecialities(resp.data || []);
    } catch (error) {
      console.log("❌ Error fetching speciality list", error);
    }
  }, []);

  useEffect(() => {
    getMedicalSpecialities();
  }, []);

  // ✅ Action Menu
  const handleOpenMenu = (event, rowId) => {
    setMenuAnchor(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setMenuRowId(null);
  };

  const onEdit = (id) => {
    console.log("Edit", id);
    handleCloseMenu();
  };

  const onDelete = (id) => {
    console.log("Delete", id);
    handleCloseMenu();
  };

  // ✅ Add Speciality
  const addMedicalSpeciality = async () => {
    if (!medicalSpeciality.trim()) {
      Swal.fire("Warning", "Please enter medical speciality", "warning");
      return;
    }

    try {
      const resp = await __postApiData("/api/v1/admin/SaveLookup", {
        lookup_type: "medical_speciality",
        parent_lookup_id: null,
        lookup_value: medicalSpeciality.trim(),
      });
      console.log(resp);

      if (resp.response?.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Medical Speciality Created",
          text: "Medical Speciality Created Successfully",
          showConfirmButton: true,
          customClass: {
            confirmButton: "my-swal-button",
          },
        });

        setMedicalSpeciality("");
        getMedicalSpecialities();
      } else {
        Swal.fire("Error", resp.response?.response_message, "error");
      }
    } catch (error) {
      console.error("❌ API Error:", error);
    }
  };

  // ✅ Table Columns
  const columns = useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.No.",
        width: 100,
        renderCell: (params) =>
          params.api.getAllRowIds().indexOf(params.id) + 1,
      },
      {
        field: "lookup_value",
        headerName: "Medical Speciality",
        flex: 1,
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 80,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <>
            <IconButton onClick={(e) => handleOpenMenu(e, params.row._id)}>
              <MoreVertIcon />
            </IconButton>

            {menuRowId === params.row._id && (
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleCloseMenu}
                disableScrollLock
              >
                <MenuItem onClick={() => onEdit(params.row._id)}>Edit</MenuItem>
                <MenuItem onClick={() => onDelete(params.row._id)}>
                  Delete
                </MenuItem>
              </Menu>
            )}
          </>
        ),
      },
    ],
    [menuRowId, menuAnchor]
  );

  // ✅ Rows
  const rows = useMemo(
    () =>
      specialities?.map((item, index) => ({
        id: item._id || index,
        ...item,
      })),
    [specialities]
  );
  return (
    <>
      <div className="container mt-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            Enter Details for Medical Speciality
          </h2>
          <p className="text-para">
            Add or update the required details for the medical speciality to keep
            records accurate and complete.
          </p>

          <div className="form-container pt-4">
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <div className="form-grid mb-4">
                <FormControl fullWidth size="small">
                  <label className="form-label text-[14px]">Medical Speciality</label>
                  <TextField
                    name="medical_speciality"
                    placeholder="Medical Speciality"
                    value={medicalSpeciality}
                    onChange={(e) => setMedicalSpeciality(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </FormControl>
              </div>

              <FormButton variant="contained" onClick={addMedicalSpeciality}>
                Submit
              </FormButton>
            </Paper>
          </div>


          <div className="mt-6">
            <DataGrid
              // className="p-3"
              rows={rows}
              columns={columns}
              pageSize={10}
              pageSizeOptions={[]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              disableSelectionOnClick
              disableColumnMenu
              autoHeight
            />

          </div>
        </div>
      </div>
    </>
  )
}

export default MedicalSpeciality

