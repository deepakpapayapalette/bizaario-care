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

const MedicineFrequencyMaster = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lookupId, setLookupId] = useState(null);

  const [medicine_frequency_master, setMedicineFrequencyMaster] = useState({
    medicine_frequency: "",
  });

  const [medicineFrequencyList, setMedicineFrequencyList] = useState([]);

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
      FETCH MEDICINE FREQUENCY LIST
  ============================================================ */
  const fetchMedicineFrequencyList = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList/", {
        lookupcodes: "medicine_frequency_type",
      });

      setMedicineFrequencyList(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedicineFrequencyList();
  }, [fetchMedicineFrequencyList]);

  /* ============================================================
      INPUT HANDLER
  ============================================================ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedicineFrequencyMaster((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ============================================================
      EDIT
  ============================================================ */
  const onEdit = (row) => {
    setLookupId(row?._id);
    setMedicineFrequencyMaster({
      medicine_frequency: row?.lookup_value,
    });
  };

  /* ============================================================
      DELETE (Pending)
  ============================================================ */
  const onDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Medicine frequency record will be deleted!",
      icon: "warning",
      showCancelButton: true,
    });
  };

  /* ============================================================
      ADD / UPDATE
  ============================================================ */
  const addMedicineFrequencyMaster = async () => {
    setIsLoading(true);
    try {
      const payload = {
        lookup_id: lookupId,
        lookup_type: "medicine_frequency_type",
        lookup_value: medicine_frequency_master.medicine_frequency,
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

        fetchMedicineFrequencyList();

        setLookupId(null);
        setMedicineFrequencyMaster({
          medicine_frequency: "",
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
      medicineFrequencyList?.map((doc) => ({
        id: doc?._id,
        ...doc,
      })),
    [medicineFrequencyList]
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
      { field: "lookup_value", headerName: "Medicine Frequency", flex: 1 },

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
          Medicine Frequency Master
        </h2>
        <p className="text-para">Add or update Medicine Frequency records.</p>
      </header>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className=" mb-6">
          {/* MEDICINE FREQUENCY */}
          <FormControl fullWidth size="small">
            <label className="form-label">Medicine Frequency</label>
            <TextField
              name="medicine_frequency"
              value={medicine_frequency_master.medicine_frequency}
              onChange={handleChange}
              placeholder="Medicine Frequency"
              size="small"
            />
          </FormControl>
        </div>

        <FormButton
          variant="contained"
          onClick={addMedicineFrequencyMaster}
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
          pageSizeOptions={[10]}
          disableColumnMenu
        />
      </div>
    </div>
  );
};

export default MedicineFrequencyMaster;
