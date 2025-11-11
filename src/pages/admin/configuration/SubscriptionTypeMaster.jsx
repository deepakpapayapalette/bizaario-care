import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, FormControl, MenuItem, Menu, Paper } from '@mui/material';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { __postApiData } from '@utils/api';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import FormButton from '../../../components/common/FormButton';

const SubscriptionTypeMaster = () => {

  const [SubscriptionType, setSubscriptionType] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSubscriptionType = async () => {
    try {
      setIsLoading(true);
      const resp = await __postApiData('/api/v1/admin/LookupList', {
        lookupcodes: "subscription_type"
      });
      setSubscriptionType(resp.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSubscriptionType();
  }, []);

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
    alert("edit");
  };

  const onDeletehospital = () => {
    alert("delete");
  };

  const columns = [
    { field: 'sno', headerName: 'S.No.', flex: 0.2, renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1 },
    { field: 'lookup_value', headerName: 'Subscription Value', flex: 1 },
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

  const rows = SubscriptionType?.map((doc, index) => ({
    id: doc._id || index,
    ...doc,
  }));

  const [data, setData] = useState("");

  const add_subscription_type = async () => {
    try {
      setIsLoading(true);

      const resp = await __postApiData("/api/v1/admin/SaveLookup", {
        lookup_type: "subscription_type",
        parent_lookup_id: null,
        lookup_value: data,
      });

      if (resp?.response.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Subscription Type Created",
          text: "Subscription Type Added Successfully...",
          showConfirmButton: true,
          customClass: {
            confirmButton: "my-swal-button",
          },
        }).then(() => {
          window.location.reload();
        });

      } else {
        Swal.fire({
          icon: "warning",
          title: "Oops",
          text: resp?.response?.response_message || "Something went wrong",
        });
      }
    } catch (error) {
      console.error("❌ API Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container mt-8'>

      <div className='mb-6'>
        <h2 className="text-2xl font-semibold mb-2">
          Enter Details for Subscription Type
        </h2>
        <p className="text-para">
          Add or update the required details for the subscription type to keep records accurate and complete.
        </p>
      </div>

      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>

        <div className="form-grid mb-4">
          <FormControl fullWidth size="small">
            <label className="text-[14px]">Subscription Type</label>
            <TextField
              name="eventtype"
              placeholder="Subscription Type"
              value={data}
              onChange={(e) => setData(e.target.value)}
              fullWidth
              size="small"
            />
          </FormControl>
        </div>

        <FormButton
          variant='contained'
          onClick={add_subscription_type}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit"}
        </FormButton>

      </Paper>

      {/* Table */}
      <div className='mt-6'>
        <DataGrid
          className="custom-data-grid"
          rows={rows}
          columns={columns}
          loading={isLoading}
          pageSize={10}
          pageSizeOptions={[]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          disableSelectionOnClick
          disableColumnMenu
        />
      </div>
    </div>
  );
};

export default SubscriptionTypeMaster;
