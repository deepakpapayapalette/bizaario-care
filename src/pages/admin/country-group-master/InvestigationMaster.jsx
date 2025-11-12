import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Paper,
  FormControl,
  TextField,
  MenuItem,
  Menu,
  IconButton,
  Select,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import { __postApiData } from "@utils/api";
import FormButton from "../../../components/common/FormButton";

const InvestigationMaster = () => {
  const [loading, setloading] = useState(false)

  const [investigation_master, setinvestigation_master] = useState({
    Investigation_CategoryId: null,
    InvestigationName: "",
    ResponseUnit: "",
    Validity_Min_Value: "",
    Validity_Max_Value: "",
    Normal_Value_Minimum: "",
    Normal_Value_Maximum: "",
    Weightage_Value_Minimum: "",
    Weightage_Value_Maximum: "",
    SOS_Value_Minimum: "",
    SOS_Value_Maximum: "",
    Abnormalities: [],
  });



  const [input_value_abnormalities, setinput_value_abnormalities] = useState("");

  const handle_change_input_value_abnormalities = (e) => {
    setinput_value_abnormalities(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input_value_abnormalities.trim() !== "") {
      e.preventDefault();
      if (!investigation_master.Abnormalities.includes(input_value_abnormalities.trim())) {
        setinvestigation_master((prev) => ({
          ...prev,
          Abnormalities: [...prev.Abnormalities, input_value_abnormalities.trim()],
        }));
      }
      setinput_value_abnormalities("");
    }
  };

  const handleDelete = (tagToDelete) => {
    setinvestigation_master((prev) => ({
      ...prev,
      Abnormalities: prev.Abnormalities.filter((tag) => tag !== tagToDelete),
    }));
  };




  const [all_investigation_master, setall_investigation_master] = useState([])
  const getall_investigation_master = async () => {
    try {
      const resp = await __postApiData(`/api/v1/admin/investigationList`)
      console.log(resp);

      setall_investigation_master(resp.data.list)

    } catch (error) {
      console.log(error);

    }
  }


  useEffect(() => {
    getall_investigation_master()

  }, [])

  console.log(all_investigation_master);

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

  const [lookup_id, setlookup_id] = useState(null)
  const onEdit = (row) => {
    setlookup_id(row._id)
    setinvestigation_master({
      Investigation_CategoryId: row.Investigation_CategoryId._id,
      InvestigationName: row.InvestigationName,
      ResponseUnit: row.ResponseUnit,
      Validity_Min_Value: row.Validity_Min_Value,
      Validity_Max_Value: row.Validity_Max_Value,
      Normal_Value_Minimum: row.Normal_Value_Minimum,
      Normal_Value_Maximum: row.Normal_Value_Maximum,
      Weightage_Value_Minimum: row.Weightage_Value_Minimum,
      Weightage_Value_Maximum: row.Weightage_Value_Maximum,
      SOS_Value_Minimum: row.SOS_Value_Minimum,
      SOS_Value_Maximum: row.SOS_Value_Maximum,
      Abnormalities: row.Abnormalities,
    })

  }


  const onDeletehospital = () => {
    alert("delete")
  }

  const columns = [
    { field: 'sno', headerName: 'S.No.', flex: 0.2, renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1 },
    {
      field: 'parent_lookup_id', headerName: 'Investigation Category', flex: 0.5, renderCell: (params) => {
        return params.row?.Investigation_CategoryId?.lookup_value || ""
      }
    },
    {
      field: 'InvestigationName:', headerName: 'Investigation Name', flex: 0.5, renderCell: (params) => {
        return params.row?.InvestigationName || ""
      }
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
              <MenuItem
                onClick={() => {
                  onEdit(params.row);
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

  const rows = all_investigation_master?.map((doc, index) => ({
    id: doc._id || index,
    ...doc,
  }));




  //========================================= get group name id ================================================

  const [investigation_category, setinvestigation_category] = useState([])
  const get_investigation_category = async () => {
    try {
      const resp = await __postApiData('/api/v1/admin/LookupList', { lookupcodes: "procedure_group_name_type" })
      setinvestigation_category(resp.data)

    } catch (error) {
      console.log(error);

    }
  }

  useEffect(() => {
    get_investigation_category()

  }, [])







  const handlechange = (e) => {
    const { name, value, checked, type } = e.target;

    setinvestigation_master((prev) => {
      if (Array.isArray(value)) {
        return { ...prev, [name]: value };
      }

      if (Array.isArray(prev[name])) {
        const updated = checked
          ? [...prev[name], value] // Add
          : prev[name].filter((item) => item !== value); // Remove
        return { ...prev, [name]: updated };
      }

      if (type === "checkbox" && Array.isArray(prev[name])) {
        const updated = checked
          ? [...prev[name], value] // Add to array
          : prev[name].filter((item) => item !== value); // Remove from array
        return { ...prev, [name]: updated };
      }

      if (type === "checkbox") {
        return { ...prev, [name]: checked };
      }

      // Normal single-value field
      return { ...prev, [name]: type === "checkbox" ? checked : value };
    });
  };



  const add_investigation_master = async () => {
    try {
      const body = {
        ...investigation_master,
        _id: lookup_id,
      };

      setloading(true)
      const resp = await __postApiData("/api/v1/admin/SaveInvestigation", body

      );
      console.log(resp);


      if (resp.data.response.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Investigation Master Added",
          text: "Investigation Master Addedd Successfully...",
          showConfirmButton: true,
          customClass: {
            confirmButton: 'my-swal-button',
          },
        }).then(() => {
          window.location.reload()
        })
        console.log("✅ Lookup list:", resp.data);
      } else {
        console.warn("⚠️ Error:", resp.data.response.response_message);
        Swal.fire({
          icon: "error",
          title: "Error Occured",
          text: resp.data.response.response_message,
          showConfirmButton: true,
          customClass: {
            confirmButton: 'my-swal-button',
          }
        }
        )
      }
    } catch (error) {
      console.error("❌ API Error:", error);
    }
    finally {
      setloading(false)
    }
  };

  return (
    <div className="container mt-8">
      <div className="content-wrapper">
        <div className="main-content">

          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-2">Enter Details for Investigation Master</h3>
            <p className="text-para">Add or update the required details for the investigation master to keep records accurate and complete.</p>
          </div>


          {/* Form */}
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-6">


              <FormControl fullWidth size="small">
                <label className="form-label">Investigation Category</label>
                <Select
                  name="Investigation_CategoryId"
                  value={investigation_master.Investigation_CategoryId}
                  onChange={handlechange}
                  MenuProps={{
                    disablePortal: true,
                    disableScrollLock: true,
                  }}
                  displayEmpty
                  renderValue={(selected) => {
                    if (!selected) {
                      return <span style={{ color: "#9ca3af" }}>Investigation Category</span>; // grey placeholder
                    }
                    return investigation_category.find((item) => item._id === selected)?.lookup_value;
                  }}
                >

                  <MenuItem disabled value="">
                    <em>Investigation Category Id</em>
                  </MenuItem>
                  {
                    investigation_category?.map((item) =>
                    (
                      <MenuItem key={item._id} value={item._id}>{item.lookup_value}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>


              <FormControl fullWidth size="small">
                <label className="form-label">Investigation Name</label>
                <TextField
                  name="InvestigationName"
                  defaultValue={investigation_master.InvestigationName}
                  onChange={handlechange}
                  placeholder='Investigation Name'
                  size="small"
                >

                </TextField>
              </FormControl>




              <FormControl fullWidth size="small">
                <label className="form-label">Response Unit </label>
                <TextField
                  name="ResponseUnit"
                  value={investigation_master.ResponseUnit}
                  onChange={handlechange}
                  placeholder='Response Unit'
                  size="small"
                >

                </TextField>
              </FormControl>

              <FormControl fullWidth size="small">
                <label className="form-label">Validity Min Value </label>
                <TextField
                  name="Validity_Min_Value"
                  value={investigation_master.Validity_Min_Value}
                  onChange={handlechange}
                  placeholder='Validity Min Value'
                  size="small"
                >

                </TextField>
              </FormControl>

              <FormControl fullWidth size="small">
                <label className="form-label">Validity Max Value </label>
                <TextField
                  name="Validity_Max_Value"
                  value={investigation_master.Validity_Max_Value}
                  onChange={handlechange}
                  placeholder='Validity Max Value'
                  size="small"
                >

                </TextField>
              </FormControl>

              <FormControl fullWidth size="small">
                <label className="form-label">Normal Value Min </label>
                <TextField
                  name="Normal_Value_Minimum"
                  value={investigation_master.Normal_Value_Minimum}
                  onChange={handlechange}
                  placeholder='Normal Value Min'
                  size="small"
                >

                </TextField>
              </FormControl>

              <FormControl fullWidth size="small">
                <label className="form-label">Normal Value Max </label>
                <TextField
                  name="Normal_Value_Maximum"
                  value={investigation_master.Normal_Value_Maximum}
                  onChange={handlechange}
                  placeholder='Normal Value Max'
                  size="small"
                >

                </TextField>
              </FormControl>

              <FormControl fullWidth size="small">
                <label className="form-label">Weightage Value Min </label>
                <TextField
                  name="Weightage_Value_Minimum"
                  value={investigation_master.Weightage_Value_Minimum}
                  onChange={handlechange}
                  placeholder='Weightage Value Min'
                  size="small"
                >

                </TextField>
              </FormControl>

              <FormControl fullWidth size="small">
                <label className="form-label">Weightage Value Max </label>
                <TextField
                  name="Weightage_Value_Maximum"
                  value={investigation_master.Weightage_Value_Maximum}
                  onChange={handlechange}
                  placeholder='Weightage Value Max'
                  size="small"
                >

                </TextField>
              </FormControl>

              <FormControl fullWidth size="small">
                <label className="form-label">Sos Value Min </label>
                <TextField
                  name="SOS_Value_Minimum"
                  value={investigation_master.SOS_Value_Minimum}
                  onChange={handlechange}
                  placeholder='Sos Value Min'
                  size="small"
                >

                </TextField>
              </FormControl>

              <FormControl fullWidth size="small">
                <label className="form-label">Sos Value Max </label>
                <TextField
                  name="SOS_Value_Maximum"
                  value={investigation_master.SOS_Value_Maximum}
                  onChange={handlechange}
                  placeholder='Sos Value Max'
                  size="small"
                >

                </TextField>
              </FormControl>

              <FormControl fullWidth size="small">
                <label className="form-label">Abnormalities  </label>
                <TextField
                  value={input_value_abnormalities}
                  onChange={handle_change_input_value_abnormalities}
                  placeholder='press enter after set value'
                  onKeyDown={handleKeyDown}
                  fullWidth
                  size="small"

                />
                <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1, maxWidth: "300px" }}>
                  {investigation_master.Abnormalities.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleDelete(tag)}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>

              </FormControl>




            </div>

            <FormButton
              onClick={add_investigation_master}
            >
              Submit
            </FormButton>
          </Paper>


          {/* Table */}
          <div className="mt-6">

            <DataGrid

              rows={rows}
              columns={columns}
              pageSize={10}
              pageSizeOptions={[]} // removes the rows per page selector
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              disableSelectionOnClick
              disableColumnMenu

            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default InvestigationMaster;
