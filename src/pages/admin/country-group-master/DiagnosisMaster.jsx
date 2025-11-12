import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  MenuItem,
  Menu,
  Paper,
  IconButton,
  Select,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { __postApiData } from "@utils/api";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import FormButton from "../../../components/common/FormButton";

const DiagnosisMaster = () => {
  const [isLoading, setLoading] = useState(false);
  const [lookup_id, setlookup_id] = useState(null);

  const [diagnosis_master, setDiagnosisMaster] = useState({
    medical_speciality_id: "",
    medical_diagnosis: "",
  });

  const [specialityOptions, setSpecialityOptions] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState([]);

  /* ------------------------------ Fetch Diagnosis List ------------------------------ */
  const fetchDiagnosisList = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList/", {
        lookupcodes: "diagnosis_master",
      });
      setDiagnosisData(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  /* ------------------------------ Fetch Speciality (Dropdown) ------------------------------ */
  const fetchSpeciality = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList", {
        lookupcodes: "medical_speciality",
      });

      setSpecialityOptions(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchDiagnosisList();
    fetchSpeciality();
  }, []);

  /* ------------------------------ Menu Handling ------------------------------ */
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  const handleOpenMenu = (event, rowId) => {
    setMenuAnchor(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setMenuRowId(null);
  };

  /* ------------------------------ Edit ------------------------------ */
  const onEdit = (row) => {
    setlookup_id(row._id);
    setDiagnosisMaster({
      medical_diagnosis: row.lookup_value,
      medical_speciality_id: row.parent_lookup_id,
    });
  };

  /* ------------------------------ Delete ------------------------------ */
  const onDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Item will be deleted!",
      icon: "warning",
      showCancelButton: true,
    });
  };

  /* ------------------------------ Input Handler ------------------------------ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiagnosisMaster((prev) => ({ ...prev, [name]: value }));
  };

  /* ------------------------------ Add / Update ------------------------------ */
  const addDiagnosis = async () => {
    setLoading(true);
    try {
      const payload = {
        lookup_id: lookup_id,
        lookup_type: "diagnosis_master",
        lookup_value: diagnosis_master.medical_diagnosis,
        parent_lookup_id: diagnosis_master.medical_speciality_id,
      };

      const resp = await __postApiData("/api/v1/admin/SaveLookup", payload);

      if (resp?.response?.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: lookup_id ? "Updated Successfully" : "Added Successfully",
          showConfirmButton: true,
          customClass: {
            confirmButton: "my-swal-button",
          },
        });

        fetchDiagnosisList();

        setlookup_id(null);
        setDiagnosisMaster({
          medical_speciality_id: "",
          medical_diagnosis: "",
        });
      } else {
        Swal.fire({
          icon: "error",
          text: resp?.response?.response_message,
        });
      }
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------ Rows ------------------------------ */
  const rows = diagnosisData?.map((doc, index) => ({
    id: doc._id || index,
    ...doc,
  }));

  /* ------------------------------ Columns ------------------------------ */
  const columns = [
    {
      field: "sno",
      headerName: "S.No.",
      width: 80,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: "lookup_value",
      headerName: "Diagnosis Name",
      flex: 1,
    },
    {
      field: "parent_lookup_id",
      headerName: "Medical Speciality",
      flex: 1,
      renderCell: (params) => {
        const val = specialityOptions?.find((itm) => itm._id === params.value);
        return val?.lookup_value || "-";
      },
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
              <MenuItem
                onClick={() => {
                  onEdit(params.row);
                  handleCloseMenu();
                }}
              >
                Edit
              </MenuItem>

              <MenuItem
                onClick={() => {
                  onDelete(params.row._id);
                  handleCloseMenu();
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          )}
        </>
      ),
    },
  ];

  /* ------------------------------ UI ------------------------------ */
  return (
    <div className="container mt-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Diagnosis Master</h2>
        <p className="text-para">
          Add or update the required details for the diagnosis master to keep
          records accurate and complete.
        </p>
      </header>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-6">

          {/* Medical Speciality */}
          <FormControl fullWidth size="small">
            <label className="form-label">Medical Speciality</label>
            <Select
              name="medical_speciality_id"
              value={diagnosis_master.medical_speciality_id}
              onChange={handleChange}
              size="small"

              displayEmpty

              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#9ca3af", }} >Select Medical Speciality</span>;
                }
                return specialityOptions.find((item) => item._id === selected)?.lookup_value;
              }}

            >

              {specialityOptions?.map((opt, index) => (
                <MenuItem key={index} value={opt._id}>
                  {opt.lookup_value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Diagnosis Name */}
          <FormControl fullWidth size="small">
            <label className="form-label">Diagnosis Name</label>
            <TextField
              name="medical_diagnosis"
              value={diagnosis_master.medical_diagnosis}
              onChange={handleChange}
              placeholder="Diagnosis Name"
              size="small"
            />
          </FormControl>
        </div>

        <FormButton variant="contained" onClick={addDiagnosis} disabled={isLoading}>
          {lookup_id ? "Update" : "Submit"}
        </FormButton>
      </Paper>

      <div className="mt-6">
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          disableSelectionOnClick
          pagination
          pageSizeOptions={[10]}
          disableColumnMenu
        />
      </div>
    </div>
  );
};

export default DiagnosisMaster;
