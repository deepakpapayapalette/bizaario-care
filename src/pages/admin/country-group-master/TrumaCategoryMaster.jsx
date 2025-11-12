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

const TrumaCategoryMaster = () => {
  const [isLoading, setLoading] = useState(false);
  const [lookup_id, setlookup_id] = useState(null);

  const [truma_category_master, settruma_category_master] = useState({
    truma_category: "",
  });

  const [trumaCategoryData, setTrumaCategoryData] = useState([]);

  /* ------------------------------ Fetch List ------------------------------ */
  const fetchTrumaCategory = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList/", {
        lookupcodes: "trauma_category_type",
      });
      setTrumaCategoryData(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    fetchTrumaCategory();
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
    settruma_category_master({ truma_category: row.lookup_value });
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
    settruma_category_master((prev) => ({ ...prev, [name]: value }));
  };

  /* ------------------------------ Add / Update ------------------------------ */
  const addTrumaCategory = async () => {
    setLoading(true);
    try {
      const payload = {
        lookup_id: lookup_id,
        lookup_type: "trauma_category_type",
        lookup_value: truma_category_master.truma_category,
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

        fetchTrumaCategory();
        setlookup_id(null);
        settruma_category_master({ truma_category: "" });
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
  const rows = trumaCategoryData?.map((doc, index) => ({
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
      headerName: "Trauma Category",
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
        <h2 className="text-2xl font-semibold mb-2">Trauma Category Master</h2>
        <p className="text-para">Add or update trauma category records.</p>
      </header>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className="form-grid mb-4">
          <FormControl fullWidth size="small">
            <label className="form-label">Trauma Category</label>
            <TextField
              name="truma_category"
              value={truma_category_master.truma_category}
              onChange={handleChange}
              placeholder="Trauma Category"
              size="small"
            />
          </FormControl>
        </div>

        <FormButton variant="contained" onClick={addTrumaCategory} disabled={isLoading}>
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
        />
      </div>
    </div>
  );
};

export default TrumaCategoryMaster;
