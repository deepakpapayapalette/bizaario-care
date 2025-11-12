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

const HabitCategoryMaster = () => {
  const [isLoading, setLoading] = useState(false);
  const [lookup_id, setlookup_id] = useState(null);

  const [habit_category_master, setHabitCategoryMaster] = useState({
    habit_category: "",
  });

  const [habitCategoryData, setHabitCategoryData] = useState([]);

  /* ------------------------------ Fetch List ------------------------------ */
  const fetchHabitCategory = async () => {
    try {
      setLoading(true)
      const resp = await __postApiData("/api/v1/admin/LookupList/", {
        lookupcodes: "habit_category_type",
      });
      setHabitCategoryData(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchHabitCategory();
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
    setHabitCategoryMaster({ habit_category: row.lookup_value });
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
    setHabitCategoryMaster((prev) => ({ ...prev, [name]: value }));
  };

  /* ------------------------------ Add / Update ------------------------------ */
  const addHabitCategory = async () => {
    setLoading(true);
    try {
      const payload = {
        lookup_id: lookup_id,
        lookup_type: "habit_category_type",
        lookup_value: habit_category_master.habit_category,
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

        fetchHabitCategory();
        setlookup_id(null);
        setHabitCategoryMaster({ habit_category: "" });
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
  const rows = habitCategoryData?.map((doc, index) => ({
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
      headerName: "Habit Category",
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
        <h2 className="text-2xl font-semibold mb-2">Habit Category Master</h2>
        <p className="text-para">Add or update habit category records.</p>
      </header>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className="form-grid mb-4">
          <FormControl fullWidth size="small">
            <label className="form-label">Habit Category</label>
            <TextField
              name="habit_category"
              value={habit_category_master.habit_category}
              onChange={handleChange}
              placeholder="Habit Category"
              size="small"
            />
          </FormControl>
        </div>

        <FormButton
          variant="contained"
          onClick={addHabitCategory}
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

export default HabitCategoryMaster;
