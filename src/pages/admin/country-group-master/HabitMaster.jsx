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

const HabitMaster = () => {
  const [isLoading, setLoading] = useState(false);
  const [lookup_id, setlookup_id] = useState(null);

  const [habit_master, setHabitMaster] = useState({
    habit_name: "",
    habit_category: "",
    possible_complications: "",
  });

  const [habitCategoryOptions, setHabitCategoryOptions] = useState([]);
  const [habitData, setHabitData] = useState([]);

  /* ------------------------------ Fetch Habit List ------------------------------ */
  const fetchHabitList = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList/", {
        lookupcodes: "habit_master",
      });
      setHabitData(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  /* ------------------------------ Fetch Habit Category (Dropdown) ------------------------------ */
  const fetchHabitCategory = async () => {
    try {
      setLoading(true)
      const resp = await __postApiData("/api/v1/admin/LookupList", {
        lookupcodes: "habit_category_type",
      });
      setHabitCategoryOptions(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchHabitList();
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
    setHabitMaster({
      habit_name: row.lookup_value,
      habit_category: row.parent_lookup_id,
      possible_complications: row?.other?.possible_complications || "",
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
    setHabitMaster((prev) => ({ ...prev, [name]: value }));
  };

  /* ------------------------------ Add / Update ------------------------------ */
  const addHabit = async () => {
    setLoading(true);
    try {
      const payload = {
        lookup_id: lookup_id,
        lookup_type: "habit_master",
        lookup_value: habit_master.habit_name,
        parent_lookup_id: habit_master.habit_category,
        other: {
          possible_complications: habit_master.possible_complications,
        },
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

        fetchHabitList();

        setlookup_id(null);
        setHabitMaster({
          habit_name: "",
          habit_category: "",
          possible_complications: "",
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
  const rows = habitData?.map((doc, index) => ({
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
      headerName: "Habit Name",
      flex: 1,
    },
    {
      field: "parent_lookup_id",
      headerName: "Habit Category",
      flex: 1,
      renderCell: (params) => {
        const val = habitCategoryOptions?.find(
          (itm) => itm._id === params.value
        );
        return val?.lookup_value || "-";
      },
    },
    {
      field: "possible_complications",
      headerName: "Possible Complications",
      flex: 1,
      renderCell: (params) => params?.row?.other?.possible_complications || "-",
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
        <h2 className="text-2xl font-semibold mb-2">Habit Master</h2>
        <p className="text-para">Add or update the required details for the habit master to keep records accurate and complete.</p>
      </header>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-6">
          {/* Habit Category */}
          <FormControl fullWidth size="small">
            <label className="form-label">Habit Category</label>
            <Select
              name="habit_category"
              value={habit_master.habit_category}
              onChange={handleChange}
              size="small"
            >
              {habitCategoryOptions?.map((opt, index) => (
                <MenuItem key={index} value={opt._id}>
                  {opt.lookup_value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Habit Name */}
          <FormControl fullWidth size="small">
            <label className="form-label">Habit Name</label>
            <TextField
              name="habit_name"
              value={habit_master.habit_name}
              onChange={handleChange}
              placeholder="Habit Name"
              size="small"
            />
          </FormControl>

          {/* Possible Complications */}
          <FormControl fullWidth size="small">
            <label className="form-label">Possible Complications</label>
            <TextField
              name="possible_complications"
              value={habit_master.possible_complications}
              onChange={handleChange}
              placeholder="Possible Complications"
              size="small"
            />
          </FormControl>
        </div>

        <FormButton variant="contained" onClick={addHabit} disabled={isLoading}>
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

export default HabitMaster;
