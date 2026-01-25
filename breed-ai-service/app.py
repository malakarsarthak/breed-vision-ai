from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from PIL import Image
import io, base64
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.efficientnet_v2 import preprocess_input

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MODEL_PATH = "model/best_effv2s_fulltrain.keras"
MODEL_PATH = "model/epoch_04.keras"

model = load_model(MODEL_PATH)
model.summary()

# --------------------------------------
# LABELS: order must match your training
# --------------------------------------
LABELS = [line.strip() for line in open("labels.txt").read().splitlines()]

# BREED -> SPECIES MAPPING
# (keys MUST match strings in labels.txt)

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

CONFIDENCE_THRESHOLD = 0.5  # you can tune this


@app.post("/predict")
async def predict(data: dict):
    try:
        image_base64 = data.get("image")
        if not image_base64:
            return {"success": False, "error": "Image missing"}

        # Strip base64 prefix if present (e.g. "data:image/jpeg;base64,...")
        if "," in image_base64:
            base64_data = image_base64.split(",")[1]
        else:
            base64_data = image_base64

        image_bytes = base64.b64decode(base64_data)

        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize((224, 224))
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = preprocess_input(img_array)

        preds = model.predict(img_array)[0]  # shape: (num_classes,)

        # Top-3 predictions (highest -> lowest)
        top3_idx = preds.argsort()[-3:][::-1]
        top3_conf = preds[top3_idx]

        top3 = [
            {
                "breed": LABELS[int(idx)],
                "confidence": float(conf),
                "species": BREED_TO_SPECIES.get(LABELS[int(idx)], "unknown"),
            }
            for idx, conf in zip(top3_idx, top3_conf)
        ]

        # Top-1 prediction
        best_idx = int(top3_idx[0])
        best_conf = float(top3_conf[0])
        best_breed = LABELS[best_idx]
        best_species = BREED_TO_SPECIES.get(best_breed, "unknown")

        # If confidence is very low, you can flag as unknown
        if best_conf < CONFIDENCE_THRESHOLD:
            best_species = "unknown"

        return {
            "success": True,
            "species": best_species,          # cow / buffalo / unknown
            "best_breed": best_breed,         # e.g. "Gir_Cow"
            "best_confidence": best_conf,
            "top3": top3,                     # list of top-3 with species
        }

    except Exception as e:
        return {"success": False, "error": str(e)}