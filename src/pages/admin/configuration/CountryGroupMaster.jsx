import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, FormControl, Menu, MenuItem, IconButton, Paper
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { __postApiData } from '@utils/api';
import FormButton from '../../../components/common/FormButton';

const CountryGroupMaster = () => {
  const [allcountrygroup, setallcountrygroup] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [country_group, setcountry_group] = useState('');

  // ✅ New Loading State
  const [loading, setLoading] = useState(true);


  const getallcountrygroup = async () => {
    try {
      setLoading(true);   // start loader

      const resp = await __postApiData('/api/v1/admin/LookupList', {
        lookupcodes: 'country_group_type',
      });

      setallcountrygroup(resp.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);  // stop loader
    }
  };

  useEffect(() => {
    getallcountrygroup();
  }, []);

  const add_country_group = async () => {
    try {
      const resp = await __postApiData('/api/v1/admin/SaveLookup', {
        lookup_type: 'country_group_type',
        parent_lookup_id: null,
        lookup_value: country_group,
      });

      if (resp.response.response_code === '200') {
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
            resp.response.response_message || 'Something went wrong!',
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
    {
      field: 'lookup_value',
      headerName: 'Country Group',
      flex: 1,
      renderCell: (params) => (
        <span style={{ fontFamily: 'sans-serif', fontSize: '1rem' }}>
          {params.value}
        </span>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
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
              <MenuItem onClick={() => onEdithospital(params.row._id)}>
                Edit
              </MenuItem>
              <MenuItem onClick={() => onDeletehospital(params.row._id)}>
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

  return (
    <div className='container mt-8'>
      <div>

        {/* form fields */}
        <div className='mt-6'>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              Enter Details for Country Group Master
            </h2>
            <p className="text-para">
              Add or update the required details for the country group master to keep records accurate and complete.
            </p>
          </div>

          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <div className="form-grid mb-6">
              <FormControl fullWidth size="small">
                <label className="form-label">Country Group</label>
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
              className='submit-button'

              onClick={add_country_group}
            >
              Submit
            </FormButton>
          </Paper>
          <div className='mt-6'>
            {/* ✅ Loading added here */}
            <DataGrid
              rows={rowshospital}
              columns={columns}
              pageSize={10}
              loading={loading}        // <-- ✅ show loader
              disableSelectionOnClick
              autoHeight
              pageSizeOptions={[]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryGroupMaster;
