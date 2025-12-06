// src/components/AnimalRegistration.js
import React, { useState, useRef } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Grid,
    Card,
    CardMedia,
    Alert,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';

import { PhotoCamera, CloudUpload, CheckCircle, Pets } from '@mui/icons-material';
import Webcam from 'react-webcam';

import { animalAPI, breedAPI } from '../services/api';

const AnimalRegistration = ({ user }) => {
    const [activeStep, setActiveStep] = useState(0);

    const [formData, setFormData] = useState({
        tagId: "",
        ownerName: "",
        ownerPhone: "",
        animalType: "",
        sex: "",
        age: "",
        breed: "",
        location: "",
    });

    const [image, setImage] = useState(null);
    const [breedPrediction, setBreedPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    // camera state (desktop)
    const [showCamera, setShowCamera] = useState(false);

    // 2  inputs → mobile camera + gallery
    const cameraInputRef = useRef(null);
    const galleryInputRef = useRef(null);
    const webcamRef = useRef(null);

    const steps = ["Animal Details", "Image Capture", "Breed Recognition", "Review & Submit"];

    // very simple mobile detection
    const isMobile =
        typeof navigator !== "undefined" &&
        /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // =============================
    // Breed Recognition
    // =============================
    const callBreedAPI = async (base64Image) => {
        try {
            setLoading(true);

            const res = await breedAPI.recognizeBase64(base64Image);

            if (!res.success) {
                setBreedPrediction(null);
                alert("Breed Recognition Failed: " + res.error);
                setLoading(false);
                return;
            }

            const result = [
                {
                    breed: res.breed,
                    confidence: res.confidence,
                },
            ];

            setBreedPrediction(result);

            setFormData((prev) => ({
                ...prev,
                breed: res.breed
            }));

            setActiveStep(2);
            setLoading(false);

        } catch (err) {
            console.error(err);
            alert("Error predicting breed.");
            setLoading(false);
        }
    };

    // common handler (camera + gallery)
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            const base64Img = ev.target.result;
            setImage(base64Img);
            callBreedAPI(base64Img);
        };
        reader.readAsDataURL(file);
    };

    // desktop webcam capture
    const captureFromWebcam = () => {
        if (!webcamRef.current) {
            alert("Camera not ready.");
            return;
        }
        const img = webcamRef.current.getScreenshot();
        if (!img) {
            alert("Failed to capture image.");
            return;
        }
        setImage(img);
        setShowCamera(false);
        callBreedAPI(img);
    };

    const handleNext = () => {
        if (activeStep === 0 && (!formData.tagId || !formData.animalType)) {
            return alert("Tag ID & Animal Type are required.");
        }
        if (activeStep === 1 && !image) {
            return alert("Upload or capture image first.");
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = async () => {
        const requiredFields = [
            "tagId",
            "ownerName",
            "ownerPhone",
            "animalType",
            "sex",
            "age",
            "location",
            "breed",
        ];

        for (let key of requiredFields) {
            if (!formData[key]) {
                return alert("Missing: " + key);
            }
        }

        setLoading(true);

        try {
            const payload = {
                ...formData,
                userId: user?.userId || "unknown",
                imageBase64: image,
                animalType: formData.animalType.toLowerCase()
            };

            const response = await animalAPI.register(payload);

            if (!response.success) {
                alert("Registration failed: " + response.error);
                setLoading(false);
                return;
            }

            alert("Animal Registered Successfully!");

            setActiveStep(0);
            setImage(null);
            setBreedPrediction(null);
            setFormData({
                tagId: "",
                ownerName: "",
                ownerPhone: "",
                animalType: "",
                sex: "",
                age: "",
                breed: "",
                location: "",
            });

        } catch (err) {
            alert(err.message);
        }

        setLoading(false);
    };

    // =============================
    // Page Steps Rendering
    // =============================
    const renderStepContent = () => {
        switch (activeStep) {

            // Step 1 – Animal Details
            case 0:
                return (
                    <Box mt={{ xs: 2, sm: 3 }}>
                        <Grid container spacing={{ xs: 2, sm: 3 }}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Tag ID"
                                    name="tagId"
                                    value={formData.tagId}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Animal Type</InputLabel>
                                    <Select
                                        name="animalType"
                                        value={formData.animalType}
                                        label="Animal Type"
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value="cattle">Cattle</MenuItem>
                                        <MenuItem value="buffalo">Buffalo</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Owner Name"
                                    name="ownerName"
                                    value={formData.ownerName}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Owner Phone"
                                    name="ownerPhone"
                                    value={formData.ownerPhone}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                        name="sex"
                                        value={formData.sex}
                                        label="Gender"
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Age (months)"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                );

            // Step 2 – Image Capture
            case 1:
                return (
                    <Box mt={{ xs: 2, sm: 3 }}>
                        {/* MOBILE VERSION */}
                        {isMobile && !image && (
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<PhotoCamera />}
                                        onClick={() => cameraInputRef.current?.click()}
                                    >
                                        Use Camera
                                    </Button>
                                    <input
                                        ref={cameraInputRef}
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleFileUpload}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        startIcon={<CloudUpload />}
                                        onClick={() => galleryInputRef.current?.click()}
                                    >
                                        Upload Image
                                    </Button>
                                    <input
                                        ref={galleryInputRef}
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                </Grid>
                            </Grid>
                        )}

                        {/* DESKTOP / LAPTOP VERSION */}
                        {!isMobile && (
                            <>
                                {!showCamera && !image && (
                                    <Grid container spacing={2} sx={{ mb: 2 }}>
                                        <Grid item xs={12} sm={6}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                startIcon={<PhotoCamera />}
                                                onClick={() => setShowCamera(true)}
                                            >
                                                Use Camera
                                            </Button>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                startIcon={<CloudUpload />}
                                                onClick={() => galleryInputRef.current?.click()}
                                            >
                                                Upload Image
                                            </Button>
                                            <input
                                                ref={galleryInputRef}
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                            />
                                        </Grid>
                                    </Grid>
                                )}

                                {showCamera && !image && (
                                    <>
                                        <Webcam
                                            ref={webcamRef}
                                            audio={false}
                                            screenshotFormat="image/jpeg"
                                            style={{
                                                width: "100%",
                                                borderRadius: 8,
                                            }}
                                        />
                                        <Box sx={{ mt: 2, display: "flex", gap: 1.5 }}>
                                            <Button
                                                variant="contained"
                                                onClick={captureFromWebcam}
                                            >
                                                Capture
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                onClick={() => setShowCamera(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </Box>
                                    </>
                                )}
                            </>
                        )}

                        {/* COMMON PREVIEW (mobile + desktop) */}
                        {image && (
                            <Box sx={{ textAlign: "center", mt: 2 }}>
                                <Card sx={{ maxWidth: 400, mx: 'auto' }}>
                                    <CardMedia component="img" height="300" image={image} />
                                </Card>

                                <Button
                                    variant="outlined"
                                    color="warning"
                                    sx={{ mt: 2 }}
                                    onClick={() => {
                                        setImage(null);
                                        setBreedPrediction(null);
                                        setShowCamera(false);
                                    }}
                                >
                                    Retake or Upload Image
                                </Button>
                            </Box>
                        )}
                    </Box>
                );

            // Step 3 – Breed Recognition
            case 2:
                return (
                    <Box mt={{ xs: 2, sm: 3 }}>
                        {loading && (
                            <Box sx={{ textAlign: "center", py: 4 }}>
                                <CircularProgress />
                                <Typography sx={{ mt: 2 }}>Analyzing image...</Typography>
                            </Box>
                        )}

                        {!loading && breedPrediction && (
                            <>
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    <CheckCircle sx={{ mr: 1 }} /> Breed recognition complete!
                                </Alert>

                                {breedPrediction.map((p, i) => (
                                    <Chip
                                        key={i}
                                        icon={<Pets />}
                                        sx={{ mr: 1, mb: 1 }}
                                        color="primary"
                                        label={`${p.breed} ${(p.confidence * 100).toFixed(1)}%`}
                                    />
                                ))}

                                <TextField
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    label="Confirmed Breed"
                                    name="breed"
                                    value={formData.breed}
                                    onChange={handleInputChange}
                                />
                            </>
                        )}
                    </Box>
                );

            // Step 4 – Review & Submit
            case 3:
                return (
                    <Box mt={{ xs: 2, sm: 3 }}>
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.15rem" }
                            }}
                        >
                            Review Details
                        </Typography>

                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={6}><b>Tag:</b> {formData.tagId}</Grid>
                            <Grid item xs={6}><b>Type:</b> {formData.animalType}</Grid>
                            <Grid item xs={6}><b>Owner:</b> {formData.ownerName}</Grid>
                            <Grid item xs={6}><b>Breed:</b> {formData.breed}</Grid>
                        </Grid>

                        {image && (
                            <Card sx={{ mt: 2, maxWidth: 300 }}>
                                <CardMedia component="img" height="200" image={image} />
                            </Card>
                        )}
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Container
            maxWidth="md"
            sx={{
                py: { xs: 2, sm: 3 },
                mt: { xs: 8, sm: 9 },
            }}
        >
            <Paper
                sx={{
                    p: { xs: 2, sm: 3, md: 4 },
                    borderRadius: 3,
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.08)",
                }}
            >
                <Typography
                    align="center"
                    sx={{
                        fontWeight: 700,
                        mb: { xs: 2, sm: 3 },
                        fontSize: { xs: "1.4rem", sm: "1.7rem", md: "2rem" },
                        color: "#1b5e20",
                    }}
                >
                    Animal Registration
                </Typography>

                <Box sx={{ overflowX: "auto", pb: 1 }}>
                    <Stepper
                        activeStep={activeStep}
                        alternativeLabel
                        sx={{
                            mb: { xs: 2, sm: 3 },
                            minWidth: 500,
                            "& .MuiStepLabel-label": {
                                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                                whiteSpace: "nowrap",
                            },
                            "& .MuiStepIcon-root": {
                                width: { xs: 24, sm: 28 },
                                height: { xs: 24, sm: 28 },
                            },
                        }}
                    >
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                {renderStepContent()}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: { xs: 3, sm: 4 },
                    }}
                >
                    <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                    >
                        Back
                    </Button>

                    {activeStep === 3 ? (
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{ px: { xs: 3, sm: 4 } }}
                        >
                            Submit Registration
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            sx={{ px: { xs: 3, sm: 4 } }}
                        >
                            Next
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default AnimalRegistration;
