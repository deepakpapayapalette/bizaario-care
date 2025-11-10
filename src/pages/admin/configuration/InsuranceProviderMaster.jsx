
import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Grid, Button, Typography, Card, Avatar,
  TextField, FormControl, InputLabel, Select, MenuItem, RadioGroup,
  FormControlLabel, Radio, Fade, Chip, Menu, Paper
} from '@mui/material';
import { IconButton, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { __postApiData } from '@utils/api';
import FormButton from '../../../components/common/FormButton';
const InsuranceProviderMaster = () => {


  const [all_insurance_provider, setall_insurance_provider] = useState([])
  const getall_insurance_provider = async () => {
    try {
      const resp = await __postApiData('/api/v1/admin/LookupList', { lookupcodes: "insurance_provider_master" })
      setall_insurance_provider(resp.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getall_insurance_provider()

  }, [])

  const [all_station, setall_station] = useState([])
  const getall_station = async () => {
    try {
      const resp = await __postApiData('/api/v1/admin/StationList');
      setall_station(resp.data.list)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getall_station()

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
    // { field: 'parent_lookup_id', headerName: 'Station Name', flex: 1 },
    { field: 'lookup_value', headerName: 'Insurance Provider', flex: 1 },

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

  const rowshospital = all_insurance_provider?.map((doc, index) => ({
    id: doc._id || index,
    ...doc,
  }));

  const [insurance_provider, setinsurance_provider] = useState("")
  const [station_id, setstation_id] = useState("")
  const [is_goverment_scheme, setis_goverment_scheme] = useState(true)


  const add_assest_category = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/SaveLookup", {
        lookup_type: "insurance_provider_master",
        parent_lookup_id: station_id ? station_id : null,
        lookup_value: insurance_provider,
        other: { is_goverment_scheme: is_goverment_scheme }
      });
      console.log(resp, "resp")

      if (resp.response.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Insurance Provider",
          text: "Insurance Provider Addedd Successfully...",
          showConfirmButton: true,
          customClass: {
            confirmButton: 'my-swal-button',
          },
        }).then(() => {
          window.location.reload()
        })
        console.log("✅ Lookup list:", resp.data);
      } else {
        console.warn("⚠️ Error:", resp.response.response_message);
      }
    } catch (error) {
      console.error("❌ API Error:", error);
    }
  };
  return (
    <div className='container mt-8'>
      <div>
        <div className='mb-6'>
          <h2 className="text-2xl font-semibold mb-2">
            Enter Details for Insurance Provider
          </h2>
          <p className="text-para">
            Add or update the required details for the insurance provider to keep records accurate and complete.
          </p>
        </div>
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
          <div className="flex gap-4 mb-4">


            <FormControl fullWidth size="small">
              <label className="text-[14px]">Station Id</label>
              <Select
                name="station_id"
                value={station_id}
                onChange={(e) => setstation_id(e.target.value)}
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <span style={{ color: "#9ca3af" }}>Select Station Id</span>;
                  }
                  return all_station.find((item) => item._id === selected)?.StationName;
                }}
              >
                <MenuItem disabled value="">
                  <em>Station Id</em>
                </MenuItem>
                {
                  all_station?.map((item) =>
                  (
                    <MenuItem value={item._id}>{item.StationName}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <label className="text-[14px]">Insurance Provider</label>
              <TextField
                name="insurance_provider"
                placeholder="Insurance Provider"
                value={insurance_provider}
                onChange={(e) => setinsurance_provider(e.target.value)}
                fullWidth
                size="small"
              />
            </FormControl>

            <FormControl fullWidth size="small">
              <label className="text-[14px]">Is Goverment Scheme</label>
              <RadioGroup size="small"
                row
                name="is_goverment_scheme"
                value={is_goverment_scheme}
                onChange={(e) => setis_goverment_scheme(e.target.value)}
                sx={{ flexDirection: 'row', alignItems: 'flex-start', gap: 1 }}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

          </div>

          <FormButton
            variant='contained'
            onClick={add_assest_category}
          >
            Submit
          </FormButton>
        </Paper>
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

export default InsuranceProviderMaster

