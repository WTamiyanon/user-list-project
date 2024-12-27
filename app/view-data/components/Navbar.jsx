import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Box, Avatar, Menu, MenuItem, IconButton, Divider } from "@mui/material";
import { ArrowDropDown } from "@mui/icons-material";

const Navbar = ({ userEmail, userName, userImage, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "white", color: "#4CAF50", boxShadow: "0px 2px 3px 0px rgba(84, 87, 118, 0.15)", padding: "20px 0", borderBottom: "1px solid #e0e0e0" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          User List
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar alt={userName} src={userImage} sx={{ width: 40, height: 40 }} />
          <Typography variant="body1" sx={{ fontWeight: "medium" }}>
            {userName}
          </Typography>
          <IconButton onClick={handleMenuOpen}>
            <ArrowDropDown sx={{ color: "#4CAF50" }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 2,
              sx: {
                mt: 1,
                minWidth: 200,
                borderRadius: 2,
              },
            }}
          >
            <MenuItem disabled>
              <Typography variant="body2" style={{fontWeight:"bold"}}>{userName}</Typography>
            </MenuItem>
            <MenuItem disabled>
              <Typography variant="body2">{userEmail}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={onLogout}>
              <Typography variant="body2" sx={{ color: "#4CAF50", fontWeight: "bold" }}>
                Log Out
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
