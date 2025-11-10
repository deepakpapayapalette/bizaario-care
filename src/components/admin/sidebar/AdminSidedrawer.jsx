import React, { useState, useCallback, useMemo } from "react";
import {
  Box,
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  Button,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAdminSidebarLinks from "../../../hooks/admin/useAdminSidebarLinks";

const AdminSidedrawer = ({ show, toggleShow }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const links = useAdminSidebarLinks(user.role);

  const handleClick = useCallback(
    (id) => {
      setOpenMenu((prev) => (prev === id ? null : id));
    },
    []
  );

  const handleLogout = useCallback(() => {
    toast.success("Logout successfully");
    navigate("/");
  }, [navigate]);

  const renderSubMenu = (item) => {
    if (!item?.subList) return null;

    return (
      <Collapse in={openMenu === item.id} timeout="auto" unmountOnExit>
        <List
          component="div"
          className="bg-sidebar-foreground text-white max-h-64 overflow-y-auto hide-scrollbar py-3"
        >
          {item.subList.map((child) => {
            const isActive = pathname === child.path;
            return (
              <ListItem key={child.id} disablePadding className="px-8">
                <Link
                  to={child.path}
                  onClick={() => toggleShow(false)}
                  className={`w-full flex items-center transition-all duration-300 ease-in rounded
                      hover:bg-sidebar-primary hover:text-white
                      ${isActive ? "bg-sidebar-primary text-white" : "text-primary"}`}
                >
                  <ListItemButton>
                    <span className="me-2">{child.icon}</span>
                    <ListItemText primary={child.title} />
                  </ListItemButton>
                </Link>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    );
  };

  const drawerList = useMemo(
    () => (
      <Box
        className="bg-sidebar pt-8 text-white h-full overflow-auto"
        sx={{ width: 250 }}
        role="presentation"
      >
        <List>
          {links.map((item) => {
            const isActive = pathname === item.link;
            const hasSubmenu = Boolean(item?.subList);

            return (
              <React.Fragment key={item?.id}>
                <ListItem disablePadding>
                  <Link
                    to={item.link}
                    onClick={() => {
                      hasSubmenu ? handleClick(item.id) : toggleShow(false);
                    }}
                    className={`w-full flex items-center transition-all duration-300 ease-in rounded
                      hover:bg-sidebar-primary hover:text-white
                      ${isActive ? "bg-sidebar-primary text-white" : "text-primary"}`}
                  >
                    <ListItemButton>
                      <span className="me-2">{item?.icon}</span>
                      <ListItemText primary={item?.label} />
                      {hasSubmenu &&
                        (openMenu === item.id ? <ExpandLess /> : <ExpandMore />)}
                    </ListItemButton>
                  </Link>
                </ListItem>

                {renderSubMenu(item)}
              </React.Fragment>
            );
          })}
        </List>

        <Divider />

        <div className="p-4 mt-4 text-center">
          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "var(--webprimary)",
              color: "white",
              border: "1px solid #CCE4F0 !important",
              "&:hover": {
                backgroundColor: "white",
                color: "#0077B5",
                border: "1px solid #CCE4F0 !important",
              },
            }}
            onClick={handleLogout}
            className="transition-all duration-300 ease-in"
          >
            Logout
          </Button>
        </div>
      </Box>
    ),
    [links, pathname, openMenu, handleClick, handleLogout, toggleShow]
  );

  return (
    <Drawer open={show} onClose={() => toggleShow(false)}>
      {drawerList}
    </Drawer>
  );
};

export default AdminSidedrawer;
