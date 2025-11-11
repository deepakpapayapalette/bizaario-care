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

const AggravatingFactorMaster = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [lookupId, setLookupId] = useState(null);
  const [aggravatingForm, setAggravatingForm] = useState({
    symptom_id: null,
    aggravating_factor: "",
  });

  const [aggravatingList, setAggravatingList] = useState([]);
  const [symptomList, setSymptomList] = useState([]);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  /* MENU */
  const handleOpenMenu = (event, rowId) => {
    setMenuAnchor(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setMenuRowId(null);
  };

  /* ✅ Fetch Aggravating List */
  const fetchAggravatingList = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList/", {
        lookupcodes: "aggravating_factor_master",
      });

      setAggravatingList(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ✅ Fetch Symptoms */
  const fetchSymptoms = useCallback(async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList", {
        lookupcodes: "symptom_master",
      });

      setSymptomList(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    }
  }, []);

  useEffect(() => {
    fetchAggravatingList();
    fetchSymptoms();
  }, [fetchAggravatingList, fetchSymptoms]);

  /* ✅ Input Change Handler */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setAggravatingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ✅ Edit */
  const onEdit = (row) => {
    setLookupId(row?._id);
    setAggravatingForm({
      symptom_id: row?.parent_lookup_id,
      aggravating_factor: row?.lookup_value,
    });
  };

  /* ✅ Delete */
  const onDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Aggravating Factor will be deleted!",
      icon: "warning",
      showCancelButton: true,
    });
  };

  /* ✅ Submit / Update */
  const addAggravatingMaster = async () => {
    setIsLoading(true);
    try {
      const payload = {
        lookup_id: lookupId,
        lookup_type: "aggravating_factor_master",
        lookup_value: aggravatingForm.aggravating_factor,
        parent_lookup_id: aggravatingForm.symptom_id,
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

        fetchAggravatingList();

        setLookupId(null);
        setAggravatingForm({
          symptom_id: null,
          aggravating_factor: "",
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

  /* ✅ Rows */
  const rows = useMemo(
    () =>
      aggravatingList?.map((doc) => ({
        id: doc._id,
        ...doc,
      })),
    [aggravatingList]
  );

  /* ✅ Columns */
  const columns = useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.No.",
        width: 80,
        renderCell: (params) =>
          params.api.getAllRowIds().indexOf(params.id) + 1,
      },
      { field: "parent_lookup_name", headerName: "Symptom", flex: 1 },
      { field: "lookup_value", headerName: "Aggravating Factor", flex: 1 },

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

  return (
    <div className="container mt-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Enter Details for Aggravating Factor Master
        </h2>
        <p className="text-para">Add or update details for aggravating factor master.</p>
      </header>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-6">
          <FormControl fullWidth size="small">
            <label className="form-label">SYMPTOM</label>
            <Select
              name="symptom_id"
              value={aggravatingForm.symptom_id}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem disabled value="">
                <em>Select Symptom</em>
              </MenuItem>

              {symptomList?.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.lookup_value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">AGGRAVATING FACTOR</label>
            <TextField
              name="aggravating_factor"
              value={aggravatingForm.aggravating_factor}
              onChange={handleChange}
              placeholder="Aggravating Factor"
              size="small"
            />
          </FormControl>
        </div>

        <FormButton
          variant="contained"
          onClick={addAggravatingMaster}
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
        />
      </div>
    </div>
  );
};

export default AggravatingFactorMaster;
