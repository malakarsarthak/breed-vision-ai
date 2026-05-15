from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
import io
import base64
import tensorflow as tf
tf.config.set_visible_devices([], 'GPU')  # force CPU
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.efficientnet_v2 import preprocess_input

import os
import gdown

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# DOWNLOAD MODEL FROM DRIVE
# =========================

import os
import gdown

MODEL_PATH = "model/epoch_04.keras"

if not os.path.exists(MODEL_PATH):
    os.makedirs("model", exist_ok=True)
    
    url = "https://drive.google.com/uc?id=16qFtoGtclsOmwk2ixOGqjnIWyO4OC6hk"
    
    print("Downloading model from Google Drive...")
    gdown.download(url, MODEL_PATH, quiet=False)

print("Loading model...")
model = load_model(MODEL_PATH)

print("Model loaded successfully")

# =========================
# LABELS
# =========================

LABELS = [line.strip() for line in open("labels.txt").read().splitlines()]

# =========================
# BREED TO SPECIES
# =========================

BREED_TO_SPECIES = {
    "Aryshire": "cow",
    "Badri_cow": "cow",
    "Banni": "buffalo",
    "Bhadwari": "buffalo",
    "Binjharpuri": "cow",
    "Brown_Swiss": "cow",
    "Dangi": "cow",
    "Deoni": "cow",
    "Gangatiri": "cow",
    "GirCross": "cow",
    "Gir_Cow": "cow",
    "Girlando": "cow",
    "Gurnesey": "cow",
    "HFCross": "cow",
    "Hallikar": "cow",
    "Holstein_friesian": "cow",
    "Jafrabadi": "buffalo",
    "JerseyCross": "cow",
    "Kankrej": "cow",
    "Kasargod": "cow",
    "Kenkatha": "cow",
    "Kherigarh": "cow",
    "Khillari": "cow",
    "Ladakhi_cow": "cow",
    "Malnad_gidda": "cow",
    "Mehsana": "buffalo",
    "Murrah": "buffalo",
    "Nagpuri": "buffalo",
    "Nili_Ravi": "buffalo",
    "Ongole": "cow",
    "Pandharpuri": "buffalo",
    "Rathi": "cow",
    "Red_Dane": "cow",
    "Red_sindhi": "cow",
    "Sahiwal": "cow",
    "SahiwalCross": "cow",
    "Surti": "buffalo",
    "Tharparkar": "cow",
    "Toda": "buffalo",
    "Umblachery": "cow",
    "amritmahal": "cow",
    "bargur_cow": "cow",
    "hariana": "cow",
    "jersey": "cow",
    "kangyam": "cow",
    "krishna_valley": "cow",
    "nagori": "cow",
    "nimari": "cow",
    "pulikulam": "cow",
    "vechur": "cow",
}

CONFIDENCE_THRESHOLD = 0.5


@app.get("/")
def home():
    return {"message": "Breed AI Service Running"}

@app.post("/predict")
async def predict(data: dict):
    try:

        image_base64 = data.get("image")

        if not image_base64:
            return {
                "success": False,
                "error": "Image missing"
            }

        if "," in image_base64:
            image_base64 = image_base64.split(",")[1]

        image_bytes = base64.b64decode(image_base64)

        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        img = img.resize((224, 224))

        img_array = np.array(img)

        img_array = np.expand_dims(img_array, axis=0)

        img_array = preprocess_input(img_array)

        preds = model.predict(img_array)[0]

        top3_idx = preds.argsort()[-3:][::-1]

        top3 = []

        for idx in top3_idx:

            breed = LABELS[int(idx)]

            confidence = float(preds[idx])

            species = BREED_TO_SPECIES.get(breed, "unknown")

            top3.append({
                "breed": breed,
                "confidence": confidence,
                "species": species
            })

        best_idx = int(top3_idx[0])

        best_breed = LABELS[best_idx]

        best_conf = float(preds[best_idx])

        best_species = BREED_TO_SPECIES.get(best_breed, "unknown")

        if best_conf < CONFIDENCE_THRESHOLD:
            best_species = "unknown"

        return {
            "success": True,
            "species": best_species,
            "best_breed": best_breed,
            "best_confidence": best_conf,
            "top3": top3
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }