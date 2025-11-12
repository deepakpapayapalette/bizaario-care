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

const OccupationMaster = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lookupId, setLookupId] = useState(null);

  const [occupation_master, setOccupationMaster] = useState({
    occupation_category: [],
    occupation_name: "",
    possible_complications: "",
  });

  const [occupationMasterList, setOccupationMasterList] = useState([]);
  const [occupationCategoryList, setOccupationCategoryList] = useState([]);
  // console.log(occupationMasterList, "occupationMasterList")

  // console.log(occupationCategoryList, "list")


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
      FETCH OCCUPATION MASTER
  ------------------------------------------ */
  const fetchOccupationMasterList = useCallback(async () => {
    setIsLoading(true);
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList/", {
        lookupcodes: "occupation_master",
      });
      // console.log(resp, "resp")

      setOccupationMasterList(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ------------------------------------------
      FETCH OCCUPATION CATEGORY
  ------------------------------------------ */
  const fetchOccupationCategories = useCallback(async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList", {
        lookupcodes: "occupation_category_type",
      });

      setOccupationCategoryList(resp?.data || []);
    } catch (error) {
      console.log("Error:", error);
    }
  }, []);

  useEffect(() => {
    fetchOccupationMasterList();
    fetchOccupationCategories();
  }, [fetchOccupationMasterList, fetchOccupationCategories]);

  /* ------------------------------------------
      FORM INPUT HANDLER
  ------------------------------------------ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setOccupationMaster((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ------------------------------------------
      EDIT
  ------------------------------------------ */
  const onEdit = (row) => {
    setLookupId(row?._id);

    setOccupationMaster({
      occupation_category: row?.parent_lookup_id,
      occupation_name: row?.lookup_value,
      possible_complications: row?.other?.possible_complications || "",
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
  const addOrUpdateOccupation = async () => {
    setIsLoading(true);
    try {
      const payload = {
        lookup_id: lookupId,
        lookup_type: "occupation_master",
        lookup_value: occupation_master.occupation_name,
        parent_lookup_id: occupation_master.occupation_category,
        other: { possible_complications: occupation_master.possible_complications },
      };

      const resp = await __postApiData("/api/v1/admin/SaveLookup", payload);

      if (resp?.response?.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: lookupId ? "Updated Successfully" : "Added Successfully",
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        });

        fetchOccupationMasterList();

        setLookupId(null);
        setOccupationMaster({
          occupation_category: null,
          occupation_name: "",
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
      setIsLoading(false);
    }
  };

  /* ------------------------------------------
      DATAGRID ROWS
  ------------------------------------------ */
  const rows = occupationMasterList?.map((doc, index) => ({
    id: doc._id || index,
    ...doc,
    other: doc.other || {},
  }));

  /* -----------------------------------------
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
        headerName: "Occupation Category",
        flex: 1,
      },
      {
        field: "lookup_value",
        headerName: "Occupation Name",
        flex: 1,
      },
      {
        field: "possible_complications",
        headerName: "Possible Complications",
        flex: 1,
        renderCell: (params) => params?.row?.other?.possible_complications || "",
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

  /* ------------------------------------UI RENDER----------------------------------------- */
  return (
    <div className="container mt-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Occupation Master</h2>
        <p className="text-para">
          Add or update occupation master records to maintain structured data.
        </p>
      </header>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-6">

          <FormControl fullWidth size="small">
            <label className="form-label">Occupation Category</label>
            <Select
              name="occupation_category"
              value={occupation_master.occupation_category}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem disabled value="">
                <em>Select Category</em>
              </MenuItem>
              {occupationCategoryList?.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.lookup_value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Occupation Name</label>
            <TextField
              name="occupation_name"
              value={occupation_master.occupation_name}
              onChange={handleChange}
              placeholder="Occupation Name"
              size="small"
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Possible Complications</label>
            <TextField
              name="possible_complications"
              value={occupation_master.possible_complications}
              onChange={handleChange}
              placeholder="Possible Complications"
              size="small"
            />
          </FormControl>
        </div>

        <FormButton
          variant="contained"
          onClick={addOrUpdateOccupation}
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

export default OccupationMaster;
