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

const SymptomMaster = () => {
  const [isLoading, setLoading] = useState(false);
  const [lookupId, setLookupId] = useState(null);

  const [form, setForm] = useState({
    symptom_class_type: "",
    symptom: "",
    explanation: "",
  });

  const [list, setList] = useState([]);
  const [symptomClassList, setSymptomClassList] = useState([]);

  /** ✅ Common API Fetcher */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await __postApiData("/api/v1/admin/LookupList", {
        lookupcodes: "symptom_master",
      });
      setList(resp.data || []);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, []);

  /** ✅ Fetch Symptom Class */
  const fetchSymptomClass = useCallback(async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList", {
        lookupcodes: "symptom_class_type",
      });
      setSymptomClassList(resp.data || []);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchSymptomClass();
  }, [fetchData, fetchSymptomClass]);

  /** ✅ Change Handler */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  /** ✅ Submit */
  const handleSubmit = async () => {
    const { symptom_class_type, symptom } = form;

    if (!symptom_class_type || !symptom.trim()) {
      return Swal.fire("Warning", "Please fill required fields!", "warning");
    }

    try {
      setLoading(true);
      const resp = await __postApiData("/api/v1/admin/SaveLookup", {
        lookup_id: lookupId,
        lookup_type: "symptom_master",
        lookup_value: symptom,
        parent_lookup_id: symptom_class_type,
        other: { explanation: form.explanation },
      });

      if (resp?.response?.response_code === "200") {
        Swal.fire("Success", "Saved Successfully", "success");
        setLookupId(null);
        setForm({ symptom_class_type: "", symptom: "", explanation: "" });
        fetchData();
      } else {
        Swal.fire("Error", resp?.response?.response_message, "error");
      }
    } catch (err) {
      console.log(err);
      Swal.fire("Error", "Something went wrong!", "error");
    } finally {
      setLoading(false);
    }
  };

  /** ===================================== TABLE ===================================== */

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  const handleMenuOpen = (e, id) => {
    setMenuAnchor(e.currentTarget);
    setMenuRowId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuRowId(null);
  };

  const handleEdit = (row) => {
    setLookupId(row._id);
    setForm({
      symptom_class_type: row.parent_lookup_id,
      symptom: row.lookup_value,
      explanation: row?.other?.explanation ?? "",
    });
    handleMenuClose();
  };

  const handleDelete = (id) => {
    Swal.fire("Coming Soon!", "Delete functionality goes here", "info");
    handleMenuClose();
  };

  /** ✅ Memoized Column */
  const columns = useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.No.",
        flex: 0.2,
        renderCell: (params) =>
          params.api.getAllRowIds().indexOf(params.id) + 1,
      },
      { field: "parent_lookup_name", headerName: "Symptom Class", flex: 0.5 },
      { field: "lookup_value", headerName: "Symptom", flex: 0.5 },
      {
        field: "other",
        headerName: "Explanation",
        flex: 1,
        renderCell: (params) => params.row?.other?.explanation ?? "",
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 80,
        sortable: false,
        renderCell: (params) => (
          <>
            <IconButton onClick={(e) => handleMenuOpen(e, params.row._id)}>
              <MoreVertIcon />
            </IconButton>

            {menuRowId === params.row._id && (
              <Menu
                anchorEl={menuAnchor}
                open
                onClose={handleMenuClose}
                disableScrollLock
              >
                <MenuItem onClick={() => handleEdit(params.row)}>Edit</MenuItem>
                <MenuItem onClick={() => handleDelete(params.row._id)}>
                  Delete
                </MenuItem>
              </Menu>
            )}
          </>
        ),
      },
    ],
    [menuRowId]
  );

  const rows = useMemo(
    () => list.map((d, i) => ({ id: d._id ?? i, ...d })),
    [list]
  );

  /** ✅ Equal TextField Height */
  const inputStyle = {
    "& .MuiInputBase-root": {
      height: 40,
    },
  };

  return (
    <div className="container mt-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Enter Details for Symptom Master
        </h2>
        <p className="text-para">
          Add or update details to keep records accurate.
        </p>
      </header>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-6">
          {/* Symptom Class */}
          <FormControl fullWidth size="small">
            <label className="form-label">SYMPTOM CLASS</label>
            <Select
              name="symptom_class_type"
              value={form.symptom_class_type}
              onChange={handleChange}
              displayEmpty
              sx={inputStyle}
            >
              <MenuItem disabled value="">
                <em>Select Symptom Class</em>
              </MenuItem>

              {symptomClassList?.map((it) => (
                <MenuItem value={it._id} key={it._id}>
                  {it.lookup_value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Symptom */}
          <FormControl fullWidth size="small">
            <label className="form-label">Symptom</label>
            <TextField
              name="symptom"
              value={form.symptom}
              onChange={handleChange}
              placeholder="Symptom"
              sx={inputStyle}
            />
          </FormControl>

          {/* Explanation */}
          <FormControl fullWidth size="small">
            <label className="form-label">Explanation</label>
            <TextField
              name="explanation"
              value={form.explanation}
              onChange={handleChange}
              placeholder="Explanation"
              sx={inputStyle}
            />
          </FormControl>
        </div>

        <FormButton variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {lookupId ? "Update" : "Submit"}
        </FormButton>
      </Paper>

      <div className="mt-6">
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          disableSelectionOnClick
          pageSize={10}
          pageSizeOptions={[]}
        />
      </div>
    </div>
  );
};

export default SymptomMaster;
