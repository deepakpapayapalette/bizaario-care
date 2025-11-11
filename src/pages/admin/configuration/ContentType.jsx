import React, { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  FormControl,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { __postApiData } from '@utils/api';
import Swal from 'sweetalert2';
import { DataGrid } from '@mui/x-data-grid';
import FormButton from '../../../components/common/FormButton';


const ContentType = () => {
  const [allcontentType, setAllcontentType] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getAllContentType = async () => {
    try {
      setIsLoading(true);
      const resp = await __postApiData("/api/v1/admin/LookupList", {
        lookupcodes: "content_type"
      });
      setAllcontentType(resp.data);
    } catch (error) {
      console.log(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllContentType();
  }, []);

  /** -----------------------------------------
   *  Menu Handlers
   ------------------------------------------*/
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

  const onEdit = (id) => {
    alert("Edit → " + id);
  };

  const onDelete = (id) => {
    alert("Delete → " + id);
  };

  /** -----------------------------------------
   *   Datagrid Columns
   ------------------------------------------*/
  const columns = [
    {
      field: "sno",
      headerName: "S.No.",
      flex: 0.2,
      renderCell: (params) =>
        params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: "lookup_value",
      headerName: "Content Type",
      flex: 1,
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
                  onEdit(params.row._id);
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

  const rows = allcontentType?.map((item, index) => ({
    id: item._id || index,
    ...item
  }));

  /** -----------------------------------------
   *   Add Content Type
   ------------------------------------------*/
  const [contentType, setContentType] = useState("");

  const addContentType = async () => {
    try {
      const resp = await __postApiData("/api/v1/admin/SaveLookup", {
        lookup_type: "content_type",
        parent_lookup_id: null,
        lookup_value: contentType
      });

      if (resp.response.response_code === "200") {
        Swal.fire({
          icon: "success",
          title: "Content Type Created",
          text: "Content Type Added Successfully...",
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        }).then(() => {
          getAllContentType();
          setContentType("");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: resp.response.response_message,
          showConfirmButton: true,
          customClass: { confirmButton: "my-swal-button" },
        });
      }
    } catch (error) {
      console.error("❌ API Error:", error);
    }
  };

  return (
    <div className='container mt-8'>
      <div className="content-wrapper">
        <div className="main-content">

          {/* Title Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              Enter Details for Content Type
            </h2>
            <p className="text-para">
              Add or update the required details for the content type to keep records accurate and complete.
            </p>
          </div>

          {/* Form */}
          <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>

            <div className="mb-4">
              <FormControl fullWidth size="small">
                <label className="form-label text-[14px]">Content Type</label>
                <TextField
                  name="contentType"
                  placeholder="Content Type"
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  fullWidth
                  size="small"
                />
              </FormControl>
            </div>

            <FormButton
              variant="contained"

              onClick={addContentType}

            >
              Submit
            </FormButton>

          </Paper>

          {/* Table */}
          <div className="mt-6">
            <DataGrid
              loading={isLoading}
              rows={rows}
              columns={columns}
              pageSize={10}
              pageSizeOptions={[]}
              initialState={{
                pagination: { paginationModel: { pageSize: 10, page: 0 } },
              }}
              disableSelectionOnClick
             
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentType;
