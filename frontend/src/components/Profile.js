import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

export default function Profile({ user }) {
    return (
        <Box p={4} display="flex" justifyContent="center">
            <Card sx={{ width: 450 }}>
                <CardContent>
                    <Typography variant="h5" mb={2}>
                        User Profile
                    </Typography>

                    <Typography><strong>User ID:</strong> {user?.userId}</Typography>
                    <Typography><strong>Name:</strong> {user?.name}</Typography>
                    <Typography><strong>Role:</strong> {user?.role}</Typography>

                    {user?.district && (
                        <Typography><strong>District:</strong> {user.district}</Typography>
                    )}

                    {user?.gender && (
                        <Typography><strong>Gender:</strong> {user.gender}</Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}
