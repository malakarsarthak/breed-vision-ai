// import React, { useState, useEffect } from "react";
// import {
//     Card,
//     CardContent,
//     Typography,
//     Grid,
//     Box,
//     Button
// } from "@mui/material";
// import { Link } from "react-router-dom";
// import api from "../services/api";

// export default function FlwDashboard({ user }) {
//     const [stats, setStats] = useState({
//         today: 0,
//         month: 0,
//         accuracy: 0,
//         recent: []
//     });

//     const loadStats = async () => {
//         try {
//             if (!user || !user.userId) return;

//             const res = await api.get(`/animals/flw-stats/${user.userId}`);

//             if (res.data && res.data.success) {
//                 setStats({
//                     today: res.data.today || 0,
//                     month: res.data.month || 0,
//                     accuracy: res.data.accuracy || 0,
//                     recent: res.data.recent || []
//                 });
//             }
//         } catch (err) {
//             console.error("Stats load error:", err);
//         }
//     };

//     useEffect(() => {
//         loadStats();
//     }, [user]);

//     return (
//         <Box p={{ xs: 1.5, sm: 2, md: 4 }}>

//             {/* HEADER CARD */}
//             <Card
//                 sx={{
//                     background: "#2e7d32",
//                     color: "white",
//                     mb: 4,
//                     borderRadius: "12px",
//                     boxShadow: "0px 4px 20px rgba(0,0,0,0.15)"
//                 }}
//             >
//                 <CardContent>
//                     <Typography variant="h4" sx={{ fontWeight: 600 }}>
//                         Welcome, {user?.name}!
//                     </Typography>
//                     <Typography mt={1} sx={{ opacity: 0.9 }}>
//                         Field Level Worker Dashboard
//                     </Typography>
//                 </CardContent>
//             </Card>

//             {/* SUMMARY CARDS */}
//             <Grid container spacing={{ xs: 2, md: 3 }}>
//                 <Grid item xs={12} sm={6} md={4}>
//                     <Card className="dashboard-card">
//                         <CardContent sx={{ textAlign: "center", py: 3 }}>
//                             <Typography
//                                 sx={{
//                                     fontWeight: 800,
//                                     fontSize: { xs: "2.2rem", sm: "2.5rem", md: "2.8rem" },
//                                     color: "#2e7d32"
//                                 }}
//                             >

//                                 {stats.today}
//                             </Typography>
//                             <Typography sx={{ fontWeight: 600 }}>
//                                 Registered Today
//                             </Typography>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={4}>
//                     <Card className="dashboard-card">
//                         <CardContent sx={{ textAlign: "center", py: 3 }}>
//                             <Typography
//                                 sx={{
//                                     fontWeight: 800,
//                                     fontSize: { xs: "2.2rem", sm: "2.5rem", md: "2.8rem" },
//                                     color: "#2e7d32"
//                                 }}
//                             >
//                                 {stats.month}
//                             </Typography>
//                             <Typography>Total This Month</Typography>
//                         </CardContent>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={4}>
//                     <Card className="dashboard-card">
//                         <CardContent sx={{ textAlign: "center", py: 3 }}>
//                             <Typography
//                                 sx={{
//                                     fontWeight: 800,
//                                     fontSize: { xs: "2.2rem", sm: "2.5rem", md: "2.8rem" },
//                                     color: "#2e7d32"
//                                 }}
//                             >
//                                 {stats.accuracy}%
//                             </Typography>
//                             <Typography>Accuracy Rate</Typography>
//                         </CardContent>
//                     </Card>
//                 </Grid>
//             </Grid>

//             {/* QUICK ACTIONS */}
//             <Typography variant="h6" mt={5} mb={2} sx={{ fontWeight: 600 }}>
//                 Quick Actions
//             </Typography>

//             <Grid container spacing={3}>
//                 <Grid item xs={12} md={3}>
//                     <Card className="dashboard-card" sx={{ textAlign: "center", p: 2 }}>
//                         <Typography
//                             sx={{
//                                 fontWeight: 700,
//                                 fontSize: { xs: "1rem", sm: "1.1rem", md: "1.15rem" }
//                             }}
//                         >
//                             New Registration
//                         </Typography>
//                         <Link to="/register">
//                             <Button
//                                 fullWidth
//                                 size="large"
//                                 variant="contained"
//                                 sx={{ mt: 1, py: 1 }}
//                             >

