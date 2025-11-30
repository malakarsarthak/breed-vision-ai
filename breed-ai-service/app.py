from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import torch
import torchvision.transforms as transforms
from PIL import Image
import io, base64
import torch.serialization
from torchvision.models.resnet import ResNet

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

torch.serialization.add_safe_globals([ResNet])

MODEL_PATH = "model/bovinebreedclassifier.pt"

model = torch.load(MODEL_PATH, map_location="cpu", weights_only=False)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

LABELS = [line.strip() for line in open("labels.txt").read().splitlines()]

@app.post("/predict")
async def predict(data: dict):
    try:
        image_base64 = data.get("image")
        if not image_base64:
            return {"success": False, "error": "Image missing"}

        base64_data = image_base64.split(",")[1]
        image_bytes = base64.b64decode(base64_data)

        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img_tensor = transform(img).unsqueeze(0)

        with torch.no_grad():
            outputs = model(img_tensor)

        probs = torch.softmax(outputs, dim=1)
        confidence, pred_idx = torch.max(probs, 1)

        pred_idx = pred_idx.item()
        if pred_idx >= len(LABELS):
            return {
                "success": False,
                "error": f"Model predicted index {pred_idx}, but only {len(LABELS)} labels available"
            }

        return {
            "success": True,
            "breed": LABELS[pred_idx],
            "confidence": float(confidence.item())
        }

    except Exception as e:
        return {"success": False, "error": str(e)}

