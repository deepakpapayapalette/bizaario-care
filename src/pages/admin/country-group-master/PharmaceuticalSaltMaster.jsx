import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  TextField,
  FormControl,
  MenuItem,
  Menu,
  Select,
  Paper,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { __postApiData } from "@utils/api";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import FormButton from "../../../components/common/FormButton";

const PharmaceuticalSaltMaster = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lookupId, setLookupId] = useState(null);

  const [pharmaceutical_salt_master, setPharmaceuticalSaltMaster] = useState({
    salt_type: null,
    salt_composition: "",
    purpose: "",
  });

  const [saltMasterList, setSaltMasterList] = useState([]);
  const [saltTypeList, setSaltTypeList] = useState([]);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  /* ============================================================
      MENU
  ============================================================ */
  const handleOpenMenu = (event, rowId) => {
    setMenuAnchor(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setMenuRowId(null);
  };

  /* ============================================================
      FETCH SALT MASTER LIST
  ============================================================ */
  const fetchSaltMasterList = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList/", {
        lookupcodes: "pharmaceutical_salt_master",
      });

      setSaltMasterList(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ============================================================
      FETCH SALT TYPE DROPDOWN OPTIONS
  ============================================================ */
  const fetchSaltTypes = useCallback(async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList", {
        lookupcodes: "pharmaceutical_salt_type",
      });

      setSaltTypeList(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    }
  }, []);

  useEffect(() => {
    fetchSaltMasterList();
    fetchSaltTypes();
  }, [fetchSaltMasterList, fetchSaltTypes]);

  /* ============================================================
      INPUT HANDLER
  ============================================================ */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setPharmaceuticalSaltMaster((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ============================================================
      EDIT
  ============================================================ */
  const onEdit = (row) => {
    setLookupId(row?._id);
    setPharmaceuticalSaltMaster({
      salt_type: row?.parent_lookup_id,
      salt_composition: row?.lookup_value,
      purpose: row?.other?.purpose || "",
    });
  };

  /* ============================================================
      DELETE
  ============================================================ */
  const onDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Pharmaceutical Salt will be deleted!",
      icon: "warning",
      showCancelButton: true,
    });
  };

  /* ============================================================
      ADD / UPDATE
  ============================================================ */
  const addPharmaceuticalSaltMaster = async () => {
    setIsLoading(true);
    try {
      const payload = {
        lookup_id: lookupId,
        lookup_type: "pharmaceutical_salt_master",
        lookup_value: pharmaceutical_salt_master.salt_composition,
        parent_lookup_id: pharmaceutical_salt_master.salt_type,
        other: { purpose: pharmaceutical_salt_master.purpose },
      };

      const resp = await __postApiData("/api/v1/admin/SaveLookup", payload);

      if (resp?.response?.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: lookupId ? "Updated" : "Added Successfully",
          showConfirmButton: true,
          customClass: {
            confirmButton: "my-swal-button",
          },
        });

        fetchSaltMasterList();

        setLookupId(null);
        setPharmaceuticalSaltMaster({
          salt_type: null,
          salt_composition: "",
          purpose: "",
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

  /* ============================================================
      DATAGRID ROWS
  ============================================================ */
  const rows = useMemo(
    () =>
      saltMasterList?.map((doc) => ({
        id: doc._id,
        ...doc,
      })),
    [saltMasterList]
  );

  /* ============================================================
      DATAGRID COLUMNS
  ============================================================ */
  const columns = useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.No.",
        width: 80,
        renderCell: (params) =>
          params.api.getAllRowIds().indexOf(params.id) + 1,
      },
      { field: "parent_lookup_name", headerName: "Salt Type", flex: 1 },
      { field: "lookup_value", headerName: "Salt Composition", flex: 1 },
      {
        field: "purpose",
        headerName: "Purpose",
        flex: 1,


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

  /* ============================================================
      UI
  ============================================================ */
  return (
    <div className="container mt-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Pharmaceutical Salt Master
        </h2>
        <p className="text-para">
          Add or update pharmaceutical salt records.
        </p>
      </header>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-6">
          {/* SALT TYPE */}
          <FormControl fullWidth size="small">
            <label className="form-label">Salt Type</label>
            <Select
              name="salt_type"
              value={pharmaceutical_salt_master.salt_type}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem disabled value="">
                <em>Select Salt Type</em>
              </MenuItem>

              {saltTypeList?.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.lookup_value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* SALT COMPOSITION */}
          <FormControl fullWidth size="small">
            <label className="form-label">Salt Composition</label>
            <TextField
              name="salt_composition"
              value={pharmaceutical_salt_master.salt_composition}
              onChange={handleChange}
              placeholder="Salt Composition"
              size="small"
            />
          </FormControl>

          {/* PURPOSE */}
          <FormControl fullWidth size="small">
            <label className="form-label">Purpose</label>
            <TextField
              name="purpose"
              value={pharmaceutical_salt_master.purpose}
              onChange={handleChange}
              placeholder="Purpose"
              size="small"
            />
          </FormControl>
        </div>

        <FormButton
          variant="contained"
          onClick={addPharmaceuticalSaltMaster}
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

export default PharmaceuticalSaltMaster;
