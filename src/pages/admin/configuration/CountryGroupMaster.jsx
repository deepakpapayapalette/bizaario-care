import React, { useState } from 'react'
import {
  Box, Button, TextField, FormControl, Menu, MenuItem, IconButton, Paper
} from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { __postApiData } from '@utils/api';
import { useEffect } from 'react';
import FormButton from '../../../components/common/FormButton';
const CountryGroupMaster = () => {
  const [allcountrygroup, setallcountrygroup] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);
  const [country_group, setcountry_group] = useState('');



  const getallcountrygroup = async () => {
    try {
      const resp = await __postApiData('/api/v1/admin/LookupList', {
        lookupcodes: 'country_group_type',
      });
      setallcountrygroup(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getallcountrygroup();
  }, []);

  const handleOpenMenuhospital = (event, rowId) => {
    setMenuAnchor(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleCloseMenuhospital = () => {
    setMenuAnchor(null);
    setMenuRowId(null);
  };

  const onEdithospital = () => {
    alert('edit');
  };

  const onDeletehospital = () => {
    alert('delete');
  };

  const columns = [
    {
      field: 'sno',
      headerName: 'S.No.',
      flex: 0.2,
      renderCell: (params) =>
        params.api.getAllRowIds().indexOf(params.id) + 1,

    },
    // { field: 'lookup_type', headerName: 'Country Group Master Id', flex: 1 },
    {
      field: 'lookup_value', headerName: 'Country Group ', flex: 1, renderCell: (params) => (
        <span style={{
          fontFamily: 'sans-serif',
          fontSize: '1rem'
        }}>
          {params.value}
        </span>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      sortable: false,
      filterable: false,
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
  ];

  const rowshospital = allcountrygroup?.map((doc, index) => ({
    id: doc._id || index,
    ...doc,
  }));

  const add_country_group = async () => {
    try {

      const resp = await api.post('/api/v1/admin/SaveLookup', {
        lookup_type: 'country_group_type',
        parent_lookup_id: null,
        lookup_value: country_group,
      });

      if (resp.data.response.response_code === '200') {
        Swal.fire({
          icon: 'success',
          title: 'Country Group Created',
          text: 'Country Group Created Successfully...',
          showConfirmButton: true,
          customClass: {
            confirmButton: 'my-swal-button',
          },
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text:
            resp.data.response.response_message || 'Something went wrong!',
          showConfirmButton: true,
        });
      }
    } catch (error) {
      console.error('❌ API Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Server Error',
        text: error.message || 'Something went wrong!',
        showConfirmButton: true,
      });
    }
  };


  return (
    <div className='container mt-8'>
      <div>
        <h2 className='text-2xl font-semibold mb-2'>Enter Details for Country Group Master</h2>
        <p className='text-para '>Add or update the required details for the country group master to keep records accurate and complete.</p>

        <div className="form-container pt-4">
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>

            <div className="form-grid mb-4">
              <FormControl fullWidth size="small">
                <label className="form-label text-[14px]">Country Group</label>
                <TextField
                  name="country_group"
                  placeholder="Country Group"
                  value={country_group}
                  onChange={(e) => setcountry_group(e.target.value)}
                  fullWidth
                  size="small"
                />
              </FormControl>
            </div>

            <FormButton
              variant="contained"


              onClick={add_country_group}
            >
              Submit
            </FormButton>


          </Paper>
        </div>

        <div className='mt-6'>
          <div >
            <DataGrid
              className=""
              rows={rowshospital}
              columns={columns}
              pageSize={10}
              pageSizeOptions={[]} // removes rows per page selector
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}

              disableSelectionOnClick
              autoHeight
            />
          </div>
        </div>
      </div>

    </div>
  )
}

export default CountryGroupMaster

