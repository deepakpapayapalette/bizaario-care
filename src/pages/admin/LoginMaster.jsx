import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Grid, Button, Typography, Card, Avatar,
  TextField, FormControl, InputLabel, Select, MenuItem, RadioGroup,
  FormControlLabel, Radio, Fade, Chip, Menu, Paper
} from '@mui/material';
import { IconButton, Tooltip } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { __postApiData } from '@utils/api';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import { customMenuProps } from '../../utils/CustomMenuProps';
import FormButton from '../../components/common/FormButton';
import FormInput from '../../components/common/FormInput';

const LoginMaster = () => {
  const [loginmaster, setloginmaster] = useState({

    ParentUserId: null,
    EntityTypeId: null,
    Entity: null,
    UserName: "",
    PhoneNumber: "",
    Email: "",
    // Password: "",
    IsPhoneVerified: "",
    IsEmailVerified: "",
  });

  const [totalCount, setTotalCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, // DataGrid pages start from 0
    pageSize: 10,
  });

  const [alllogin_list, setalllogin_list] = useState([])
  const getalllogin_list = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/UserList", {
        page: paginationModel.page + 1, // ✅ DataGrid uses 0-based index, API uses 1-based
        limit: paginationModel.pageSize,
        search: "",
      });
      console.log(resp);
      setTotalCount(resp.data.total);

      setalllogin_list(resp.data.list)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getalllogin_list();
  }, [paginationModel]);

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
    { field: 'UserName', headerName: 'User Name', flex: 1 },
    { field: 'Email', headerName: 'Email', flex: 1 },

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

  const rowshospital = alllogin_list?.map((doc, index) => ({
    id: doc._id || index,
    ...doc,
  }));


  // =============================get create login for list=====================================

  const [login_for, setlogin_for] = useState([])
  const getall_login_for = async () => {
    try {
      const resp = await __postApiData('/api/v1/common/LookupList', { "lookup_type": "entity_type" })
      setlogin_for(resp.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getall_login_for()

  }, [])

  const selectedLoginFor = login_for?.find(
    (item) => item._id === loginmaster.EntityTypeId
  );


  // =================================get org list==============================================

  const [allorgunits, setallorgunits] = useState([])
  const getallorgunits = async () => {
    try {
      const resp = await __postApiData('/api/v1/admin/LookupList', { lookupcodes: "org_unit_type" })
      setallorgunits(resp.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getallorgunits()

  }, [])

  //================================= get station list=================================================

  const [allstationmaster, setallstationmaster] = useState([])
  const getallstation_list = async () => {
    try {
      const resp = await __postApiData('/api/v1/admin/StationList', { page: 1, limit: 10, search: "" })
      console.log(resp);

      setallstationmaster(resp.data.list)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getallstation_list()

  }, [])


  //========================================= get entity type ================================================

  const [allassest_category_level1, setallassest_category_level1] = useState([])
  const getallassest_category = async () => {
    try {
      const resp = await __postApiData('/api/v1/admin/LookupList', { lookupcodes: "asset_category_level_1" })
      setallassest_category_level1(resp.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    getallassest_category()

  }, [])

  //====================================== get asset ========================================================

  const [allasset_master_list, setallasset_master_list] = useState([])
  const [entitytype, setentitytype] = useState(null)
  const getall_assest_master = async () => {
    try {
      const resp = await __postApiData('/api/v1/admin/AssetList',
        {
          page: 1,
          limit: 10,
          AssetCategoryLevel1: entitytype,
          // "AssetCategoryLevel2": "64f1a2b3c4d5e6f7g8h9i0j2",
          // "search": "hospital"
        }
      )
      setallasset_master_list(resp.data.list)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (entitytype) {
      getall_assest_master()
    }

  }, [entitytype])

  console.log(entitytype);

  const handlechange = (e) => {
    const { name, value, checked, type } = e.target;

    setloginmaster((prev) => {
      // Handle boolean radios (true/false as string)
      const booleanFields = ["IsEmailVerified", "IsPhoneVerified"];
      if (booleanFields.includes(name)) {
        return { ...prev, [name]: value === "true" };
      }

      // Handle checkboxes (single boolean)
      if (type === "checkbox" && !Array.isArray(prev[name])) {
        return { ...prev, [name]: checked };
      }

      // Handle checkboxes (array)
      if (type === "checkbox" && Array.isArray(prev[name])) {
        const updated = checked
          ? [...prev[name], value]
          : prev[name].filter((item) => item !== value);
        return { ...prev, [name]: updated };
      }

      // Normal single-value field
      return { ...prev, [name]: value };
    });
  };


  //========================== post api for create login master=============================

  const addstation_master = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/CreateAssetLogin", loginmaster);
      console.log(resp);

      if (resp.data.response.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Login Created",
          text: "Login Created Successfully...",
          showConfirmButton: true,
          customClass: {
            confirmButton: 'my-swal-button',
          },
        }).then(() => {
          window.location.reload()
        })
        console.log("✅ Lookup list:", resp.data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error Occured",
          text: resp.data.response.response_message.error,
          showConfirmButton: true,
          customClass: {
            confirmButton: 'my-swal-button',
          }
        })
        console.warn("⚠️ Error:", resp.data.response.response_message);
      }
    } catch (error) {
      console.error("❌ API Error:", error);
    }
  };

  return (
    <div className='container mt-8'>
      <div className='mb-6'>
        <h2 className="text-2xl font-semibold mb-2">
          Enter Details for Login Master
        </h2>
        <p className="text-para">
          Add or update the required details for the login master to keep records accurate and complete.
        </p>
      </div>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-6">
          <FormControl component="fieldset" sx={{ mt: 0 }}>
            <Typography sx={{ fontWeight: 500 }} className='form-label'>Create Login For (Entity Type)</Typography>
            <RadioGroup size="small"
              row
              name="EntityTypeId"
              value={loginmaster.EntityTypeId}
              onChange={handlechange}
              sx={{ flexDirection: 'row', alignItems: 'flex-start', gap: 1 }}
            >
              {
                login_for?.map((item) =>
                (
                  <>
                    <FormControlLabel value={item._id} control={<Radio />} label={item.lookup_value} />
                  </>
                ))
              }

            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset" sx={{ mt: 0 }}>
            <Typography sx={{ fontWeight: 500 }} className='form-label'> Is Phone Verified</Typography>
            <RadioGroup size="small"
              row
              name="IsPhoneVerified"
              value={loginmaster.IsPhoneVerified}
              onChange={handlechange}
              sx={{ flexDirection: 'row', alignItems: 'flex-start', gap: 1 }}
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          <FormControl component="fieldset" sx={{ mt: 0 }}>
            <Typography sx={{ fontWeight: 500 }} className='form-label'> Is Email Verified</Typography>
            <RadioGroup size="small"
              row
              name="IsEmailVerified"
              value={loginmaster.IsEmailVerified}
              onChange={handlechange}
              sx={{ flexDirection: 'row', alignItems: 'flex-start', gap: 1 }}
            >
              <FormControlLabel value="true" control={<Radio />} label="Yes" />
              <FormControlLabel value="false" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          {
            selectedLoginFor?.lookup_value === "Station" &&
            (

              <FormControl fullWidth size="small">
                <label className='form-label'>Entity</label>
                <Select
                  name="Entity"
                  value={loginmaster.Entity}
                  onChange={handlechange}
                  MenuProps={customMenuProps}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <span style={{ color: "#9ca3af" }}>Entity</span>; // grey placeholder
                    }
                    return allstationmaster.find((item) => item._id === selected)?.StationName;
                  }}
                >
                  <MenuItem disabled value="">
                    <em>Entity</em>
                  </MenuItem>
                  {
                    allstationmaster?.map((item) =>
                    (
                      <MenuItem key={item._id} value={item._id}>{item.StationName}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>

            )
          }

          {
            selectedLoginFor?.lookup_value === "Asset" &&
            (
              <>
                <FormControl fullWidth size="small">
                  <label className='form-label'>Entity Type</label>
                  <Select
                    name="entitytype"
                    value={entitytype}
                    MenuProps={customMenuProps}
                    onChange={(e) => setentitytype(e.target.value)}
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return <span style={{ color: "#9ca3af" }}>Entity Type</span>; // grey placeholder
                      }
                      return allassest_category_level1.find((item) => item._id === selected)?.lookup_value;
                    }}
                  >

                    <MenuItem disabled value="">
                      <em>Entity Type</em>
                    </MenuItem>
                    {
                      allassest_category_level1?.map((item) =>
                      (
                        <MenuItem key={item._id} value={item._id}>{item.lookup_value}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>


                <FormControl fullWidth size="small">
                  <label className='form-label'>Entity</label>
                  <Select
                    name="Entity"
                    value={loginmaster.Entity}
                    onChange={handlechange}
                    MenuProps={customMenuProps}
                    displayEmpty
                    renderValue={(selected) => {
                      if (!selected) {
                        return <span style={{ color: "#9ca3af" }}>Entity</span>; // grey placeholder
                      }
                      return allasset_master_list.find((item) => item._id === selected)?.AssetName;
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>Entity</em>
                    </MenuItem>
                    {
                      allasset_master_list?.map((item) =>
                      (
                        <MenuItem key={item._id} value={item._id}>{item.AssetName}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </>
            )
          }

          <FormControl fullWidth size="small">
            <label className='form-label'>Parent User</label>
            <Select
              name="StationId"
              value={loginmaster.ParentStationId}
              MenuProps={customMenuProps}
              onChange={handlechange}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#9ca3af" }}>Parent User</span>;
                }
                return alllogin_list.find((item) => item._id === selected)?.UserName;
              }}
            >
              {
                alllogin_list.map((item) =>
                (
                  <MenuItem key={item._id} value={item._id}>{item.UserName}</MenuItem>
                ))
              }
            </Select>
          </FormControl>


          <FormControl fullWidth size="small">
            <label className='form-label'>⁠User Name</label>
            <TextField
              name="UserName"
              placeholder="⁠User Name"
              defaultValue={loginmaster.UserName}
              onChange={handlechange}
              fullWidth
              size="small"
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className='form-label'>Phone Number</label>
            <TextField
              name="PhoneNumber"
              placeholder="Phone Number"
              defaultValue={loginmaster.PhoneNumber}
              onChange={handlechange}
              fullWidth
              size="small"
            />
          </FormControl>

          <FormControl fullWidth size="small">
            <label className='form-label'>Email Address</label>
            <TextField
              name="Email"
              placeholder="Email Address"
              defaultValue={loginmaster.Email}
              onChange={handlechange}
              fullWidth
              size="small"
            />
          </FormControl>
        </div>

        <FormButton
          variant='contained'
          onClick={addstation_master}
        >
          Submit
        </FormButton>
      </Paper>

      <div className='mt-6'>
        <DataGrid
          className="custom-data-grid"
          rows={rowshospital}
          columns={columnshospital}
          paginationMode="server"
          rowCount={totalCount}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10]}
          disableSelectionOnClick
        />
      </div>
    </div>
  )
}

export default LoginMaster

