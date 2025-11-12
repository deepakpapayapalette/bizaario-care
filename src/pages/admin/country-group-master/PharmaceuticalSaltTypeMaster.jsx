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

const PharmaceuticalSaltTypeMaster = () => {
  const [isLoading, setloading] = useState(false);

  const [salt_type_master, setsalt_type_master] = useState({
    salt_type: "",
  });

  const [all_salt_data, setall_salt_data] = useState([]);
  const [lookup_id, setlookup_id] = useState(null);

  const getAllSaltTypes = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList/", {
        lookupcodes: "pharmaceutical_salt_type",
      });

      setall_salt_data(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllSaltTypes();
  }, []);

  /* ---- Menu Handling ---- */
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

  /* ---- Edit ---- */
  const onEdit = (row) => {
    setlookup_id(row._id);
    setsalt_type_master({ salt_type: row.lookup_value });
  };

  const onDelete = () => {
    alert("delete");
  };

  /* ---- Table Columns ---- */
  const columns = [
    {
      field: "sno",
      headerName: "S.No.",
      flex: 0.2,
      renderCell: (params) =>
        params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    { field: "lookup_value", headerName: "Salt Type", flex: 0.5 },

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

  const rows = all_salt_data?.map((doc, index) => ({
    id: doc._id || index,
    ...doc,
  }));

  /* ---- Controlled Input ---- */
  const handlechange = (e) => {
    const { name, value } = e.target;
    setsalt_type_master((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---- Add / Update ---- */
  const add_salt_type = async () => {
    try {
      setloading(true);

      const resp = await __postApiData("/api/v1/admin/SaveLookup", {
        lookup_id: lookup_id,
        lookup_type: "pharmaceutical_salt_type",
        lookup_value: salt_type_master.salt_type,
      });

      if (resp.response.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Saved Successfully",
          text: "Pharmaceutical Salt Type saved successfully.",
          showConfirmButton: true,
          customClass: {
            confirmButton: "my-swal-button",
          },
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: resp.response.response_message,
          showConfirmButton: true,
        });
      }
    } catch (error) {
      console.error("❌ API Error:", error);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="container mt-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Pharmaceutical Salt Type Master
        </h2>
        <p className="text-para">
          Add or update pharmaceutical salt type records.
        </p>
      </header>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className="form-grid mb-4">
          <FormControl fullWidth size="small">
            <label className="form-label">Salt Type</label>
            <TextField
              name="salt_type"
              value={salt_type_master.salt_type}
              onChange={handlechange}
              placeholder="Pharmaceutical Salt Type"
            />
          </FormControl>
        </div>

        <FormButton variant="contained" onClick={add_salt_type}>
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

export default PharmaceuticalSaltTypeMaster;
