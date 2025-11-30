import React, { useState } from "react";
import {
    Container,
    Paper,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Box,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    InputAdornment
} from "@mui/material";

import { ExpandMore, Search } from "@mui/icons-material";

import breedInfo from "../data/breedInfo.json";
import breedImages from "../data/breedImages.json";

const BreedInfo = () => {
    const [searchTerm, setSearchTerm] = useState("");

    // CATTLE
    const cattleBreeds = Object.keys(breedInfo.cattle).map((name) => ({
        name,
        type: "Cattle",
        origin: "India",
        characteristics: "Indigenous cattle breed",
        image: `/assests/breeds/cattle/${breedImages.cattle[name]}`,
        milkYield: breedInfo.cattle[name].milk_yield,
        bodyWeight: `Male: ${breedInfo.cattle[name].body_weight_male}, Female: ${breedInfo.cattle[name].body_weight_female}`,
        specialFeatures: breedInfo.cattle[name].special_features,
    }));

    // BUFFALO
    const buffaloBreeds = Object.keys(breedInfo.buffalo).map((name) => ({
        name,
        type: "Buffalo",
        origin: "India",
        characteristics: "Indigenous buffalo breed",
        image: `/assests/breeds/buffalo/${breedImages.buffalo[name]}`,
        milkYield: breedInfo.buffalo[name].milk_yield,
        bodyWeight: `Male: ${breedInfo.buffalo[name].body_weight_male}, Female: ${breedInfo.buffalo[name].body_weight_female}`,
        specialFeatures: breedInfo.buffalo[name].special_features,
    }));

    const allBreeds = [...cattleBreeds, ...buffaloBreeds];

    const filteredBreeds = allBreeds.filter(
        (breed) =>
            breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            breed.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h4" align="center">
                    🐄 Indian Cattle & Buffalo Breeds
                </Typography>

                <Typography variant="body1" align="center" sx={{ mt: 1 }} color="text.secondary">
                    Reference guide for breed identification and characteristics
                </Typography>

                <Box sx={{ mt: 3 }}>
                    <TextField
                        fullWidth
                        label="Search breeds..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Paper>

            <Typography variant="h5" sx={{ mb: 2 }}>
                Breed Database ({filteredBreeds.length} breeds)
            </Typography>

            <Grid container spacing={3}>
                {filteredBreeds.map((breed, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                        <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={breed.image}
                                alt={breed.name}
                                sx={{
                                    objectFit: "cover",
                                    objectPosition: "top"
                                }}
                                onError={(e) => {
                                    e.target.src = "/placeholder.png";
                                }}
                            />


                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Typography variant="h6">{breed.name}</Typography>
                                    <Chip
                                        label={breed.type}
                                        color={breed.type === "Cattle" ? "primary" : "secondary"}
                                        size="small"
                                    />
                                </Box>

                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    <strong>Origin:</strong> {breed.origin}
                                </Typography>

                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    {breed.characteristics}
                                </Typography>

                                <Accordion sx={{ mt: 2 }}>
                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography fontWeight="bold" variant="body2">
                                            Detailed Information
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body2">
                                            <strong>Milk Yield:</strong> {breed.milkYield}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            <strong>Body Weight:</strong> {breed.bodyWeight}
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            <strong>Special Features:</strong> {breed.specialFeatures}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {filteredBreeds.length === 0 && (
                <Paper sx={{ p: 5, mt: 3, textAlign: "center" }}>
                    <Typography variant="h6">No breeds found.</Typography>
                    <Typography variant="body2">Try another search term.</Typography>
                </Paper>
            )}
        </Container>
    );
};

export default BreedInfo;
