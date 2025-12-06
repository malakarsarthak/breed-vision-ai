import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    Menu,
    MenuItem,
    IconButton,
} from '@mui/material';

import { Home, AccountCircle, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();

        Swal.fire({
            title: "Logout?",
            text: "Are you sure you want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Logout"
        }).then((result) => {
            if (result.isConfirmed) {

                if (onLogout) onLogout();   // Clear user + localStorage

                Swal.fire(
                    "Logged out!",
                    "You have been logged out successfully.",
                    "success"
                );

                navigate("/");  // Redirect to login page
            }
        });
    };

    return (
        <AppBar
            position="sticky"
            sx={{
                backgroundColor: '#2E7D32',
                minHeight: { xs: 56, sm: 60, md: 70 },
                justifyContent: "center",
                px: { xs: 1.5, sm: 2, md: 4 },
            }}
        >
            <Toolbar
                disableGutters
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: { xs: 0.5, sm: 0 },
                    py: { xs: 0.5, sm: 0 },
                }}
            >
                {/* Title - full width on mobile */}
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        fontWeight: 600,
                        fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                        whiteSpace: { xs: "normal", sm: "nowrap" },
                    }}
                >
                    🐄 Bharat Pashudhan - Breed Recognition
                </Typography>

                {/* Right side actions */}
                <Box
                    sx={{
                        mt: { xs: 0.5, sm: 0 },
                        width: { xs: "100%", sm: "auto" },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: { xs: "space-between", sm: "flex-end" },
                        gap: { xs: 1, sm: 2 },
                    }}
                >
                    {/* Desktop / tablet: full Dashboard button */}
                    <Button
                        color="inherit"
                        startIcon={<Home />}
                        onClick={() => navigate('/dashboard')}
                        sx={{
                            display: { xs: "none", sm: "inline-flex" },
                            px: { sm: 2 },
                            fontSize: { sm: "0.85rem" },
                        }}
                    >
                        Dashboard
                    </Button>

                    {/* Mobile: only Home icon */}
                    <Button
                        color="inherit"
                        onClick={() => navigate('/dashboard')}
                        startIcon={<Home />}
                        sx={{
                            display: { xs: "inline-flex", sm: "none" },
                            fontSize: "0.8rem",
                            textTransform: "none",
                            px: 1,
                        }}
                    >
                        Dashboard
                    </Button>


                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        {/* Name / role: hide on very small screens, show from sm+ */}
                        <Typography
                            variant="body2"
                            sx={{
                                mr: 1,
                                display: { xs: "none", md: "block" },
                            }}
                        >
                            {user?.name} ({user?.role})
                        </Typography>

                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                                <AccountCircle />
                            </Avatar>
                        </IconButton>

                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={() => { handleClose(); navigate("/profile") }}>
                                <span className="material-icons" style={{ marginRight: 8 }}>person</span>
                                Profile
                            </MenuItem>

                            <MenuItem onClick={handleLogout}>
                                <ExitToApp sx={{ mr: 1 }} />
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
