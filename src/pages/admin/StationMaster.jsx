import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Button, TextField, FormControl, Paper, Select, MenuItem,
  IconButton, Menu
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { DataGrid } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import { __postApiData } from '@utils/api';
import FormButton from '../../components/common/FormButton';
const StationMaster = () => {
  const [allstationmaster, setallstationmaster] = useState([]);
  const [allorgunits, setallorgunits] = useState([]);
  const [allcountrygroup, setallcountrygroup] = useState([]);
  const [allisdcode, setallisdcode] = useState([]);
  const [allcurrency, setallcurrency] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const [stationmaster, setstationmaster] = useState({
    ParentStationId: null,
    OrgUnitLevel: null,
    StationName: "",
    CountryGroupId: null,
    ISDCode: null,
    Currency: null,
    CensusYear: "",
    PopulationMale: "",
    PopulationFemale: "",
    TotalPopulation: "",
    LiteracyRate: "",
    AreaSQKM: "",
  });

  // ================= Fetch data ==================
  const getallstation_list = async () => {
    try {
      setIsLoading(true);
      const resp = await __postApiData('/api/v1/admin/StationList',
        { search: "", CountryGroupId: {}, });
      setallstationmaster(resp.data.list);
    } catch (error) {
      console.log(error);
    }
    finally {
      setIsLoading(false);
    }
  };




  const getallorgunits = async () => {
    try {
      const resp = await __postApiData('/api/v1/admin/LookupList', { lookupcodes: "org_unit_type" });
      setallorgunits(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getallcountrygroup = async () => {
    try {
      const resp = await __postApiData('/api/v1/admin/LookupList', { lookupcodes: "country_group_type" });
      setallcountrygroup(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getallisdcode = async () => {
    try {
      const resp = await __postApiData('/api/v1/admin/LookupList', { lookupcodes: "isd_code_type" });
      setallisdcode(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getallcurrency = async () => {
    try {
      const resp = await __postApiData('/api/v1/admin/LookupList', { lookupcodes: "currency_type" });
      setallcurrency(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getallstation_list();
    getallorgunits();
    getallcountrygroup();
    getallisdcode();
    getallcurrency();
  }, []);

  // ================= Handlers ==================
  const handlechange = (e) => {
    const { name, value } = e.target;
    setstationmaster((prev) => ({ ...prev, [name]: value }));
  };

  const addstation_master = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/SaveStation", stationmaster);
      if (resp.response.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Station Master Added",
          text: "Station Master Added Successfully...",
          confirmButtonText: "OK",
          customClass: { confirmButton: 'my-swal-button' },
        }).then(() => window.location.reload());
      } else {
        Swal.fire({
          icon: "error",
          title: "Error Occured",
          text: resp.response.response_message.error,
          confirmButtonText: "OK",
          customClass: { confirmButton: 'my-swal-button' },
        });
      }
    } catch (error) {
      console.error("❌ API Error:", error);
    }
  };

  // ================= Table ==================
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

  const columnshospital = [
    { field: 'sno', headerName: 'S.No.', flex: 0.2, renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1 },
    { field: 'StationName', headerName: 'Station Name', flex: 1 },
    { field: 'LiteracyRate', headerName: 'Literacy Rate', flex: 1 },
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
              <MenuItem onClick={() => { onEdithospital(params.row._id); handleCloseMenuhospital(); }}>Edit</MenuItem>
              <MenuItem onClick={() => { onDeletehospital(params.row._id); handleCloseMenuhospital(); }}>Delete</MenuItem>
            </Menu>
          )}
        </>
      ),
    }
  ];

  const rowshospital = allstationmaster?.map((doc, index) => ({
    id: doc._id || index,
    ...doc,
  }));
  return (
    <div className='container mt-8'>
      <div className='mb-6'>
        <h2 className="text-2xl font-semibold mb-2">
          Enter Details for Station Master
        </h2>
        <p className="text-para">
          Add or update the required details for the station master to keep records accurate and complete.
        </p>
      </div>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-6">
          {/* Dropdowns and inputs */}

          <FormControl fullWidth size="small">

            <label className="form-label">Org Unit Level</label>
            <Select name="OrgUnitLevel" value={stationmaster.OrgUnitLevel} onChange={handlechange}
              displayEmpty
              MenuProps={{
                disablePortal: true,
                disableScrollLock: true,
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#9ca3af" }}>Select Org Level Unit</span>; // grey placeholder
                }
                return allorgunits.find((item) => item._id === selected)?.lookup_value;
              }}

            >

              <MenuItem disabled value="">
                <em>Select Org Level Unit</em>
              </MenuItem>
              {allorgunits.map((item) => (
                <MenuItem key={item._id} value={item._id}>{item.lookup_value}</MenuItem>
              ))}
            </Select>
          </FormControl>


          <FormControl fullWidth size="small">
            <label className="form-label">Parent Station</label>
            <Select
              name="ParentStationId"
              value={stationmaster.ParentStationId || ""}
              onChange={handlechange}
              displayEmpty
              MenuProps={{
                disablePortal: true,
                disableScrollLock: true,
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#9ca3af" }}>Select Parent Station</span>; // grey placeholder
                }
                return allstationmaster?.find((item) => item._id === selected)?.StationName;
              }}
            >
              {/* Placeholder option (disabled so it can't be re-selected) */}
              <MenuItem disabled value="">
                <em>Select Parent Station</em>
              </MenuItem>

              {allstationmaster?.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  {item.StationName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <label className="form-label">Station Name</label>
            <TextField name="StationName" placeholder='Station Name' value={stationmaster.StationName} onChange={handlechange} size="small" fullWidth />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Country Group</label>
            <Select name="CountryGroupId" value={stationmaster.CountryGroupId} onChange={handlechange}
              displayEmpty
              MenuProps={{
                disablePortal: true,
                disableScrollLock: true,
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#9ca3af" }}>Select Country Group</span>; // grey placeholder
                }
                return allcountrygroup.find((item) => item._id === selected)?.lookup_value;
              }}

            >
              {allcountrygroup.map((item) => (
                <MenuItem key={item._id} value={item._id}>{item.lookup_value}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <label className="form-label">ISD Code</label>
            <Select name="ISDCode" value={stationmaster.ISDCode} onChange={handlechange}
              displayEmpty
              MenuProps={{
                disablePortal: true,
                disableScrollLock: true,
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#9ca3af" }}>Select ISD Code</span>; // grey placeholder
                }
                return allisdcode.find((item) => item._id === selected)?.lookup_value;
              }}
            >
              {allisdcode.map((item) => (
                <MenuItem key={item._id} value={item._id}>{item.lookup_value}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <label className="form-label">Currency</label>
            <Select name="Currency" value={stationmaster.Currency} onChange={handlechange}
              displayEmpty
              MenuProps={{
                disablePortal: true,
                disableScrollLock: true,
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#9ca3af" }}>Select Currency</span>; // grey placeholder
                }
                return allcurrency.find((item) => item._id === selected)?.lookup_value;
              }}
            >
              {allcurrency.map((item) => (
                <MenuItem key={item._id} value={item._id}>{item.lookup_value}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <label className="form-label">Census Year</label>
            <TextField type="number" name="CensusYear" placeholder="Census Year" value={stationmaster.CensusYear} onChange={handlechange} size="small" fullWidth />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Population Male</label>
            <TextField type="number" name="PopulationMale" placeholder="Population Male" value={stationmaster.PopulationMale} onChange={handlechange} size="small" fullWidth />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Population Female</label>
            <TextField type="number" name="PopulationFemale" placeholder="Population Female" value={stationmaster.PopulationFemale} onChange={handlechange} size="small" fullWidth />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Total Population</label>
            <TextField type="number" name="TotalPopulation" placeholder="Total Population" value={stationmaster.TotalPopulation} onChange={handlechange} size="small" fullWidth />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Literacy Rate (%)</label>
            <TextField type="number" name="LiteracyRate" placeholder="Literacy Rate (%)" value={stationmaster.LiteracyRate} onChange={handlechange} size="small" fullWidth />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className="form-label">Area in SQKM</label>
            <TextField type="number" name="AreaSQKM" placeholder="Area in SQKM" value={stationmaster.AreaSQKM} onChange={handlechange} size="small" fullWidth />
          </FormControl>
        </div>

        <FormButton variant="contained" onClick={addstation_master}>
          Submit
        </FormButton>
      </Paper>

      <div className='mt-6'>
        <DataGrid
          className="custom-data-grid"
          rows={rowshospital}
          columns={columnshospital}
          pageSize={10}
          disableRowSelectionOnClick
          autoHeight
          loading={isLoading}
        />

      </div>
    </div>
  )
}

export default StationMaster

