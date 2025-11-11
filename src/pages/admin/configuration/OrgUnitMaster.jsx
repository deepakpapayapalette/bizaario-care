import React, { useState, useEffect, useCallback } from "react";
import { Paper, IconButton, Menu, MenuItem, TextField, FormControl } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import api from "../../../api";
import { __postApiData } from '@utils/api';

import FormButton from "../../../components/common/FormButton";
import { Popup } from '@components/common/Popup';

const OrgUnitMaster = () => {
  const [orgUnit, setOrgUnit] = useState("");
  const [allOrgUnits, setAllOrgUnits] = useState([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const [menuData, setMenuData] = useState({
    anchor: null,
    rowId: null,
  });

  // ✅ Loading state
  const [isLoading, setIsLoading] = useState(false);

  /** ✅ Fetch List */
  const getAllOrgUnits = useCallback(async () => {
    try {
      setIsLoading(true); // ⬅ Start loading
      const resp = await __postApiData("/api/v1/admin/LookupList", {
        lookupcodes: "org_unit_type",
      });

      setAllOrgUnits(resp.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // ⬅ Stop loading
    }
  }, []);

  useEffect(() => {
    getAllOrgUnits();
  }, [getAllOrgUnits]);

  /** ✅ Add Org Unit */
  const addOrgUnit = async () => {
    if (!orgUnit.trim()) {
      Swal.fire("Warning", "Please enter Org Unit", "warning");
      return;
    }

    try {
      setIsLoading(true);   // optional loading while submit
      const resp = await api.post("api/v1/admin/SaveLookup", {
        lookup_type: "org_unit_type",
        parent_lookup_id: null,
        lookup_value: orgUnit.trim(),
      });

      if (resp.data?.response?.response_code === "200") {
        Swal.fire("Success", "Org Unit Added!", "success");
        setOrgUnit("");
        getAllOrgUnits(); // ✅ refresh list
      } else {
        Swal.fire("Error", resp.data?.response?.response_message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setIsLoading(false); // stop loading
    }
  };

  /** ✅ Menu handler */
  const openMenu = (e, id) => {
    setMenuData({ anchor: e.currentTarget, rowId: id });
  };
  const closeMenu = () => {
    setMenuData({ anchor: null, rowId: null });
  };

  const editUnit = (id) => {
    alert("Edit ID: " + id);
    closeMenu();
  };

  const deleteUnit = (id) => {
    alert("Delete ID: " + id);
    closeMenu();
  };

  /** ✅ Table Columns */
  const columns = [
    {
      field: "sno",
      headerName: "S.No.",
      renderCell: (params) => params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
    },
    { field: "lookup_value", headerName: "Org Unit", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={(e) => openMenu(e, params.row._id)}>
            <MoreVertIcon />
          </IconButton>
          {menuData.rowId === params.row._id && (
            <Menu
              anchorEl={menuData.anchor}
              open={Boolean(menuData.anchor)}
              onClose={closeMenu}
              disableScrollLock
            >
              <MenuItem onClick={() => editUnit(params.row._id)}>Edit</MenuItem>
              <MenuItem onClick={() => deleteUnit(params.row._id)}>Delete</MenuItem>
            </Menu>
          )}
        </>
      ),
    },
  ];

  /** ✅ Table Rows */
  const rows = allOrgUnits?.map((item) => ({
    id: item._id,
    ...item,
  }));

  return (
    <div className="container mt-8">
      <div className='mb-6'>
        <h2 className="text-2xl font-semibold mb-2">
          Enter Details for Org Unit Master
        </h2>
        <p className="text-para">
          Add or update the required details for the org unit master to keep records accurate and complete.
        </p>
      </div>

      {/* ✅ Form */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <label className="form-label text-[14px]">Org Unit</label>
          <TextField
            name="orgunit"
            placeholder="Enter org unit"
            value={orgUnit}
            onChange={(e) => setOrgUnit(e.target.value)}
            size="small"
          />
        </FormControl>

        <FormButton variant="contained" onClick={addOrgUnit}>
          Submit
        </FormButton>
      </Paper>

      {/* ✅ Table */}
      <div className="mt-6">
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}   // ✅ <-- Add here
          disableColumnMenu
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          autoHeight
        />
      </div>
    </div>
  );
};

export default OrgUnitMaster;
