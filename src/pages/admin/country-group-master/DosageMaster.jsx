import React, { useState, useEffect, useCallback, useMemo } from "react";
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

const DosageMaster = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lookupId, setLookupId] = useState(null);

  const [dosage_master, setDosageMaster] = useState({
    dosage_type: "",
  });

  const [dosageTypeList, setDosageTypeList] = useState([]);

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
      FETCH DOSAGE LIST
  ============================================================ */
  const fetchDosageList = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList/", {
        lookupcodes: "dosage_type",
      });

      setDosageTypeList(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDosageList();
  }, [fetchDosageList]);

  /* ============================================================
      INPUT HANDLER
  ============================================================ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDosageMaster((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ============================================================
      EDIT
  ============================================================ */
  const onEdit = (row) => {
    setLookupId(row?._id);
    setDosageMaster({
      dosage_type: row?.lookup_value,
    });
  };

  /* ============================================================
      DELETE (Pending)
  ============================================================ */
  const onDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Dosage record will be deleted!",
      icon: "warning",
      showCancelButton: true,
    });
  };

  /* ============================================================
      ADD / UPDATE
  ============================================================ */
  const addDosageMaster = async () => {
    setIsLoading(true);
    try {
      const payload = {
        lookup_id: lookupId,
        lookup_type: "dosage_type",
        lookup_value: dosage_master.dosage_type,
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

        fetchDosageList();

        setLookupId(null);
        setDosageMaster({
          dosage_type: "",
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
      dosageTypeList?.map((doc) => ({
        id: doc?._id,
        ...doc,
      })),
    [dosageTypeList]
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
      { field: "lookup_value", headerName: "Dosage Type", flex: 1 },

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
        <h2 className="text-2xl font-semibold mb-2">Dosage Master</h2>
        <p className="text-para">Add or update the required details for the dosage type type master to keep records accurate and complete.</p>
      </header>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className=" mb-6">
          {/* DOSAGE TYPE */}
          <FormControl fullWidth size="small">
            <label className="form-label">Dosage Type</label>
            <TextField
              name="dosage_type"
              value={dosage_master.dosage_type}
              onChange={handleChange}
              placeholder="Dosage Type"
              size="small"
            />
          </FormControl>
        </div>

        <FormButton
          variant="contained"
          onClick={addDosageMaster}
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
          disableColumnMenu
          pagination
          pageSizeOptions={[10]}
          disableSelectionOnClick
        />

      </div>
    </div>
  );
};

export default DosageMaster;