//                                 <Typography sx={{ fontWeight: 600 }}>OPEN</Typography>

//                             </Button>
//                         </Link>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={3}>
//                     <Card className="dashboard-card" sx={{ textAlign: "center", p: 2 }}>
//                         <Typography
//                             sx={{
//                                 fontWeight: 700,
//                                 fontSize: { xs: "1rem", sm: "1.1rem", md: "1.15rem" }
//                             }}
//                         >
//                             Search & History
//                         </Typography>

//                         <Link to="/search">
//                             <Button
//                                 fullWidth
//                                 size="large"
//                                 variant="contained"
//                                 sx={{ mt: 1, py: 1 }}
//                             >

//                                 <Typography sx={{ fontWeight: 600 }}>OPEN</Typography>

//                             </Button>
//                         </Link>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={3}>
//                     <Card className="dashboard-card" sx={{ textAlign: "center", p: 2 }}>
//                         <Typography
//                             sx={{
//                                 fontWeight: 700,
//                                 fontSize: { xs: "1rem", sm: "1.1rem", md: "1.15rem" }
//                             }}
//                         >
//                             Breed Info
//                         </Typography>

//                         <Link to="/breeds">
//                             <Button
//                                 fullWidth
//                                 size="large"
//                                 variant="contained"
//                                 sx={{ mt: 1, py: 1 }}
//                             >
//                                 <Typography sx={{ fontWeight: 600 }}>OPEN</Typography>

//                             </Button>
//                         </Link>
//                     </Card>
//                 </Grid>

//                 <Grid item xs={12} md={3}>
//                     <Card className="dashboard-card" sx={{ textAlign: "center", p: 2 }}>
//                         <Typography
//                             sx={{
//                                 fontWeight: 700,
//                                 fontSize: { xs: "1rem", sm: "1.1rem", md: "1.15rem" }
//                             }}
//                         >
//                             Reports
//                         </Typography>

//                         <Link to="/reports">
//                             <Button
//                                 fullWidth
//                                 size="large"
//                                 variant="contained"
//                                 sx={{ mt: 1, py: 1 }}
//                             >

//                                 <Typography sx={{ fontWeight: 600 }}>OPEN</Typography>

//                             </Button>
//                         </Link>
//                     </Card>
//                 </Grid>
//             </Grid>

//             {/* RECENT ACTIVITY */}
//             <Typography variant="h6" mt={5} mb={2} sx={{ fontWeight: 600 }}>
//                 Recent Activity
//             </Typography>

//             <Card sx={{ borderRadius: "12px" }}>
//                 <CardContent>
//                     {stats.recent.length === 0 ? (
//                         <Typography>No recent activity found</Typography>
//                     ) : (
//                         stats.recent.map((item, idx) => (
//                             <Typography
//                                 key={idx}
//                                 sx={{
//                                     py: 1,
//                                     borderBottom:
//                                         idx !== stats.recent.length - 1
//                                             ? "1px solid #eee"
//                                             : "none"
//                                 }}
//                             >
//                                 • {item}
//                             </Typography>
//                         ))
//                     )}
//                 </CardContent>
//             </Card>
//         </Box>
//     );
// }


// 2

