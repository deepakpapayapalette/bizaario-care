import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Grid, Button, Typography, Card, Avatar,
  TextField, FormControl, InputLabel, Select, MenuItem, Paper,
  FormControlLabel, Radio, Fade, Chip, Menu, InputAdornment
} from '@mui/material';
import { IconButton, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { __postApiData } from '@utils/api';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import FormButton from '../../../components/common/FormButton';

const ServiceCategory = () => {

  const [allservice, setallservice] = useState([])
  const getallservice = async () => {
    try {
      const resp = await __postApiData('/api/v1/admin/LookupList', { lookupcodes: "service_category" })
      setallservice(resp.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getallservice()

  }, [])

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

  const onEdithospital = () => {
    alert("edit")
  }

  const onDeletehospital = () => {
    alert("delete")
  }

  const columnshospital = [
    { field: 'sno', headerName: 'S.No.', flex: 0.2, renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1 },
    // { field: 'lookup_type', headerName: 'Service Category Type', flex: 1 },
    { field: 'lookup_value', headerName: 'Service Category', flex: 1 },

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
    }

  ];

  const rowshospital = allservice?.map((doc, index) => ({
    id: doc._id || index,
    ...doc,
  }));

  const [servicecategory, setservicecategory] = useState("")
  const add_service_category = async () => {
    try {
      const resp = await api.post("api/v1/admin/SaveLookup", {
        lookup_type: "service_category",
        parent_lookup_id: null,
        lookup_value: servicecategory
      });

      if (resp.data.response.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Service Created",
          text: "Service Created Successfully...",
          showConfirmButton: true,
          customClass: {
            confirmButton: 'my-swal-button',
          },
        }).then(() => {
          window.location.reload()
        })
        console.log("✅ Lookup list:", resp.data.data);
      } else {
        console.warn("⚠️ Error:", resp.data.response.response_message);
      }
    } catch (error) {
      console.error("❌ API Error:", error);
    }
  };

  return (
    <div className='container'>
      <div className='mb-6'>
        <h2 className="text-2xl font-semibold mb-2">
          Enter Details for Service Category Master
        </h2>
        <p className="text-para">
          Add or update the required details for the service category master to keep records accurate and complete.
        </p>
      </div>
      <div>
        <div className='mb-8'>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <div className=" mb-4">
              <FormControl fullWidth size="small">
                <label className="form-label text-[14px]">Service Category</label>
                <TextField
                  name="servicecategory"
                  placeholder="Service Category"
                  value={servicecategory}
                  onChange={(e) => setservicecategory(e.target.value)}
                  fullWidth
                  size="small"
                />
              </FormControl>
            </div>
            <FormButton variant="contained"

              className='submit-button'
              onClick={add_service_category}
              size="large"
            >
              Submit
            </FormButton>
          </Paper>
        </div>
        {/* Table */}
        <div className='mt-6'>

          <DataGrid
            className="custom-data-grid"
            rows={rowshospital}
            columns={columnshospital}
            pageSize={10}
            pageSizeOptions={[]} // removes the rows per page selector
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
            }}
            disableSelectionOnClick

          />
        </div>
      </div>
    </div>
  )
}

export default ServiceCategory

