import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InsightsIcon from "@mui/icons-material/Insights";


import { useTranslation } from "react-i18next";

export default function FlwSummaryCards({ stats }) {
    const { t } = useTranslation();

    return (
        <Grid container spacing={2} sx={{ mt: 2 }}>

            {/* Animals Registered Today */}
            <Grid item xs={12} md={4}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                            <PetsIcon sx={{ fontSize: 40, color: "#2e7d32" }} />
                            <Box>
                                <Typography variant="h5" fontWeight={700}>
                                    {stats.today}
                                </Typography>
                                <Typography color="text.secondary">
                                    {t("animals_registered_today")}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Total This Month */}
            <Grid item xs={12} md={4}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                            <TrendingUpIcon sx={{ fontSize: 40, color: "#1976d2" }} />
                            <Box>
                                <Typography variant="h5" fontWeight={700}>
                                    {stats.month}
                                </Typography>
                                <Typography color="text.secondary">
                                    {t("total_this_month")}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            {/* Accuracy */}
            <Grid item xs={12} md={4}>
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={2}>
                            <InsightsIcon sx={{ fontSize: 40, color: "#9c27b0" }} />
                            <Box>
                                <Typography variant="h5" fontWeight={700}>
                                    {stats.accuracy}%
                                </Typography>
                                <Typography color="text.secondary">
                                    {t("accuracy_rate")}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
