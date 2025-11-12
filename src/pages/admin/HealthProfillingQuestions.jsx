import React, { useState, useEffect } from "react";
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
  Chip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import { __postApiData } from "@utils/api";
import FormButton from "../../components/common/FormButton";

const HealthProfillingQuestions = () => {
  const [loading, setloading] = useState(false);

  const [investigation_master, setinvestigation_master] = useState({
    Investigation_CategoryId: null,
    Health_Profiling_GroupId: null,
    InvestigationName: "",
    Question_Order: "",
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
  // console.log(investigation_master, "investigation_master")

  const [input_value_abnormalities, setinput_value_abnormalities] = useState("");

  const handle_change_input_value_abnormalities = (e) => {
    setinput_value_abnormalities(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input_value_abnormalities.trim() !== "") {
      e.preventDefault();
      if (
        !investigation_master.Abnormalities.includes(
          input_value_abnormalities.trim()
        )
      ) {
        setinvestigation_master((prev) => ({
          ...prev,
          Abnormalities: [
            ...prev.Abnormalities,
            input_value_abnormalities.trim(),
          ],
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

  const [all_investigation_master, setall_investigation_master] = useState([]);
  const getall_investigation_master = async () => {
    try {
      const resp = await __postApiData(`/api/v1/admin/investigationList`);
      setall_investigation_master(resp.data.list);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getall_investigation_master();
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

  const [lookup_id, setlookup_id] = useState(null);
  const onEdit = (row) => {
    setlookup_id(row._id);
    setinvestigation_master({
      Investigation_CategoryId: row.Investigation_CategoryId?._id,
      Health_Profiling_GroupId: row.Health_Profiling_GroupId?._id,
      InvestigationName: row.InvestigationName,
      Question_Order: row.Question_Order,
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
    });
  };

  const onDeletehospital = () => {
    alert("delete");
  };

  const columns = [
    {
      field: "sno",
      headerName: "S.No.",
      flex: 0.2,
      renderCell: (params) =>
        params.api.getAllRowIds().indexOf(params.id) + 1,
    },

    {
      field: "parent_lookup_id",
      headerName: "Investigation Category",
      flex: 0.5,
      renderCell: (params) => {
        return (
          params.row?.Investigation_CategoryId?.lookup_value || ""
        );
      },
    },

    {
      field: "InvestigationName",
      headerName: "Investigation Name",
      flex: 0.5,
      renderCell: (params) => {
        return params.row?.InvestigationName || "";
      },
    },

    {
      field: "actions",
      headerName: "Actions",
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
    },
  ];

  const rows = all_investigation_master?.map((doc, index) => ({
    id: doc._id || index,
    ...doc,
  }));

  const [investigation_category, setinvestigation_category] = useState([]);

  const get_investigation_category = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/LookupList", {
        lookupcodes: "procedure_group_name_type",
      });
      setinvestigation_category(resp.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    get_investigation_category();
  }, []);

  const handlechange = (e) => {
    const { name, value, checked, type } = e.target;

    setinvestigation_master((prev) => {
      if (type === "checkbox") {
        return { ...prev, [name]: checked };
      }
      return { ...prev, [name]: value };
    });
  };

  const add_investigation_master = async () => {
    try {
      const body = {
        ...investigation_master,
        _id: lookup_id,
      };

      setloading(true);
      const resp = await __postApiData(
        "/api/v1/admin/SaveInvestigation",
        body
      );

      if (resp.data.response.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Health Profiling Question Saved!",
        }).then(() => window.location.reload());
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: resp.data.response.response_message,
        });
      }
    } catch (error) {
      console.error("API ERROR :", error);
    } finally {
      setloading(false);
    }
  };
  const inputFieldsArr = [
    {
      value: "Validity_Min_Value",
      label: "Validity Min Value"
    },
    {
      value: "Validity_Max_Value",
      label: "Validity Max Value"
    },
    {
      value: "Normal_Value_Minimum",
      label: "Normal Value Minimum",
    },
    {
      value: "Normal_Value_Maximum",
      label: "Normal Value Maximum",
    },
    {
      value: "Weightage_Value_Minimum",
      label: "Weightage Value Minimum",
    },
    {
      value: "Weightage_Value_Maximum",
      label: "Weightage Value Maximum",
    },
    {
      value: "SOS_Value_Minimum",
      label: "SOS Value Minimum",
    },
    {
      value: "SOS_Value_Maximum",
      label: "SOS Value Maximum",
    },
  ];



  return (
    <div className="container mt-8">
      <div className="content-wrapper">
        <div className="main-content">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold mb-2">
              Health Profiling Questions
            </h3>
            <p className="text-para">Add or update the required details for the health profilling questions to keep records accurate and complete.</p>
          </div>

          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-6">

              {/* 1) Health Profiling Category */}
              <FormControl fullWidth size="small">
                <label className="form-label">
                  Health Profiling Question Category
                </label>
                <Select
                  name="Investigation_CategoryId"
                  value={investigation_master.Investigation_CategoryId}
                  onChange={handlechange}
                  displayEmpty
                >
                  <MenuItem disabled value="">
                    <em>Select Category</em>
                  </MenuItem>
                  {investigation_category?.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.lookup_value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 2) Health Profiling Group ID */}
              <FormControl fullWidth size="small">
                <label className="form-label">
                  Health Profiling Group ID
                </label>
                <Select
                  name="Health_Profiling_GroupId"
                  value={investigation_master.Health_Profiling_GroupId}
                  onChange={handlechange}
                  displayEmpty

                >
                  <MenuItem disabled value="">
                    <em>Select Group</em>
                  </MenuItem>
                  {investigation_category?.map((item) => (
                    <MenuItem key={item._id} value={item._id}>
                      {item.lookup_value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Question */}
              {/* <FormControl fullWidth size="small">
                <label className="form-label">Question Name</label>
                <TextField
                  name="InvestigationName"
                  value={investigation_master.InvestigationName}
                  onChange={handlechange}
                  placeholder="Question"
                />
              </FormControl> */}

              {/* Question Order */}
              <FormControl fullWidth size="small">
                <label className="form-label">Question Order</label>
                <TextField
                  type="number"
                  name="Question_Order"
                  value={investigation_master.Question_Order}
                  onChange={handlechange}
                  placeholder="Enter Order"
                  size="small"
                />
              </FormControl>

              {/* Response Unit */}
              <FormControl fullWidth size="small">
                <label className="form-label">Response Unit</label>
                <TextField
                  name="ResponseUnit"
                  value={investigation_master.ResponseUnit}
                  onChange={handlechange}
                  placeholder="Response Unit"
                  size="small"
                />
              </FormControl>

              {/* More Numeric Fields */}
              {inputFieldsArr.map((field, index) => (
                <FormControl fullWidth size="small" key={index}>
                  <label className="form-label">{field.label}</label>
                  <TextField
                    name={field.value}
                    value={investigation_master[field.value]}
                    onChange={handlechange}
                    placeholder={field.label}
                    size="small"
                  />
                </FormControl>
              ))}

              {/* Abnormalities */}
              <FormControl fullWidth size="small">
                <label className="form-label">Abnormalities</label>
                <TextField
                  value={input_value_abnormalities}
                  onChange={handle_change_input_value_abnormalities}
                  placeholder="Press Enter to add"
                  onKeyDown={handleKeyDown}
                  size="small"
                />
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    maxWidth: "300px",
                  }}
                >
                  {investigation_master.Abnormalities.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleDelete(tag)}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </FormControl>
            </div>

            <FormButton onClick={add_investigation_master}>
              Submit
            </FormButton>
          </Paper>

          <div className="mt-6">
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableColumnMenu
              disableSelectionOnClick
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthProfillingQuestions;
