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

const AllergyCategoryMaster = () => {
  const [isLoading, setLoading] = useState(false);
  const [lookupId, setLookupId] = useState(null);

  const [allergy_category_master, setAllergyCategoryMaster] = useState({
    allergy_category: "",
  });

  const [allergyCategoryList, setAllergyCategoryList] = useState([]);

  /* ============================
      FETCH LIST
  ============================ */
  const getAllAllergyCategory = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList/", {
        lookupcodes: "allergy_category_type",
      });

      setAllergyCategoryList(resp?.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllAllergyCategory();
  }, []);

  /* ============================
      MENU HANDLING
  ============================ */
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

  /* ============================
      EDIT
  ============================ */
  const onEdit = (row) => {
    setLookupId(row._id);
    setAllergyCategoryMaster({
      allergy_category: row.lookup_value,
    });
  };

  const onDelete = () => {
    alert("delete");
  };

  /* ============================
      TABLE COLUMNS
  ============================ */
  const columns = [
    {
      field: "sno",
      headerName: "S.No.",
      flex: 0.3,
      renderCell: (params) =>
        params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: "lookup_value",
      headerName: "Allergy Category",
      flex: 1,
    },
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

  const rows = allergyCategoryList?.map((doc, index) => ({
    id: doc?._id || index,
    ...doc,
  }));

  /* ============================
      INPUT CHANGE
  ============================ */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAllergyCategoryMaster((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ============================
      ADD / UPDATE
  ============================ */
  const addAllergyCategory = async () => {
    try {
      setLoading(true);

      const payload = {
        lookup_id: lookupId,
        lookup_type: "allergy_category_type",
        lookup_value: allergy_category_master.allergy_category,
      };

      const resp = await __postApiData("/api/v1/admin/SaveLookup", payload);

      if (resp?.response?.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: lookupId ? "Updated Successfully" : "Added Successfully",
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        }).then(() => getAllAllergyCategory());

        setLookupId(null);
        setAllergyCategoryMaster({ allergy_category: "" });
      } else {
        Swal.fire({
          icon: "error",
          text: resp?.response?.response_message,
        });
      }
    } catch (error) {
      console.error("❌ API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ============================
      UI
  ============================ */
  return (
    <div className="container mt-8">
      <header className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Allergy Category Master</h2>
        <p className="text-para">
          Add or update allergy category records.
        </p>
      </header>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className="form-grid mb-4">
          <FormControl fullWidth size="small">
            <label className="form-label">Allergy Category</label>
            <TextField
              name="allergy_category"
              value={allergy_category_master.allergy_category}
              onChange={handleChange}
              placeholder="Allergy Category"
              size="small"
            />
          </FormControl>
        </div>

        <FormButton variant="contained" onClick={addAllergyCategory}>
          {lookupId ? "Update" : "Submit"}
        </FormButton>
      </Paper>

      {/* TABLE VIEW */}
      <div className="mt-6">
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          disableSelectionOnClick
          pageSize={10}
          pageSizeOptions={[]}
          disableColumnMenu
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
        />
      </div>
    </div>
  );
};

export default AllergyCategoryMaster;
