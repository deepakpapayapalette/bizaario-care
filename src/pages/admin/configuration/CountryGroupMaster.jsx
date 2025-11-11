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
          <div>

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
