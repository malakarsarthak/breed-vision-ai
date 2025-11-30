import os

# CHANGE THIS PATH TO YOUR LABEL DATASET FOLDER
BASE = r"D:\archive (1)\Indian_bovine_breeds\Indian_bovine_breeds"

all_labels = []

for animal_type in ["cattle", "buffalo"]:
    path = os.path.join(BASE, animal_type)
    if not os.path.exists(path):
        print("Path not found:", path)
        continue

    breeds = sorted(os.listdir(path))
    for b in breeds:
        folder = os.path.join(path, b)
        if os.path.isdir(folder):
            all_labels.append(b)

with open("labels.txt", "w") as f:
    for label in all_labels:
        f.write(label + "\n")

print("Labels saved to labels.txt")
print("Total:", len(all_labels))
print(all_labels)
