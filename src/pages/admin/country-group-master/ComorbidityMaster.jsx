import React, { useState, useEffect } from "react";
import {
  TextField,
  FormControl,
  MenuItem,
  Menu,
  Paper,
  IconButton,
  LinearProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { __postApiData } from "@utils/api";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import FormButton from "../../../components/common/FormButton";

const ComorbidityMaster = () => {
  /* -------------------------------- States ------------------------------- */
  const [formLoading, setFormLoading] = useState(false); // For submit/update
  const [tableLoading, setTableLoading] = useState(false); // For DataGrid loader

  const [lookup_id, setlookup_id] = useState(null);

  const [comorbidity_master, setComorbidityMaster] = useState({
    comorbidity: "",
  });

  const [comorbidityData, setComorbidityData] = useState([]);

  /* ------------------------------ Fetch List ------------------------------ */
  const fetchComorbidity = async () => {
    try {
      setTableLoading(true);
      const resp = await __postApiData("/api/v1/admin/LookupList/", {
        lookupcodes: "comorbidity_type",
      });
      setComorbidityData(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchComorbidity();
  }, []);

  /* ----------------------------- Menu Handling ---------------------------- */
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

  /* -------------------------------- Edit ---------------------------------- */
  const onEdit = (row) => {
    setlookup_id(row._id);
    setComorbidityMaster({
      comorbidity: row.lookup_value,
    });
  };

  /* ------------------------------- Delete --------------------------------- */
  const onDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Item will be deleted!",
      icon: "warning",
      showCancelButton: true,
    });
  };

  /* ---------------------------- Input Handler ----------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setComorbidityMaster((prev) => ({ ...prev, [name]: value }));
  };

  /* ----------------------- Add / Update Handler --------------------------- */
  const addComorbidity = async () => {
    setFormLoading(true);
    try {
      const payload = {
        lookup_id: lookup_id,
        lookup_type: "comorbidity_type",
        lookup_value: comorbidity_master.comorbidity,
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

        fetchComorbidity();
        setlookup_id(null);
        setComorbidityMaster({ comorbidity: "" });
      } else {
        Swal.fire({
          icon: "error",
          text: resp?.response?.response_message,
        });
      }
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setFormLoading(false);
    }
  };

  /* --------------------------------- Rows --------------------------------- */
  const rows = comorbidityData?.map((doc, index) => ({
    id: doc._id || index,
    ...doc,
  }));

  /* -------------------------------- Columns ------------------------------- */
  const columns = [
    {
      field: "sno",
      headerName: "S.No.",
      width: 80,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: "lookup_value",
      headerName: "Comorbidity",
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

  /* -------------------------------- UI ------------------------------------ */
  return (
    <div className="container mt-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Comorbidity Master</h2>
        <p className="text-para">
          Add or update the comorbidity types to maintain standardized record data.
        </p>
      </header>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className="form-grid mb-4">
          <FormControl fullWidth size="small">
            <label className="form-label">Comorbidity</label>
            <TextField
              name="comorbidity"
              value={comorbidity_master.comorbidity}
              onChange={handleChange}
              placeholder="Comorbidity"
              size="small"
            />
          </FormControl>
        </div>

        <FormButton
          variant="contained"
          onClick={addComorbidity}
          disabled={formLoading}
        >
          {formLoading ? "Processing..." : lookup_id ? "Update" : "Submit"}
        </FormButton>
      </Paper>

      <div className="mt-6">
        {tableLoading && <LinearProgress />}
        <DataGrid
          rows={rows}
          columns={columns}
          loading={tableLoading}
          disableSelectionOnClick
          pagination
          pageSizeOptions={[10]}
          disableColumnMenu
        />
      </div>
    </div>
  );
};

export default ComorbidityMaster;
