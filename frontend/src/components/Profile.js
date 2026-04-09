import React from 'react';
import { Card, CardContent, Typography, Box, Divider, Grid, Paper, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Person, VpnKey, Shield, LocationOn, Wc } from '@mui/icons-material';

const EMBLEM_SRC = `${process.env.PUBLIC_URL}/assests/gov-emblem.svg`;

const rowSx = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 1.5,
    py: 1.75,
    borderBottom: '1px solid #f1f5f9',
    '&:last-of-type': { borderBottom: 'none' },
};

export default function Profile({ user }) {
    const { t } = useTranslation();

    return (
        <Box className="gov-page" sx={{ py: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={0}
                        sx={{
                            height: '100%',
                            minHeight: { md: 320 },
                            borderRadius: 3,
                            overflow: 'hidden',
                            border: '1px solid #e2e8f0',
                            background: 'linear-gradient(160deg, #1e3a8a 0%, #1a237e 45%, #312e81 100%)',
                            color: '#fff',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 3,
                            textAlign: 'center',
                            position: 'relative',
                            boxShadow: '0 20px 50px rgba(26, 35, 126, 0.25)',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                opacity: 0.25,
                                background: `repeating-linear-gradient(
                                    -40deg,
                                    transparent,
                                    transparent 10px,
                                    rgba(255,255,255,0.05) 10px,
                                    rgba(255,255,255,0.05) 20px
                                )`,
                            }}
                        />
                        <Box
                            sx={{
                                position: 'relative',
                                width: 88,
                                height: 88,
                                borderRadius: '24px',
                                bgcolor: 'rgba(255,255,255,0.12)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2,
                                boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
                            }}
                        >
                            <Box component="img" src={EMBLEM_SRC} alt="" sx={{ width: 56, height: 56 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 800, position: 'relative' }}>
                            {t('user_profile')}
                        </Typography>
                        <Chip
                            label={user?.role || '—'}
                            size="small"
                            sx={{
                                mt: 1.5,
                                position: 'relative',
                                bgcolor: 'rgba(255,255,255,0.15)',
                                color: '#fff',
                                fontWeight: 700,
                                border: '1px solid rgba(255,255,255,0.25)',
                            }}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Card
                        elevation={0}
                        sx={{
                            height: '100%',
                            border: '1px solid #e2e8f0',
                            borderRadius: 3,
                            boxShadow: '0 8px 32px rgba(15, 23, 42, 0.06)',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                px: 2.5,
                                py: 1.5,
                                bgcolor: '#f8fafc',
                                borderBottom: '1px solid #e2e8f0',
                                fontWeight: 800,
                                fontSize: '0.8rem',
                                color: '#64748b',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                            }}
                        >
                            Account details
                        </Box>
                        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                            <Box sx={rowSx}>
                                <VpnKey sx={{ color: '#1a237e', mt: 0.25 }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                        {t('user_id')}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>{user?.userId}</Typography>
                                </Box>
                            </Box>
                            <Box sx={rowSx}>
                                <Person sx={{ color: '#1a237e', mt: 0.25 }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                        {t('name')}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>{user?.name}</Typography>
                                </Box>
                            </Box>
                            <Box sx={rowSx}>
                                <Shield sx={{ color: '#1a237e', mt: 0.25 }} />
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                        {t('role')}
                                    </Typography>
                                    <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>{user?.role}</Typography>
                                </Box>
                            </Box>
                            {user?.district && (
                                <Box sx={rowSx}>
                                    <LocationOn sx={{ color: '#1a237e', mt: 0.25 }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                            {t('district')}
                                        </Typography>
                                        <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>{user.district}</Typography>
                                    </Box>
                                </Box>
                            )}
                            {user?.gender && (
                                <Box sx={rowSx}>
                                    <Wc sx={{ color: '#1a237e', mt: 0.25 }} />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                            {t('gender')}
                                        </Typography>
                                        <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.05rem' }}>{user.gender}</Typography>
                                    </Box>
                                </Box>
                            )}
                            <Divider sx={{ mt: 2 }} />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
