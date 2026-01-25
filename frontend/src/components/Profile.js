import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Profile({ user }) {
    const { t } = useTranslation();

    return (
        <Box p={4} display="flex" justifyContent="center">
            <Card sx={{ width: 450 }}>
                <CardContent>
                    <Typography
                        sx={{
                            fontWeight: 700,
                            fontSize: { xs: "1rem", sm: "1.1rem", md: "1.15rem" }
                        }}
                    >
                        {t("user_profile")}
                    </Typography>

                    <Typography>
                        <strong>{t("user_id")}:</strong> {user?.userId}
                    </Typography>

                    <Typography>
                        <strong>{t("name")}:</strong> {user?.name}
                    </Typography>

                    <Typography>
                        <strong>{t("role")}:</strong> {user?.role}
                    </Typography>

                    {user?.district && (
                        <Typography>
                            <strong>{t("district")}:</strong> {user.district}
                        </Typography>
                    )}

                    {user?.gender && (
                        <Typography>
                            <strong>{t("gender")}:</strong> {user.gender}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
