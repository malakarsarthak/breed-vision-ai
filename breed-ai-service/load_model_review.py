import tensorflow as tf
from tensorflow.keras.models import load_model

MODEL_PATH = "model/epoch_04.keras"

# Load Keras model
model = load_model(MODEL_PATH)

print("\n===== KERAS MODEL LOADED SUCCESSFULLY =====\n")
model.summary()

# Output shape check
print("\nModel output shape:", model.output_shape)
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
