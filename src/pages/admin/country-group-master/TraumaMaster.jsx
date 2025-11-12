// TraumaMaster.jsx
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

const TraumaMaster = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lookupId, setLookupId] = useState(null);

  const [truma_master, setTraumaMaster] = useState({
    truma_category: null,
    truma_name: "",
    explanation: "",
  });

  const [traumaMasterList, setTraumaMasterList] = useState([]);
  const [traumaCategoryList, setTraumaCategoryList] = useState([]);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  /* ------------------------------------------
      MENU HANDLING
  ------------------------------------------ */
  const handleOpenMenu = (event, rowId) => {
    setMenuAnchor(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setMenuRowId(null);
  };

  /* ------------------------------------------
      FETCH TRAUMA MASTER
  ------------------------------------------ */
  const fetchTraumaMasterList = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList/", {
        lookupcodes: "trauma_master",
      });

      setTraumaMasterList(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ------------------------------------------
      FETCH TRAUMA CATEGORY
  ------------------------------------------ */
  const fetchTraumaCategories = useCallback(async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList", {
        lookupcodes: "trauma_category_type",
      });

      setTraumaCategoryList(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    }
  }, []);

  useEffect(() => {
    fetchTraumaMasterList();
    fetchTraumaCategories();
  }, [fetchTraumaMasterList, fetchTraumaCategories]);

  /* ------------------------------------------
      FORM INPUT HANDLER
  ------------------------------------------ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTraumaMaster((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ------------------------------------------
      EDIT
  ------------------------------------------ */
  const onEdit = (row) => {
    setLookupId(row?._id);

    setTraumaMaster({
      truma_category: row?.parent_lookup_id,
      truma_name: row?.lookup_value,
      explanation: row?.other?.explanation || "",
    });
  };

  /* ------------------------------------------
      DELETE
  ------------------------------------------ */
  const onDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Record will be deleted!",
      icon: "warning",
      showCancelButton: true,
    });
  };

  /* ------------------------------------------
      ADD / UPDATE
  ------------------------------------------ */
  const addOrUpdateTrauma = async () => {
    setIsLoading(true);
    try {
      const payload = {
        lookup_id: lookupId,
        lookup_type: "trauma_master",
        lookup_value: truma_master.truma_name,
        parent_lookup_id: truma_master.truma_category,
        other: { explanation: truma_master.explanation },
      };

      const resp = await __postApiData("/api/v1/admin/SaveLookup", payload);

      if (resp?.response?.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: lookupId ? "Updated Successfully" : "Added Successfully",
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        });

        fetchTraumaMasterList();

        setLookupId(null);
        setTraumaMaster({
          truma_category: null,
          truma_name: "",
          explanation: "",
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

  /* ------------------------------------------
      DATAGRID ROWS
  ------------------------------------------ */
  // const rows = useMemo(
  //   () =>
  //     traumaMasterList?.map((doc) => ({
  //       id: doc._id,
  //       ...doc,
  //     })),
  //   [traumaMasterList]
  // );
  const rows = traumaMasterList?.map((doc, index) => ({
    id: doc._id || index,
    ...doc,
    other: doc.other || {},
  }));

  console.log(traumaMasterList, "traumaMasterList")
  /* ------------------------------------------
      DATAGRID COLUMNS
  ------------------------------------------ */
  const columns = useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.No.",
        width: 80,
        renderCell: (params) =>
          params.api.getAllRowIds().indexOf(params.id) + 1,
      },
      {
        field: "parent_lookup_name",
        headerName: "Trauma Category",
        flex: 1,
      },
      {
        field: "lookup_value",
        headerName: "Trauma Name",
        flex: 1,
      },
      {
        field: "explanation",
        headerName: "Explanation",
        flex: 1,
        renderCell: (params) => params?.row?.other?.explanation || "",
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

  /* ------------------------------------------
      UI RENDER
  ------------------------------------------ */
  return (
    <div className="container mt-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Trauma Master</h2>
        <p className="text-para">
          Add or update trauma master records to maintain structured data.
        </p>
      </header>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-6">

          <FormControl fullWidth size="small">
            <label className="form-label">Trauma Category</label>
            <Select
              name="truma_category"
              value={truma_master.truma_category}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem disabled value="">
                <em>Select Category</em>
              </MenuItem>
              {traumaCategoryList?.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.lookup_value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Trauma Name</label>
            <TextField
              name="truma_name"
              value={truma_master.truma_name}
              onChange={handleChange}
              placeholder="Trauma Name"
              size="small"
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Explanation</label>
            <TextField
              name="explanation"
              value={truma_master.explanation}
              onChange={handleChange}
              placeholder="Explanation"
              size="small"
            />
          </FormControl>
        </div>

        <FormButton
          variant="contained"
          onClick={addOrUpdateTrauma}
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

export default TraumaMaster;
