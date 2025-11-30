import torch
import torch.serialization
from torchvision.models.resnet import ResNet

torch.serialization.add_safe_globals([ResNet])

MODEL_PATH = "model/bovinebreedclassifier.pt"

model = torch.load(MODEL_PATH, map_location="cpu", weights_only=False)
print("\n===== MODEL LOADED SUCCESSFULLY =====\n")
print(model)

# Inspect output layer
try:
    if hasattr(model, "fc"):
        print("\nFinal Layer Shape:", model.fc)
    elif hasattr(model, "classifier"):
        print("\nFinal Layer Shape:", model.classifier)
except:
    pass
