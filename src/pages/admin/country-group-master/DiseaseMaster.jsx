import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  TextField,
  FormControl,
  MenuItem,
  Menu,
  Select,
  Paper,
  IconButton
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { __postApiData } from "@utils/api";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import FormButton from "../../../components/common/FormButton";

const DiseaseMaster = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lookupId, setLookupId] = useState(null);

  const [disease_master, setDiseaseMaster] = useState({
    medical_speciality_id: null,
    disease_name: "",
    icd_10_code: "",
    icd_11_code: "",
    description: "",
  });

  const [diseaseMasterList, setDiseaseMasterList] = useState([]);
  const [medicalSpecialityList, setMedicalSpecialityList] = useState([]);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  /* ============================
      MENU
  ============================ */
  const handleOpenMenu = (event, rowId) => {
    setMenuAnchor(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setMenuRowId(null);
  };

  /* ============================
      FETCH LIST
  ============================ */
  const fetchDiseaseMasterList = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList/", {
        lookupcodes: "disease_master",
      });

      setDiseaseMasterList(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ============================
      FETCH DROPDOWN: SPECIALITY
  ============================ */
  const fetchMedicalSpeciality = useCallback(async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList", {
        lookupcodes: "medical_speciality",
      });

      setMedicalSpecialityList(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    }
  }, []);

  useEffect(() => {
    fetchDiseaseMasterList();
    fetchMedicalSpeciality();
  }, [fetchDiseaseMasterList, fetchMedicalSpeciality]);

  /* ============================
      INPUT HANDLER
  ============================ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDiseaseMaster((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ============================
      EDIT
  ============================ */
  const onEdit = (row) => {
    setLookupId(row?._id);

    setDiseaseMaster({
      medical_speciality_id: row?.parent_lookup_id,
      disease_name: row?.lookup_value,
      icd_10_code: row?.other?.icd_10_code || "",
      icd_11_code: row?.other?.icd_11_code || "",
      description: row?.other?.description || "",
    });
  };

  /* ============================
      DELETE
  ============================ */
  const onDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Disease record will be deleted!",
      icon: "warning",
      showCancelButton: true,
    });
  };

  /* ============================
      ADD / UPDATE
  ============================ */
  const addOrUpdateDisease = async () => {
    setIsLoading(true);
    try {
      const payload = {
        lookup_id: lookupId,
        lookup_type: "disease_master",
        lookup_value: disease_master.disease_name,
        parent_lookup_id: disease_master.medical_speciality_id,
        other: {
          icd_10_code: disease_master.icd_10_code,
          icd_11_code: disease_master.icd_11_code,
          description: disease_master.description,
        },
      };

      const resp = await __postApiData("/api/v1/admin/SaveLookup", payload);

      if (resp?.response?.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: lookupId ? "Updated Successfully" : "Added Successfully",
          showConfirmButton: true,
          customClass: {
            confirmButton: "my-swal-button",
          },
        });

        fetchDiseaseMasterList();

        setLookupId(null);
        setDiseaseMaster({
          medical_speciality_id: null,
          disease_name: "",
          icd_10_code: "",
          icd_11_code: "",
          description: "",
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
      setIsLoading(false);
    }
  };

  /* ============================
      DATAGRID ROWS
  ============================ */
  const rows = useMemo(
    () =>
      diseaseMasterList?.map((doc) => ({
        id: doc._id,
        ...doc,
      })),
    [diseaseMasterList]
  );

  /* ============================
      DATAGRID COLUMNS
  ============================ */
  const columns = useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.No.",
        width: 80,
        renderCell: (params) =>
          params.api.getAllRowIds().indexOf(params.id) + 1,
      },
      {
        field: "parent_lookup_name",
        headerName: "Medical Speciality",
        flex: 1,
      },
      {
        field: "lookup_value",
        headerName: "Disease Name",
        flex: 1,
      },
      {
        field: "icd_10_code",
        headerName: "ICD-10 Code",
        flex: 1,
        valueGetter: (params) => params?.row?.other?.icd_10_code,
      },
      {
        field: "icd_11_code",
        headerName: "ICD-11 Code",
        flex: 1,
        valueGetter: (params) => params?.row?.other?.icd_11_code,
      },
      {
        field: "description",
        headerName: "Description",
        flex: 1,
        valueGetter: (params) => params?.row?.other?.description,
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 70,
        sortable: false,
        renderCell: (params) => (
          <>
            <IconButton
              onClick={(e) => handleOpenMenu(e, params.row._id)}
              size="small"
            >
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
    ],
    [menuAnchor, menuRowId]
  );

  /* ============================
      UI
  ============================ */
  return (
    <div className="container mt-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Disease Master</h2>
        <p className="text-para">
          Add or update disease records.
        </p>
      </header>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-6">

          {/* MEDICAL SPECIALITY */}
          <FormControl fullWidth size="small">
            <label className="form-label">Medical Speciality</label>
            <Select
              name="medical_speciality_id"
              value={disease_master.medical_speciality_id}
              onChange={handleChange}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#9ca3af" }}>Medical Speciality</span>;
                }
                return medicalSpecialityList.find((item) => item._id === selected)?.lookup_value;
              }}

            >
              <MenuItem disabled value="">
                <em>Select Speciality</em>
              </MenuItem>

              {medicalSpecialityList?.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.lookup_value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* DISEASE NAME */}
          <FormControl fullWidth size="small">
            <label className="form-label">Disease Name</label>
            <TextField
              name="disease_name"
              value={disease_master.disease_name}
              onChange={handleChange}
              placeholder="Disease Name"
              size="small"
            />
          </FormControl>

          {/* ICD-10 CODE */}
          <FormControl fullWidth size="small">
            <label className="form-label">ICD-10 Code</label>
            <TextField
              name="icd_10_code"
              value={disease_master.icd_10_code}
              onChange={handleChange}
              placeholder="ICD-10 Code"
              size="small"
            />
          </FormControl>

          {/* ICD-11 CODE */}
          <FormControl fullWidth size="small">
            <label className="form-label">ICD-11 Code</label>
            <TextField
              name="icd_11_code"
              value={disease_master.icd_11_code}
              onChange={handleChange}
              placeholder="ICD-11 Code"
              size="small"
            />
          </FormControl>

          {/* DESCRIPTION */}
          <FormControl fullWidth size="small">
            <label className="form-label">Description</label>
            <TextField
              name="description"
              value={disease_master.description}
              onChange={handleChange}
              placeholder="Description"
              size="small"
            />
          </FormControl>

        </div>

        <FormButton
          variant="contained"
          onClick={addOrUpdateDisease}
          disabled={isLoading}
        >
          {lookupId ? "Update" : "Submit"}
        </FormButton>
      </Paper>

      <div className="mt-6">
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          disableRowSelectionOnClick
          pagination
          disableColumnMenu
          pageSizeOptions={[10]}
        />
      </div>
    </div>
  );
};

export default DiseaseMaster;
