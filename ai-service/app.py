from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64

app = FastAPI(title="Breed Recognition AI Service")

class ImageRequest(BaseModel):
    image: str  # base64 encoded image

@app.post("/predict")
async def predict_breed(request: ImageRequest):
    try:
        if not request.image:
            raise ValueError("No image received")

        # validate base64
        base64.b64decode(request.image.split(",")[-1])

        # STATIC PREDICTION (Always works)
        return {
            "success": True,
            "predictions": [
                {"breed": "Gir", "confidence": 0.92},
                {"breed": "Sahiwal", "confidence": 0.05},
                {"breed": "Other", "confidence": 0.03}
            ]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "AI service running"}
