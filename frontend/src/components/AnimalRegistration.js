// src/components/AnimalRegistration.js
import React, { useState, useRef, useEffect } from "react";
import {
  Container, Paper, Typography, TextField, Button, Box, Grid, Card,
  CardMedia, Alert, Chip, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Stepper, Step, StepLabel, IconButton
} from "@mui/material";

import { CameraAlt, CloudUpload, CheckCircle, Pets, Delete } from "@mui/icons-material";
import Webcam from "react-webcam";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

import { animalAPI, breedAPI } from "../services/api";

// Helper: convert base64 -> image element
const loadImageElement = (dataUrl) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });

// Helper: crop & return base64
const cropImageElementToDataURL = (imgEl, box) => {
  const canvas = document.createElement("canvas");

  const x = Math.max(0, Math.floor(box.x));
  const y = Math.max(0, Math.floor(box.y));
  const w = Math.min(imgEl.naturalWidth - x, Math.floor(box.width));
  const h = Math.min(imgEl.naturalHeight - y, Math.floor(box.height));

  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(imgEl, x, y, w, h, 0, 0, w, h);

  return canvas.toDataURL("image/jpeg");
};

const MAX_IMAGES = 3;

// MAIN COMPONENT
export default function AnimalRegistration({ user }) {

  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Animal Details", "Image Capture", "Breed Recognition", "Review"];

  // Form state
  const [formData, setFormData] = useState({
    tagId: "",
    ownerName: "",
    ownerPhone: "",
    sex: "",
    age: "",
    location: "",
    breed: "",
    species: ""
  });

  const setField = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  // Images
  const [croppedImages, setCroppedImages] = useState([]);

  // Breed predictions
  const [breedPrediction, setBreedPrediction] = useState(null);
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  // Loading states
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Camera
  const [showCamera, setShowCamera] = useState(false);
  const webcamRef = useRef(null);

  const galleryRef = useRef(null);

  // Auto-crop model
  const detectorRef = useRef(null);
  const [detectorLoaded, setDetectorLoaded] = useState(false);



  // Load COCO-SSD model
  useEffect(() => {
    (async () => {
      try {
        const model = await cocoSsd.load();
        detectorRef.current = model;
        setDetectorLoaded(true);
      } catch (err) {
        console.error("Model load failed", err);
      }
    })();
  }, []);


  // Find animal bounding box
  const findBestAnimalBox = (detections) => {
    const animals = detections.filter(d =>
      /cow|ox|buffalo/i.test(d.class)
    );
    return animals[0] || detections[0];
  };

  // Auto crop
  const detectAndCrop = async (base64) => {
    if (!detectorLoaded) return base64;

    try {
      const img = await loadImageElement(base64);
      const detections = await detectorRef.current.detect(img);

      if (!detections.length) return base64;

      const best = findBestAnimalBox(detections);
      if (!best) return base64;

      const pad = 0.12;

      const box = {
        x: best.bbox[0] - best.bbox[2] * pad,
        y: best.bbox[1] - best.bbox[3] * pad,
        width: best.bbox[2] * (1 + pad * 2),
        height: best.bbox[3] * (1 + pad * 2),
      };

      return cropImageElementToDataURL(img, box);

    } catch (err) {
      return base64;
    }
  };

  const fallbackCrop = (img) => {
  const cropWidth = img.naturalWidth * 0.7;
  const cropHeight = img.naturalHeight * 0.7;

  const x = (img.naturalWidth - cropWidth) / 2;
  const y = (img.naturalHeight - cropHeight) / 2;

  const box = { x, y, width: cropWidth, height: cropHeight };
  return cropImageElementToDataURL(img, box);
};

  // Handle file upload
  const handleFilesSelected = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setLoading(true);

    for (const f of files) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const cropped = await detectAndCrop(ev.target.result);

        setCroppedImages(prev =>
          [...prev, cropped].slice(0, MAX_IMAGES)
        );
      };
      reader.readAsDataURL(f);
    }

    setLoading(false);
  };

  // Capture from camera
  const captureFromCamera = async () => {
    const shot = webcamRef.current?.getScreenshot();
    if (!shot) return alert("Camera not ready");

    const cropped = await detectAndCrop(shot);
    setCroppedImages(prev => [...prev, cropped].slice(0, MAX_IMAGES));
  };

  // Analyze breed + species
  const analyzeImages = async () => {
    if (!croppedImages.length) return alert("Upload at least one cropped image.");

    setAnalyzing(true);

    const result = await breedAPI.recognizeBase64(croppedImages[0]);

    setField("breed", result.best_breed);
    setField("species", result.species || "");

    setBreedPrediction(result.top3 || []);
    setAnalyzing(false);

    setActiveStep(2);
  };

  // Next button
  const handleNext = () => {

    if (activeStep === 0) {
      if (!formData.tagId || !formData.ownerName || !formData.ownerPhone) {
        return alert("Fill required fields.");
      }
    }

    if (activeStep === 1) {
      if (!croppedImages.length) return alert("Upload or capture image first.");
      analyzeImages();
      return;
    }

    setActiveStep(activeStep + 1);
  };

  // Submit final
  const handleSubmit = async () => {
    let finalBreed = formData.breed;

    if (isOtherSelected) {
      await breedAPI.saveManualBreed(finalBreed, user?.userId);
      finalBreed = `${finalBreed} (Other)`;
    }

    const payload = {
      ...formData,
      breed: finalBreed,
      imageBase64: croppedImages[0],
      extraImages: croppedImages,
      userId: user?.userId
    };

    const res = await animalAPI.register(payload);

    if (!res?.success) {
      alert("Registration failed");
      return;
    }

    alert("Animal registered successfully");

    setActiveStep(0);
    setFormData({
      tagId: "",
      ownerName: "",
      ownerPhone: "",
      sex: "",
      age: "",
      location: "",
      breed: "",
      species: ""
    });

    setCroppedImages([]);
    setBreedPrediction(null);
    setIsOtherSelected(false);
  };

  // UI START
  return (
    <Container maxWidth="md" className="gov-page" sx={{ py: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 1,
          border: '1px solid #b0bec5',
          boxShadow: '0 4px 20px rgba(26, 35, 126, 0.08)',
          borderTop: '4px solid #ff9933',
        }}
      >

        <Typography
          align="center"
          sx={{
            fontWeight: 700,
            mb: 3,
            fontSize: { xs: '1.35rem', sm: '1.5rem' },
            color: '#1a237e',
            letterSpacing: '0.02em',
          }}
        >
          Animal Registration
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map(s => (
            <Step key={s}><StepLabel>{s}</StepLabel></Step>
          ))}
        </Stepper>


        {/* ---------------- STEP 1 — DETAILS ---------------- */}
        {activeStep === 0 && (
          <Box>
            <Grid container spacing={2}>

              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Tag ID"
                           value={formData.tagId}
                           onChange={e => setField("tagId", e.target.value)} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Owner Name"
                           value={formData.ownerName}
                           onChange={e => setField("ownerName", e.target.value)} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Owner Phone"
                           value={formData.ownerPhone}
                           onChange={e => setField("ownerPhone", e.target.value)} />
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Gender</InputLabel>
                  <Select value={formData.sex} label="Gender"
                          onChange={e => setField("sex", e.target.value)}>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField fullWidth type="number" label="Age (months)"
                           value={formData.age}
                           onChange={e => setField("age", e.target.value)} />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth label="Location"
                           value={formData.location}
                           onChange={e => setField("location", e.target.value)} />
              </Grid>

            </Grid>
          </Box>
        )}


        {/* ---------------- STEP 2 — IMAGE CAPTURE/UPLOAD ---------------- */}
        {activeStep === 1 && (
          <Box>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<CameraAlt />}
              onClick={() => setShowCamera(!showCamera)}
            >
              {showCamera ? "Close Camera" : "Open Camera"}
            </Button>

            {showCamera && (
              <Box mt={2}>
                <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />
                <Button variant="contained" sx={{ mt: 1 }}
                        onClick={captureFromCamera}>
                  Capture
                </Button>
              </Box>
            )}

            <Button fullWidth variant="outlined"
                    sx={{ mt: 2 }}
                    startIcon={<CloudUpload />}
                    onClick={() => galleryRef.current.click()}>
              Upload Images (Max 3)
            </Button>

            <input hidden ref={galleryRef} type="file"
                   accept="image/*" multiple
                   onChange={handleFilesSelected} />

            {/* SHOW ONLY AUTO-CROPPED IMAGES */}
            {croppedImages.length > 0 && (
              <Box mt={2} sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {croppedImages.map((cropped, idx) => (
                  <Card key={idx} sx={{ width: 160, position: "relative" }}>
                    <CardMedia
                      component="img"
                      height="120"
                      image={cropped}
                      style={{ objectFit: "cover" }}
                    />

                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 5,
                        left: 5,
                        background: "white"
                      }}
                      onClick={() =>
                        setCroppedImages(prev => prev.filter((_, i) => i !== idx))
                      }
                    >
                      <Delete />
                    </IconButton>
                  </Card>
                ))}
              </Box>
            )}

          </Box>
        )}


        {/* ---------------- STEP 3 — BREED RECOGNITION ---------------- */}
        {activeStep === 2 && (
          <Box>

            <Typography sx={{ mb: 2 }}>
              <b>Detected Species:</b> {formData.species || "Unknown"}
            </Typography>

            {breedPrediction && (
              <>
                <Alert severity="success" sx={{ mt: 2 }}>
                  <CheckCircle sx={{ mr: 1 }} /> Breed recognition ready
                </Alert>

                <Typography sx={{ mt: 2 }}>Top Predictions</Typography>

                {breedPrediction.map((p, i) => (
                  <Chip
                    key={i}
                    icon={<Pets />}
                    label={`${p.breed} (${(p.confidence * 100).toFixed(1)}%)`}
                    onClick={() => {
                      setIsOtherSelected(false);
                      setField("breed", p.breed);
                    }}
                    sx={{ m: 1 }}
                  />
                ))}

                <Chip
                  icon={<Pets />}
                  label="+ Other"
                  onClick={() => {
                    setIsOtherSelected(true);
                    setField("breed", "");
                  }}
                  sx={{ m: 1, background: "#6a1b9a", color: "white" }}
                />

                <TextField
                  fullWidth
                  sx={{ mt: 3 }}
                  label={isOtherSelected ? "Enter New Breed" : "Confirmed Breed"}
                  value={formData.breed}
                  onChange={e => setField("breed", e.target.value)}
                />
              </>
            )}

            {analyzing && (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CircularProgress />
                <Typography>Analyzing...</Typography>
              </Box>
            )}
          </Box>
        )}


        {/* ---------------- STEP 4 — REVIEW ---------------- */}
        {activeStep === 3 && (
          <Box>
            <Typography fontWeight={700}>Review</Typography>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={6}><b>Tag:</b> {formData.tagId}</Grid>
              <Grid item xs={6}><b>Owner:</b> {formData.ownerName}</Grid>
              <Grid item xs={6}><b>Species:</b> {formData.species}</Grid>
              <Grid item xs={6}>
                <b>Breed:</b> {isOtherSelected ? `${formData.breed} (Other)` : formData.breed}
              </Grid>
            </Grid>

            {croppedImages.length > 0 && (
              <Card sx={{ mt: 2, maxWidth: 300 }}>
                <CardMedia component="img" height="200" image={croppedImages[0]} />
              </Card>
            )}
          </Box>
        )}


        {/* ---------------- FOOTER BUTTONS ---------------- */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button disabled={activeStep === 0}
                  onClick={() => setActiveStep(activeStep - 1)}>
            Back
          </Button>

          {activeStep === 3 ? (
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              {activeStep === 1 ? "Analyze & Next" : "Next"}
            </Button>
          )}
        </Box>

      </Paper>
    </Container>
  );
}
