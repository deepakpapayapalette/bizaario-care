import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Paper,
  FormControl,
  TextField,
  Menu,
  MenuItem,
  IconButton,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import { __postApiData } from "@utils/api";
import FormButton from "../../../components/common/FormButton";

const ServiceCategory = () => {
  const [allservice, setallservice] = useState([]);
  const [servicecategory, setservicecategory] = useState("");

  const [isLoading, setIsLoading] = useState(false);   // ✅ single loading

  /** ✅ Fetch Service Category */
  const getallservice = useCallback(async () => {
    try {
      setIsLoading(true);
      const resp = await __postApiData("/api/v1/admin/LookupList", {
        lookupcodes: "service_category",
      });
      setallservice(resp?.data ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getallservice();
  }, [getallservice]);

  /** ✅ Menu handling */
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  const handleOpenMenuhospital = (event, rowId) => {
    setMenuAnchor(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleCloseMenuhospital = () => {
    setMenuAnchor(null);
    setMenuRowId(null);
  };

  const onEdithospital = (id) => {
    alert("Edit: " + id);
  };

  const onDeletehospital = (id) => {
    alert("Delete: " + id);
  };

  /** ✅ Columns */
  const columnshospital = useMemo(
    () => [
      {
        field: "sno",
        headerName: "S.No.",
        width: 90,
        renderCell: (params) =>
          params.api.getAllRowIds().indexOf(params.id) + 1,
      },
      { field: "lookup_value", headerName: "Service Category", flex: 1 },

      {
        field: "actions",
        headerName: "Actions",
        width: 80,
        sortable: false,
        renderCell: (params) => (
          <>
            <IconButton
              onClick={(e) => handleOpenMenuhospital(e, params.row._id)}
            >
              <MoreVertIcon />
            </IconButton>

            {menuRowId === params.row._id && (
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleCloseMenuhospital}
                disableScrollLock
              >
                <MenuItem
                  onClick={() => {
                    onEdithospital(params.row._id);
                    handleCloseMenuhospital();
                  }}
                >
                  Edit
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    onDeletehospital(params.row._id);
                    handleCloseMenuhospital();
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

  /** ✅ Rows */
  const rowshospital = useMemo(
    () =>
      allservice?.map((doc, index) => ({
        id: doc._id || index,
        ...doc,
      })) ?? [],
    [allservice]
  );

  /** ✅ Add Service Category */
  const add_service_category = async () => {
    if (!servicecategory.trim()) {
      Swal.fire("Warning", "Please enter service category", "warning");
      return;
    }

    try {
      setIsLoading(true);

      const resp = await __postApiData("/api/v1/admin/SaveLookup", {
        lookup_type: "service_category",
        parent_lookup_id: null,
        lookup_value: servicecategory,
      });

      if (resp?.response?.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Service created successfully",
        });
        setservicecategory("");
        getallservice(); // ✅ Refresh list
      } else {
        Swal.fire("Error", resp?.response?.response_message, "error");
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Service Category Master
        </h2>
        <p className="text-para">
          Add or update the required details for service category.
        </p>
      </div>

      {/* ✅ Form */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className="mb-4">

          <FormControl fullWidth size="small" className="mb-4">
            <label className="form-label text-[14px]">Service Category</label>
            <TextField
              placeholder="Service Category"
              value={servicecategory}
              onChange={(e) => setservicecategory(e.target.value)}
              size="small"
            />
          </FormControl>
        </div>

        <FormButton
          variant="contained"
          onClick={add_service_category}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit"}
        </FormButton>
      </Paper>

      {/* ✅ Table */}
      <div className="mt-6">
        <DataGrid
          rows={rowshospital}
          columns={columnshospital}
          pageSize={10}
          disableSelectionOnClick
          loading={isLoading}        // ✅ Grid loading
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
        />
      </div>
    </div>
  );
};

export default ServiceCategory;
