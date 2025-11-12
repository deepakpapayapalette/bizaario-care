import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  TextField,
  FormControl,
  MenuItem,
  Menu,
  Paper,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { __postApiData } from "@utils/api";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import FormButton from "../../../components/common/FormButton";

const SymptomClassMaster = () => {

  const [isLoading, setloading] = useState(false)

  const [symptom_class_master, setsymptom_class_master] = useState({
    symptom_class: "",

  });

  const [all_symptom_class_master, setall_symptom_class_master] = useState([])
  const getall_symptom_class_master = async () => {
    try {
      const resp = await __postApiData('/api/v1/admin/LookupList/', { lookupcodes: "symptom_class_type" })
      console.log(resp);

      setall_symptom_class_master(resp.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getall_symptom_class_master()

  }, [])




  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  const handleOpenMenuhospital = (event, rowId) => {
    setMenuAnchor(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleCloseMenuhospital = () => {
    setMenuAnchor(null);
    setMenuRowId(null);
  };

  const [lookup_id, setlookup_id] = useState(null)
  const onEdit = (row) => {
    setlookup_id(row._id)
    setsymptom_class_master({ symptom_class: row.lookup_value })
  }

  const onDeletehospital = () => {
    alert("delete")
  }



  const columns = [
    { field: 'sno', headerName: 'S.No.', flex: 0.2, renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1 },
    { field: 'lookup_value', headerName: 'Symptom Class', flex: 0.5 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={(e) => handleOpenMenuhospital(e, params.row._id)}>
            <MoreVertIcon />
          </IconButton>

          {menuRowId === params.row._id && (
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleCloseMenuhospital}
              disableScrollLock
            >
              <MenuItem
                onClick={() => {
                  onEdit(params.row);
                  handleCloseMenuhospital();
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDeletehospital(params.row._id);
                  handleCloseMenuhospital();
                }}
              >
                Delete
              </MenuItem>
            </Menu>
          )}
        </>
      ),
    }

  ];

  const rows = all_symptom_class_master?.map((doc, index) => ({
    id: doc._id || index,
    ...doc,
  }));




  const handlechange = (e) => {
    const { name, value, checked, type } = e.target;

    setsymptom_class_master((prev) => {
      if (Array.isArray(value)) {
        return { ...prev, [name]: value };
      }

      if (Array.isArray(prev[name])) {
        const updated = checked
          ? [...prev[name], value] // Add
          : prev[name].filter((item) => item !== value); // Remove
        return { ...prev, [name]: updated };
      }

      if (type === "checkbox" && Array.isArray(prev[name])) {
        const updated = checked
          ? [...prev[name], value] // Add to array
          : prev[name].filter((item) => item !== value); // Remove from array
        return { ...prev, [name]: updated };
      }

      if (type === "checkbox") {
        return { ...prev, [name]: checked };
      }

      // Normal single-value field
      return { ...prev, [name]: type === "checkbox" ? checked : value };
    });
  };




  const add_symptom_class_master = async () => {
    try {
      setloading(true)
      const resp = await __postApiData("/api/v1/admin/SaveLookup",
        {
          lookup_id: lookup_id,
          lookup_type: "symptom_class_type",
          lookup_value: symptom_class_master.symptom_class,
        }
      );

      if (resp.response.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Symptom Class Master Added",
          text: "Symptom Class Master Addedd Successfully...",
          showConfirmButton: true,
          customClass: {
            confirmButton: 'my-swal-button',
          },
        }).then(() => {
          window.location.reload()
        })
        // console.log("✅ Lookup list:", resp.data);
      } else {
        console.warn("⚠️ Error:", resp.response.response_message);
        Swal.fire({
          icon: "error",
          title: "Error Occured",
          text: resp.response.response_message,
          showConfirmButton: true,
          customClass: {
            confirmButton: 'my-swal-button',
          }
        }
        )
      }
    } catch (error) {
      console.error("❌ API Error:", error);
    }
    finally {
      setloading(false)
    }
  };

  return (
    <div className="container mt-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Enter Details for Symptom  Class Master
        </h2>
        <p className="text-para">
          Add or update the required details for the symptom class master to keep records accurate and complete.
        </p>
      </header>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className="form-grid mb-4">

          <FormControl fullWidth size="small">
            <label className="form-label">Symptom Class </label>
            <TextField
              name="symptom_class"
              defaultValue={symptom_class_master.symptom_class}
              onChange={handlechange}
              placeholder='Symptom Class'
              size="small"
            >

            </TextField>
          </FormControl>

        </div>

        <FormButton
          variant="contained"
          onClick={add_symptom_class_master}

        >
          Submit
        </FormButton>
      </Paper>

      {/* Table */}
      <div className="mt-6">
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          disableSelectionOnClick
          pageSize={10}
          pageSizeOptions={[]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
        />
      </div>
    </div>
  );
};

export default SymptomClassMaster;
