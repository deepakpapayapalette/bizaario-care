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

const PatientReferralType = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lookupId, setLookupId] = useState(null);
  const [formData, setFormData] = useState({ patient_referral_type: "" });
  const [list, setList] = useState([]);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  /** ✅ Toast Helper */
  const showToast = useCallback((type, title, text) => {
    Swal.fire({
      icon: type,
      title,
      text,
      showConfirmButton: true,
    });
  }, []);

  /** ✅ API :: Fetch Data */
  const fetchList = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList", {
        lookupcodes: "patient_referral_type",
      });
      setList(resp.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  /** ✅ Input Change */
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  /** ✅ Submit */
  const handleSubmit = async () => {
    const val = formData.patient_referral_type.trim();
    if (!val) return showToast("warning", "Warning", "Enter Patient Referral Type");

    setIsLoading(true);
    try {
      const resp = await __postApiData("/api/v1/admin/SaveLookup", {
        lookup_id: lookupId,
        lookup_type: "patient_referral_type",
        lookup_value: val,
      });

      if (resp?.response?.response_code === "200") {
        showToast(
          "success",
          lookupId ? "Updated Successfully" : "Added Successfully",
          "Patient Referral Type saved"
        );

        setLookupId(null);
        setFormData({ patient_referral_type: "" });
        fetchList();
      } else {
        showToast("error", "Error", resp?.response?.response_message);
      }
    } catch {
      showToast("error", "Error", "Something went wrong");
    }
    setIsLoading(false);
  };

  /** ✅ MENU ACTIONS */

  const openMenu = (event, id) => {
    setMenuAnchor(event.currentTarget);
    setMenuRowId(id);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuRowId(null);
  };

  const handleEdit = (row) => {
    setLookupId(row._id);
    setFormData({ patient_referral_type: row.lookup_value });
    closeMenu();
  };

  const handleDelete = (rowId) => {
    alert("delete -> " + rowId);
    closeMenu();
  };

  /** ✅ Table Columns (memoized) */
  const columns = useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.No.",
        flex: 0.2,
        renderCell: (params) =>
          params.api.getAllRowIds().indexOf(params.id) + 1,
      },
      { field: "lookup_value", headerName: "Patient Referral Type", flex: 1 },
      {
        field: "actions",
        headerName: "Actions",
        width: 80,
        sortable: false,
        renderCell: (params) => (
          <>
            <IconButton onClick={(e) => openMenu(e, params.row._id)}>
              <MoreVertIcon />
            </IconButton>

            {menuRowId === params.row._id && (
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={closeMenu}
                disableScrollLock
              >
                <MenuItem onClick={() => handleEdit(params.row)}>
                  Edit
                </MenuItem>
                <MenuItem onClick={() => handleDelete(params.row._id)}>
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

  /** ✅ Table Rows (memoized) */
  const rows = useMemo(
    () =>
      list.map((doc, i) => ({
        id: doc._id ?? i,
        ...doc,
      })),
    [list]
  );

  return (
    <div className="container mt-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Enter Details for Patient Referral Type
        </h2>
        <p className="text-para">
          Add or update the required details for patient referral type.
        </p>
      </header>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <label className="form-label">Patient Referral Type</label>
          <TextField
            name="patient_referral_type"
            value={formData.patient_referral_type}
            onChange={handleChange}
            placeholder="Enter referral type"
            size="small"
          />
        </FormControl>

        <FormButton
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {lookupId ? "Update" : "Submit"}
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

export default PatientReferralType;
