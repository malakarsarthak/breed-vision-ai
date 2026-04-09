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
    Chip,
} from '@mui/material';

import { Home, AccountCircle, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { useTranslation } from 'react-i18next';

const EMBLEM_SRC = `${process.env.PUBLIC_URL}/assests/gov-emblem.svg`;

const Header = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const homePath = user?.role === 'admin' ? '/admin' : '/dashboard';

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();

        Swal.fire({
            title: t('logout_title'),
            text: t('logout_warning'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#1a237e',
            cancelButtonColor: '#c62828',
            confirmButtonText: t('logout_confirm'),
        }).then((result) => {
            if (result.isConfirmed) {
                if (onLogout) onLogout();

                Swal.fire(t('logout_success'), t('logout_success_msg'), 'success');

                navigate('/');
            }
        });
    };

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: '#ffffff',
                color: '#0f172a',
                borderBottom: '1px solid #e2e8f0',
                boxShadow: '0 4px 24px rgba(15, 23, 42, 0.06)',
            }}
        >
            <Box className="gov-tricolor-bar" aria-hidden />
            <Toolbar
                disableGutters
                sx={{
                    width: '100%',
                    minHeight: { xs: 58, sm: 68 },
                    px: { xs: 1.5, sm: 2.5, md: 3 },
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5,
                    bgcolor: '#fafbfc',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 1.25, sm: 2 },
                        minWidth: 0,
                        flex: '1 1 auto',
                    }}
                >
                    <Box
                        sx={{
                            width: { xs: 44, sm: 52 },
                            height: { xs: 44, sm: 52 },
                            borderRadius: '12px',
                            bgcolor: '#fff',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 2px 8px rgba(26, 35, 126, 0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <Box
                            component="img"
                            src={EMBLEM_SRC}
                            alt=""
                            sx={{
                                width: { xs: 32, sm: 38 },
                                height: { xs: 32, sm: 38 },
                            }}
                        />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{
                                fontWeight: 800,
                                fontSize: { xs: '0.95rem', sm: '1.05rem', md: '1.12rem' },
                                lineHeight: 1.3,
                                letterSpacing: '-0.02em',
                                color: '#0f172a',
                            }}
                        >
                            {t('app_title')}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                display: { xs: 'none', sm: 'block' },
                                fontSize: '0.72rem',
                                fontWeight: 500,
                                color: '#64748b',
                                letterSpacing: '0.02em',
                                mt: 0.25,
                            }}
                        >
                            {t('dashboard_title')}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: { xs: 1, sm: 1.5 },
                        flexShrink: 0,
                        flexWrap: 'wrap',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Home sx={{ fontSize: 20 }} />}
                        onClick={() => navigate(homePath)}
                        sx={{
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            fontWeight: 600,
                            px: { xs: 1.25, sm: 2 },
                            py: 0.75,
                            borderWidth: 2,
                            borderColor: '#1a237e',
                            color: '#1a237e',
                            bgcolor: '#fff',
                            '&:hover': {
                                borderWidth: 2,
                                bgcolor: 'rgba(26, 35, 126, 0.06)',
                                borderColor: '#0d1642',
                            },
                        }}
                    >
                        {t('dashboard')}
                    </Button>

                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            maxWidth: 200,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                fontWeight: 700,
                                color: '#0f172a',
                                lineHeight: 1.2,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                width: '100%',
                                textAlign: 'right',
                            }}
                        >
                            {user?.name}
                        </Typography>
                        <Chip
                            label={user?.role}
                            size="small"
                            sx={{
                                height: 22,
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                bgcolor: '#e8eaf6',
                                color: '#1a237e',
                                border: '1px solid #c5cae9',
                                mt: 0.5,
                            }}
                        />
                    </Box>

                    <IconButton
                        size="large"
                        aria-label="user account"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        sx={{
                            border: '2px solid #e2e8f0',
                            bgcolor: '#fff',
                            color: '#1a237e',
                            '&:hover': { bgcolor: '#f1f5f9' },
                        }}
                    >
                        <Avatar
                            sx={{
                                width: 34,
                                height: 34,
                                bgcolor: '#1a237e',
                                color: '#fff',
                            }}
                        >
                            <AccountCircle sx={{ fontSize: 28 }} />
                        </Avatar>
                    </IconButton>

                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        PaperProps={{
                            elevation: 8,
                            sx: {
                                minWidth: 216,
                                border: '1px solid #e2e8f0',
                                mt: 1,
                                borderRadius: 2,
                                boxShadow: '0 12px 40px rgba(15, 23, 42, 0.12)',
                            },
                        }}
                    >
                        <MenuItem
                            onClick={() => {
                                handleClose();
                                navigate('/profile');
                            }}
                            sx={{ py: 1.25, color: '#0f172a' }}
                        >
                            <span className="material-icons" style={{ marginRight: 10, color: '#1a237e' }}>
                                person
                            </span>
                            {t('profile')}
                        </MenuItem>

                        <MenuItem onClick={handleLogout} sx={{ py: 1.25, color: '#0f172a' }}>
                            <ExitToApp sx={{ mr: 1.25, color: '#c62828' }} />
                            {t('logout')}
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
