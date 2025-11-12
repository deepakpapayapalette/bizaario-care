import React, { useState, useEffect } from "react";
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

const InvestigationCategoryMaster = () => {
  const [isLoading, setLoading] = useState(false);
  const [lookup_id, setlookup_id] = useState(null);

  const [investigation_category, setInvestigationCategory] = useState({
    investigation_category: "",
  });

  const [investigationData, setInvestigationData] = useState([]);

  /* ------------------------------ Fetch List ------------------------------ */
  const fetchInvestigationCategory = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList/", {
        lookupcodes: "investigation_category_type",
      });
      setInvestigationData(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchInvestigationCategory();
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
    setInvestigationCategory({ investigation_category: row.lookup_value });
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
    setInvestigationCategory((prev) => ({ ...prev, [name]: value }));
  };

  /* ------------------------------ Add / Update ------------------------------ */
  const addInvestigationCategory = async () => {
    setLoading(true);
    try {
      const payload = {
        lookup_id: lookup_id,
        lookup_type: "investigation_category_type",
        lookup_value: investigation_category.investigation_category,
      };

      const resp = await __postApiData("api/v1/admin/SaveLookup", payload);

      if (resp?.response?.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: lookup_id ? "Updated Successfully" : "Added Successfully",
          showConfirmButton: true,
          customClass: {
            confirmButton: "my-swal-button",
          },
        });

        fetchInvestigationCategory();
        setlookup_id(null);
        setInvestigationCategory({ investigation_category: "" });
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
  const rows = investigationData?.map((doc, index) => ({
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
      headerName: "Investigation Category",
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

  /* ------------------------------ UI ------------------------------ */
  return (
    <div className="container mt-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Investigation Category Master</h2>
        <p className="text-para">Add or update the required details for the investigation category master to keep records accurate and complete.</p>
      </header>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className="form-grid mb-4">
          <FormControl fullWidth size="small">
            <label className="form-label">Investigation Category</label>
            <TextField
              name="investigation_category"
              value={investigation_category.investigation_category}
              onChange={handleChange}
              placeholder="Investigation Category"
              size="small"
            />
          </FormControl>
        </div>

        <FormButton
          variant="contained"
          onClick={addInvestigationCategory}
          disabled={isLoading}
        >
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

export default InvestigationCategoryMaster;