import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    Button,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    Paper,
    Avatar,
    Chip,
} from "@mui/material";
import {
    Today,
    CalendarMonth,
    TrendingUp,
    AppRegistration,
    History,
    MenuBook,
    Assessment,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import api from "../services/api";

// 🔥 i18n hook
import { useTranslation } from "react-i18next";

export default function FlwDashboard({ user }) {
    const { t, i18n } = useTranslation();

    const [stats, setStats] = useState({
        today: 0,
        month: 0,
        accuracy: 0,
        recent: []
    });

    const loadStats = async () => {
        try {
            if (!user || !user.userId) return;

            const res = await api.get(`/animals/flw-stats/${user.userId}`);

            if (res.data && res.data.success) {
                setStats({
                    today: res.data.today || 0,
                    month: res.data.month || 0,
                    accuracy: res.data.accuracy || 0,
                    recent: res.data.recent || []
                });
            }
        } catch (err) {
            console.error("Stats load error:", err);
        }
    };

    useEffect(() => {
        loadStats();
    }, [user]);

    // 🔥 Language change handler
    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("app_lang", lang);
    };

    return (
        <Box className="gov-page" p={{ xs: 1.5, sm: 2, md: 3 }}>

            <Paper
                elevation={0}
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                    bgcolor: '#fff',
                    boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
                }}
            >
                <Box>
                    <Typography variant="overline" sx={{ color: '#64748b', fontWeight: 700, letterSpacing: '0.12em' }}>
                        {t("dashboard_title")}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mt: 0.5 }}>
                        {t("welcome_flw")}
                    </Typography>
                </Box>
                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="lang-select-label">{t("select_language")}</InputLabel>
                    <Select
                        labelId="lang-select-label"
                        value={i18n.language}
                        label={t("select_language")}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        sx={{ borderRadius: 2, bgcolor: '#f8fafc' }}
                    >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="hi">हिंदी</MenuItem>
                    </Select>
                </FormControl>
            </Paper>

            <Card
                sx={{
                    position: 'relative',
                    background: 'linear-gradient(125deg, #1e3a8a 0%, #1a237e 38%, #312e81 100%)',
                    color: '#fff',
                    mb: 4,
                    borderRadius: 3,
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 20px 50px rgba(26, 35, 126, 0.35)',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.35,
                        background: `repeating-linear-gradient(
                            -35deg,
                            transparent,
                            transparent 12px,
                            rgba(255,255,255,0.04) 12px,
                            rgba(255,255,255,0.04) 24px
                        )`,
                        pointerEvents: 'none',
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: -40,
                        right: -40,
                        width: 180,
                        height: 180,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,153,51,0.35) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }}
                />
                <CardContent sx={{ position: 'relative', py: { xs: 3, sm: 4 }, px: { xs: 2.5, sm: 3.5 } }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 2, justifyContent: 'space-between' }}>
                        <Box>
                            <Chip
                                label="FLW"
                                size="small"
                                sx={{
                                    mb: 1.5,
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    border: '1px solid rgba(255,255,255,0.25)',
                                }}
                            />
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 800,
                                    color: '#ffffff',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                                    fontSize: { xs: '1.5rem', sm: '2rem' },
                                    lineHeight: 1.2,
                                }}
                            >
                                {user?.name}
                            </Typography>
                            <Typography
                                sx={{
                                    mt: 1.25,
                                    color: '#e0e7ff',
                                    fontWeight: 500,
                                    fontSize: '1rem',
                                    maxWidth: 480,
                                    lineHeight: 1.5,
                                }}
                            >
                                {t("dashboard_title")}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <Grid container spacing={{ xs: 2, md: 2.5 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        className="dashboard-card"
                        elevation={0}
                        sx={{
                            border: '1px solid #e2e8f0',
                            borderRadius: 2,
                            bgcolor: '#fff',
                            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
                            overflow: 'hidden',
                            borderTop: '4px solid #138808',
                        }}
                    >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2.5 }}>
                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56,
                                    bgcolor: 'rgba(19, 136, 8, 0.12)',
                                    color: '#166534',
                                }}
                            >
                                <Today sx={{ fontSize: 30 }} />
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: { xs: '2rem', sm: '2.35rem' }, color: '#0f172a', lineHeight: 1 }}>
                                    {stats.today}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b', mt: 0.5 }}>
                                    {t("registered_today")}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        className="dashboard-card"
                        elevation={0}
                        sx={{
                            border: '1px solid #e2e8f0',
                            borderRadius: 2,
                            bgcolor: '#fff',
                            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
                            overflow: 'hidden',
                            borderTop: '4px solid #ff9933',
                        }}
                    >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2.5 }}>
                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56,
                                    bgcolor: 'rgba(255, 153, 51, 0.15)',
                                    color: '#c2410c',
                                }}
                            >
                                <CalendarMonth sx={{ fontSize: 30 }} />
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: { xs: '2rem', sm: '2.35rem' }, color: '#0f172a', lineHeight: 1 }}>
                                    {stats.month}
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b', mt: 0.5 }}>
                                    {t("total_month")}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        className="dashboard-card"
                        elevation={0}
                        sx={{
                            border: '1px solid #e2e8f0',
                            borderRadius: 2,
                            bgcolor: '#fff',
                            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
                            overflow: 'hidden',
                            borderTop: '4px solid #1a237e',
                        }}
                    >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2.5 }}>
                            <Avatar
                                sx={{
                                    width: 56,
                                    height: 56,
                                    bgcolor: 'rgba(26, 35, 126, 0.1)',
                                    color: '#1a237e',
                                }}
                            >
                                <TrendingUp sx={{ fontSize: 30 }} />
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontWeight: 800, fontSize: { xs: '2rem', sm: '2.35rem' }, color: '#0f172a', lineHeight: 1 }}>
                                    {stats.accuracy}%
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b', mt: 0.5 }}>
                                    {t("accuracy_rate")}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Typography variant="h6" mt={5} mb={2} sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {t("quick_actions")}
            </Typography>

            <Grid container spacing={2.5}>
                {[
                    { to: '/register', titleKey: 'new_registration', Icon: AppRegistration, accent: '#138808', iconBg: 'rgba(19, 136, 8, 0.12)', iconColor: '#166534' },
                    { to: '/search', titleKey: 'search_history', Icon: History, accent: '#1a237e', iconBg: 'rgba(26, 35, 126, 0.1)', iconColor: '#1a237e' },
                    { to: '/breeds', titleKey: 'breed_info', Icon: MenuBook, accent: '#c2410c', iconBg: 'rgba(255, 153, 51, 0.15)', iconColor: '#c2410c' },
                    { to: '/reports', titleKey: 'reports', Icon: Assessment, accent: '#6366f1', iconBg: 'rgba(99, 102, 241, 0.12)', iconColor: '#4f46e5' },
                ].map(({ to, titleKey, Icon, accent, iconBg, iconColor }) => (
                    <Grid item xs={12} sm={6} md={3} key={to}>
                        <Card
                            className="dashboard-card"
                            elevation={0}
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid #e2e8f0',
                                borderRadius: 2,
                                bgcolor: '#fff',
                                boxShadow: '0 8px 28px rgba(15, 23, 42, 0.05)',
                                overflow: 'hidden',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.1)',
                                },
                            }}
                        >
                            <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
                                <Avatar
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        mb: 2,
                                        bgcolor: iconBg,
                                        color: iconColor,
                                    }}
                                >
                                    <Icon sx={{ fontSize: 26 }} />
                                </Avatar>
                                <Typography sx={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem', mb: 2, flex: 1 }}>
                                    {t(titleKey)}
                                </Typography>
                                <Link to={to} style={{ textDecoration: 'none' }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="medium"
                                        sx={{
                                            py: 1.1,
                                            borderRadius: 2,
                                            fontWeight: 700,
                                            textTransform: 'none',
                                        }}
                                    >
                                        {t("button_open")}
                                    </Button>
                                </Link>
                            </CardContent>
                            <Box sx={{ height: 4, bgcolor: accent }} />
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Card
                elevation={0}
                sx={{
                    mt: 5,
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)',
                    bgcolor: '#fff',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        px: 2,
                        py: 1.25,
                        bgcolor: '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#64748b',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                    }}
                >
                    {t("recent_activity")}
                </Box>
                <CardContent sx={{ pt: 2, pb: 3, minHeight: 140 }}>
                    {stats.recent.length === 0 ? (
                        <Box
                            sx={{
                                py: 4,
                                px: 2,
                                textAlign: 'center',
                                borderRadius: 2,
                                bgcolor: '#f8fafc',
                                border: '1px dashed #cbd5e1',
                            }}
                        >
                            <History sx={{ fontSize: 40, color: '#cbd5e1', mb: 1 }} />
                            <Typography sx={{ color: '#64748b', fontWeight: 500 }}>{t("no_recent_activity")}</Typography>
                        </Box>
                    ) : (
                        stats.recent.map((item, idx) => (
                            <Typography
                                key={idx}
                                sx={{
                                    py: 1,
                                    borderBottom:
                                        idx !== stats.recent.length - 1
                                            ? "1px solid #eee"
                                            : "none"
                                }}
                            >
                                • {item}
                            </Typography>
                        ))
                    )}
                </CardContent>
            </Card>

        </Box>
    );
}
