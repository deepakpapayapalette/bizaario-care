import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Button, TextField, FormControl, Paper, Select, MenuItem,
  IconButton, Menu,
  Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import AddIcon from "@mui/icons-material/Add";
import { __postApiData } from '@utils/api';
import FormButton from '../../components/common/FormButton';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { __getCommenApiDataList } from "@utils/api/commonApi";
const EventMaster = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [eventList, setEventList] = useState([]);
  const [currentSchedule, setCurrentSchedule] = useState({
    Date: "",
    StartTime: "",
    EndTime: "",
    NoOfSlots: "",
  });

  const [state, setState] = useState({
    event_id: null, // for edit
    AssetId: null,
    StationId: null,
    EventTypeId: null,
    EventTitle: "",
    EventVenue: "",
    EventSchedule: [],
    RegistrationCurrency: null,
    RegistrationFee: "",
    EventPoster: [],
    EventAdvertisement: [],
    // Dropdown data
    AssetList: [],
    StationList: [],
    EventTypeList: [],
    CurrencyList: [],
    // Loading states
    eventPosterLoading: false,
    eventAdvertisementLoading: false,
  });

  const {
    event_id,
    AssetId,
    StationId,
    EventTypeId,
    EventTitle,
    EventVenue,
    EventSchedule,
    RegistrationCurrency,
    RegistrationFee,
    EventPoster,
    EventAdvertisement,
    AssetList,
    StationList,
    EventTypeList,
    CurrencyList,
    eventPosterLoading,
    eventAdvertisementLoading,
  } = state;

  const updateState = (data) =>
    setState((prevState) => ({ ...prevState, ...data }));

  // Fetch event list
  const getEventList = async () => {
    try {
      setIsLoading(true);
      const resp = await __postApiData("/api/v1/admin/EventList", {});
      if (resp.response.response_code === "200") {
        setEventList(resp.data.list || []);
      }
    } catch (error) {
      console.error("Error fetching event list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Asset List
  const getAssetList = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/AssetList", {});
      if (resp.response.response_code === "200") {
        updateState({ AssetList: resp.data.list || [] });
      }
    } catch (error) {
      console.error("Error fetching AssetList:", error);
    }
  };

  // Fetch Station List
  const getStationList = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/StationList", {});
      if (resp.response.response_code === "200") {
        updateState({ StationList: resp.data.list || [] });
      }
    } catch (error) {
      console.error("Error fetching StationList:", error);
    }
  };

  // Fetch dropdown data using common API
  const fetchDropdownData = async (lookupTypes, stateKey, parent_lookup_id) => {
    try {
      const data = await __getCommenApiDataList({
        lookup_type: lookupTypes,
        parent_lookup_id: parent_lookup_id || null,
      });
      updateState({ [stateKey]: data });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getEventList();
    getAssetList();
    getStationList();
    // Fetch lookup data for dropdowns
    fetchDropdownData(["event_type"], "EventTypeList");
    fetchDropdownData(["currency_type"], "CurrencyList");
  }, []);

  // DataGrid columns
  const columns = [
    {
      field: "sno",
      headerName: "S.No.",
      flex: 0.6,
      // width: 150,
      headerClassName: "blue-header",
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    { field: "EventTitle", headerName: "Event Title", flex: 2 },
    { field: "EventVenue", headerName: "Venue", flex: 1 },
    { field: "RegistrationFee", headerName: "Fee", flex: 0.8 },
    {
      field: "AssetId",
      headerName: "Asset",
      flex: 2,
      renderCell: (params) => params.row.AssetId?.AssetName || "N/A",
    },
    {
      field: "Event Type",
      headerName: "Event Type",
      flex: 1,
      renderCell: (params) => params.row.EventTypeId?.lookup_value || "N/A",
    },
    {
      field: "Currency",
      headerName: "Currency",
      flex: 1,
      renderCell: (params) =>
        params.row.RegistrationCurrency?.lookup_value || "N/A",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <>
          <IconButton onClick={(e) => handleOpenMenu(e, params.row._id)}>
            <MoreVertIcon />
          </IconButton>
          {menuRowId === params.row._id && (
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleCloseMenu}
              disableScrollLock
            >
              <MenuItem
                onClick={() => {
                  onEdit(params.row);
                  handleCloseMenu();
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDelete(params.row._id);
                  handleCloseMenu();
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

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuRowId, setMenuRowId] = useState(null);

  const handleOpenMenu = (event, rowId) => {
    setMenuAnchor(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleCloseMenu = () => {
    setMenuAnchor(null);
    setMenuRowId(null);
  };

  const onEdit = (row) => {
    updateState({
      event_id: row._id || null,
      AssetId: row.AssetId?._id || "",
      StationId: row.StationId?._id || "",
      EventTypeId: row.EventTypeId?._id || "",
      EventTitle: row.EventTitle || "",
      EventVenue: row.EventVenue || "",
      EventSchedule: row.EventSchedule || [],
      RegistrationCurrency: row.RegistrationCurrency?._id || "",
      RegistrationFee: row.RegistrationFee || "",
      EventPoster: row.EventPoster || [],
      EventAdvertisement: row.EventAdvertisement || [],
    });
  };

  const onDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        setIsLoading(true);
        const resp = await __postApiData("/api/v1/admin/DeleteEvent", { id });
        if (resp.response.response_code === "200") {
          Swal.fire("Deleted!", "Event has been deleted.", "success");
          getEventList();
        }
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      Swal.fire("Error!", "Failed to delete event.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Image upload function
  const __handleUploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await __postApiData(
        "/api/v1/common/AddImage",
        formData,
        "form"
      );
      // console.log("Upload response:", res);

      if (res.response.response_code === "200") {
        // Handle both single object and array responses
        if (Array.isArray(res.data)) {
          return res.data[0].full_URL;
        } else {
          return res.data.full_URL;
        }
      } else {
        throw new Error(res.response.response_message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  // Handle single image upload
  const handleSingleImageUpload = async (event, fieldName) => {
    setState({ ...state, eventPosterLoading: true })
    const file = event.target.files[0];
    if (!file) return;

    try {
      updateState({ [`${fieldName}Loading`]: true });
      const uploadedUrl = await __handleUploadFile(file);
      // console.log(uploadedUrl);

      updateState({
        [fieldName]: [uploadedUrl],
        [`${fieldName}Loading`]: false,
      });


    } catch (error) {
      console.error("Upload error:", error);
      updateState({ [`${fieldName}Loading`]: false });
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.message || "Failed to upload image",
      });
    } finally {
      setState({ ...state, eventPosterLoading: false })
    }
  };
  console.log(updateState);
  // Handle multiple image upload
  const handleMultipleImageUpload = async (event, fieldName) => {
    setState({ ...state, eventAdvertisementLoading: true })
    const files = Array.from(event.target.files);
    const uploadPromises = files.map((file) => __handleUploadFile(file));

    try {
      updateState({ [`${fieldName}Loading`]: true });
      const uploadedUrls = await Promise.all(uploadPromises);
      updateState({
        [fieldName]: [...state[fieldName], ...uploadedUrls],
        [`${fieldName}Loading`]: false,
      });
    } catch (error) {
      console.error("Upload error:", error);
      updateState({ [`${fieldName}Loading`]: false });
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error.message || "Failed to upload images",
        showConfirmButton: true,
        customClass: {
          confirmButton: 'my-swal-button',
        },
      });
    } finally {
      setState({ ...state, eventAdvertisementLoading: false })
    }
  };

  // Remove image from gallery
  const removeImage = (index, fieldName) => {
    updateState({
      [fieldName]: state[fieldName].filter((_, i) => i !== index),
    });
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateState({ [name]: value });
  };

  // Handle schedule input changes
  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setCurrentSchedule((prev) => ({ ...prev, [name]: value }));
  };

  // Add schedule to event
  const addSchedule = () => {
    if (
      currentSchedule.Date &&
      currentSchedule.StartTime &&
      currentSchedule.EndTime &&
      currentSchedule.NoOfSlots
    ) {
      updateState({
        EventSchedule: [
          ...EventSchedule,
          {
            ...currentSchedule,
            NoOfSlots: parseInt(currentSchedule.NoOfSlots),
          },
        ],
      });
      setCurrentSchedule({
        Date: "",
        StartTime: "",
        EndTime: "",
        NoOfSlots: "",
      });
    }
  };

  // Remove schedule
  const removeSchedule = (index) => {
    updateState({
      EventSchedule: EventSchedule.filter((_, i) => i !== index),
    });
  };

  // Save event function
  const __handleSaveEvent = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!EventTitle.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter event title",
      });
      return;
    }

    if (!EventVenue.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please enter event venue",
      });
      return;
    }

    if (EventSchedule.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please add at least one event schedule",
      });
      return;
    }

    const requestData = {
      // _id: event_id ? event_id : null,
      AssetId,
      StationId,
      EventTypeId,
      EventTitle,
      EventVenue,
      EventSchedule,
      RegistrationCurrency,
      RegistrationFee,
      EventPoster,
      EventAdvertisement,
    };

    // Add event_id for edit mode
    if (event_id) {
      requestData._id = event_id;
    }

    try {
      setIsLoading(true);
      //   const endpoint = event_id ? "/api/v1/admin/UpdateEvent" : "/api/v1/admin/SaveEvent";
      const endpoint = "/api/v1/admin/SaveEvent";

      const res = await __postApiData(endpoint, requestData);

      if (res.response.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: event_id
            ? "Event updated successfully!"
            : "Event created successfully!",
          showConfirmButton: true,
          customClass: {
            confirmButton: "my-swal-button",
          },
        }).then(() => {
          getEventList();
          // Reset form state
          updateState({
            event_id: null,
            AssetId: "",
            StationId: "",
            EventTypeId: "",
            EventTitle: "",
            EventVenue: "",
            EventSchedule: [],
            RegistrationCurrency: "",
            RegistrationFee: "",
            EventPoster: [],
            EventAdvertisement: [],
          });
          setCurrentSchedule({
            Date: "",
            StartTime: "",
            EndTime: "",
            NoOfSlots: "",
          });
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res.response.response_message || "Failed to save event. Please try again.",
          customClass: {
            confirmButton: "my-swal-button",
          },
        });

      }
    } catch (error) {
      console.error("Error saving event:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Failed to save event. Please try again.",
        customClass: {
          confirmButton: "my-swal-button",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare rows for DataGrid
  const rows = eventList.map((event, index) => ({
    id: event._id,
    ...event,
  }));
  return (
    <div className='container mt-8'>
      <div className='mb-6'>
        <h2 className="text-2xl font-semibold mb-2">
          Enter Details for Event Master
        </h2>
        <p className="text-para">
          Add or update the required details for the event master to keep records accurate and complete
        </p>
      </div>
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 mb-6">

          {/* Asset Dropdown */}
          <FormControl fullWidth>
            <label className='form-label'>Asset Id</label>
            <Select
              labelId="asset-label"
              name="AssetId"
              value={AssetId || ""}
              onChange={handleChange}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#9ca3af" }}>Asset</span>; // grey placeholder
                }
                return AssetList.find((item) => item._id === selected)?.AssetName;
              }}
            >
              <MenuItem value="">
                <em>Select Asset</em>
              </MenuItem>
              {AssetList.map((asset) => (
                <MenuItem key={asset._id} value={asset._id}>
                  {asset.AssetName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Station Dropdown */}
          <FormControl fullWidth>
            <label className='form-label'>Station Id</label>
            <Select
              labelId="station-label"
              name="StationId"
              value={StationId || ""}
              onChange={handleChange}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#9ca3af" }}>Station</span>; // grey placeholder
                }
                return StationList.find((item) => item._id === selected)?.StationName;
              }}
            >
              <MenuItem value="">
                <em>Select Station</em>
              </MenuItem>
              {StationList.map((station) => (
                <MenuItem key={station._id} value={station._id}>
                  {station.StationName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Event Type Dropdown */}
          <FormControl fullWidth>
            <label className='form-label'>Event Type Id</label>
            <Select
              labelId="event-type-label"
              name="EventTypeId"
              value={EventTypeId || ""}
              onChange={handleChange}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#9ca3af" }}>Event Type</span>; // grey placeholder
                }
                return EventTypeList.find((item) => item._id === selected)?.name;
              }}
            >
              <MenuItem value="">
                <em>Select Event Type</em>
              </MenuItem>
              {EventTypeList.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Event Title */}
          <FormControl fullWidth>
            <label className='form-label'>Event Title</label>
            <TextField
              name="EventTitle"
              placeholder="Event Title"
              value={EventTitle}
              onChange={handleChange}
              fullWidth
              required
            />
          </FormControl>

          {/* Event Venue */}
          <FormControl fullWidth>
            <label className='form-label'>Event Venue</label>
            <TextField
              placeholder="Event Venue"
              name="EventVenue"
              value={EventVenue}
              onChange={handleChange}
              fullWidth
              required
            />
          </FormControl>

          {/* Registration Currency */}
          <FormControl fullWidth>
            <label className='form-label'>
              Registration Currency
            </label>
            <Select
              labelId="currency-label"
              name="RegistrationCurrency"
              value={RegistrationCurrency || ""}
              onChange={handleChange}
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <span style={{ color: "#9ca3af" }}>Event Type</span>; // grey placeholder
                }
                return CurrencyList.find((item) => item._id === selected)?.name;
              }}
            >
              <MenuItem value="">
                <em>Select Currency</em>
              </MenuItem>
              {CurrencyList.map((currency) => (
                <MenuItem key={currency.id} value={currency.id}>
                  {currency.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Registration Fee */}
          <FormControl fullWidth>
            <label className='form-label'>Registration Fee</label>
            <TextField
              placeholder="Registration Fee"
              name="RegistrationFee"
              value={RegistrationFee}
              onChange={handleChange}
              fullWidth
              type="number"
            />
          </FormControl>


          {/* Event Poster Upload */}
          <div className="space-y-2">
            <label className="form-label">
              Event Poster
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleSingleImageUpload(e, "EventPoster")
                }
                style={{ display: "none" }}
                id="event-poster-upload"
                disabled={eventPosterLoading}
              />
              <label htmlFor="event-poster-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={
                    eventPosterLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <CloudUploadIcon />
                    )
                  }
                  disabled={eventPosterLoading}
                  className="cursor-pointer"
                >
                  {eventPosterLoading
                    ? "Uploading..."
                    : "Upload Poster"}
                </Button>
              </label>
            </div>
            {EventPoster.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {EventPoster.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Event Poster ${index + 1}`}
                      className="object-cover w-full h-32 border rounded"
                    />
                    <IconButton
                      onClick={() => removeImage(index, "EventPoster")}
                      className="absolute text-white bg-red-500 top-1 right-1"
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Event Advertisement Upload */}
          <div className="space-y-2">
            <label className="form-label">
              Event Advertisement
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) =>
                  handleMultipleImageUpload(e, "EventAdvertisement")
                }
                style={{ display: "none" }}
                id="event-advertisement-upload"
                disabled={eventAdvertisementLoading}
              />
              <label htmlFor="event-advertisement-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={
                    eventAdvertisementLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <CloudUploadIcon />
                    )
                  }
                  disabled={eventAdvertisementLoading}
                  className="cursor-pointer"
                >
                  {eventAdvertisementLoading
                    ? "Uploading..."
                    : "Upload Advertisements"}
                </Button>
              </label>
            </div>
            {EventAdvertisement.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {EventAdvertisement.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Event Advertisement ${index + 1}`}
                      className="object-cover w-full h-32 border rounded"
                    />
                    <IconButton
                      onClick={() =>
                        removeImage(index, "EventAdvertisement")
                      }
                      className="absolute text-white bg-red-500 top-1 right-1"
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Event Schedule Section */}

        </div>
        <div className="space-y-4 border p-4 rounded-md mb-4">
          <div className="text-xl">
            Event Schedule
          </div>

          <div className="grid grid-cols-4 gap-4">
            <FormControl fullWidth>
              <label className='form-label'>Date</label>
              <TextField
                placeholder="Date"
                name="Date"
                type="date"
                value={currentSchedule.Date}
                onChange={handleScheduleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>

            <FormControl fullWidth>
              <label className='form-label'>Start Time</label>
              <TextField
                placeholder="Start Time"
                name="StartTime"
                type="time"
                value={currentSchedule.StartTime}
                onChange={handleScheduleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>

            <FormControl fullWidth>
              <label className='form-label'>End Time</label>
              <TextField
                placeholder="End Time"
                name="EndTime"
                type="time"
                value={currentSchedule.EndTime}
                onChange={handleScheduleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>

            <FormControl fullWidth>
              <label className='form-label'>Number of Slots</label>
              <TextField
                placeholder="Number of Slots"
                name="NoOfSlots"
                type="number"
                value={currentSchedule.NoOfSlots}
                onChange={handleScheduleChange}
                fullWidth
              />
            </FormControl>
          </div>

          <FormButton
            onClick={addSchedule}
            variant="outlined"
            startIcon={<AddIcon />}
          // className="w-full"
          >
            Add Schedule
          </FormButton>

          {/* Display added schedules */}
          {EventSchedule.length > 0 && (
            <div className="space-y-2">
              <Typography
                variant="subtitle2"
                className="text-gray-600"
              >
                Added Schedules:
              </Typography>
              {EventSchedule.map((schedule, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded bg-gray-100"
                >
                  <span className="text-sm">
                    {schedule.Date} | {schedule.StartTime} -{" "}
                    {schedule.EndTime} | Slots: {schedule.NoOfSlots}
                  </span>
                  <IconButton
                    onClick={() => removeSchedule(index)}
                    size="small"
                    color="error"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              ))}
            </div>
          )}
        </div>

        <FormButton variant="contained" onClick={__handleSaveEvent}>
          Submit
        </FormButton>
      </Paper>

      <div className='mt-6'>
        <DataGrid
          className="custom-data-grid"
          rows={rows}
          columns={columns}
          pageSize={10}
          disableRowSelectionOnClick
          autoHeight
          loading={isLoading}
        />

      </div>
    </div>
  )
}

export default EventMaster

