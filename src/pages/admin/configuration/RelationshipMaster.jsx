import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, FormControl, MenuItem, Menu, Paper } from '@mui/material';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { __postApiData } from '@utils/api';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import FormButton from '../../../components/common/FormButton';

const RelationshipMaster = () => {
  const [RelationshipType, setRelationshipType] = useState([]);
  const [data, setData] = useState("");

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  // ✅ Loading state
  const [isLoading, setIsLoading] = useState(false);

  /** ✅ Fetch Relationship Types */
  const getRelationshipType = async () => {
    try {
      setIsLoading(true);  // start loader
      const resp = await __postApiData('/api/v1/admin/LookupList', { lookupcodes: "relationship_type" });
      setRelationshipType(resp.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // stop loader
    }
  };

  useEffect(() => {
    getRelationshipType();
  }, []);

  /** ✅ Table Action Handlers */
  const handleOpenMenuhospital = (event, rowId) => {
    setMenuAnchor(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleCloseMenuhospital = () => {
    setMenuAnchor(null);
    setMenuRowId(null);
  };

  const onEdithospital = () => {
    alert("edit");
    handleCloseMenuhospital();
  };

  const onDeletehospital = () => {
    alert("delete");
    handleCloseMenuhospital();
  };

  /** ✅ Columns */
  const columns = [
    {
      field: 'sno',
      headerName: 'S.No.',
      flex: 0.2,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1
    },
    {
      field: 'lookup_value',
      headerName: 'Relationship Value',
      flex: 1
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={(e) => handleOpenMenuhospital(e, params.row._id)}>
            <MoreVertIcon />
          </IconButton>

          {menuRowId === params.row._id && (
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleCloseMenuhospital}
              disableScrollLock
            >
              <MenuItem onClick={() => onEdithospital(params.row._id)}>Edit</MenuItem>
              <MenuItem onClick={() => onDeletehospital(params.row._id)}>Delete</MenuItem>
            </Menu>
          )}
        </>
      ),
    }
  ];

  /** ✅ Table rows */
  const rows = RelationshipType?.map((doc, index) => ({
    id: doc._id || index,
    ...doc,
  }));

  /** ✅ Add Relationship Type */
  const add_relationship_type = async () => {
    try {
      setIsLoading(true); // optional loader while submitting

      const resp = await __postApiData("/api/v1/admin/SaveLookup", {
        lookup_type: "relationship_type",
        parent_lookup_id: null,
        lookup_value: data
      });

      if (resp.response.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Relationship Type Created",
          text: "Relationship Type Added Successfully...",
          showConfirmButton: true,
          customClass: { confirmButton: 'my-swal-button' },
        }).then(() => {
          setData("");
          getRelationshipType(); // refresh list
        });
      } else {
        Swal.fire("Error", resp.response.response_message, "error");
      }
    } catch (error) {
      console.error("❌ API Error:", error);
      Swal.fire("Error", "Something went wrong", "error");
    } finally {
      setIsLoading(false); // stop loader
    }
  };

  return (
    <div className='container mt-8'>
      <div className='mb-6'>
        <h2 className="text-2xl font-semibold mb-2">
          Enter Details for Relationship Type
        </h2>
        <p className="text-para">
          Add or update the required details for the subscription type to keep records accurate and complete.
        </p>
      </div>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className="form-grid mb-4">
          <FormControl fullWidth size="small">
            <label className="text-[14px]">Relationship Type</label>
            <TextField
              name="eventtype"
              placeholder="Relationship Type"
              value={data}
              onChange={(e) => setData(e.target.value)}
              fullWidth
              size="small"
            />
          </FormControl>
        </div>

        <FormButton
          variant='contained'
          onClick={add_relationship_type}
        >
          Submit
        </FormButton>
      </Paper>

      {/* ✅ Table */}
      <div className='mt-6'>
        <DataGrid
          className="custom-data-grid"
          rows={rows}
          columns={columns}
          loading={isLoading}     // ✅ <-- ADD LOADING
          pageSize={10}
          pageSizeOptions={[]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          disableSelectionOnClick
          disableColumnMenu
          autoHeight
        />
      </div>
    </div>
  );
};

export default RelationshipMaster;
