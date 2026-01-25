import { ImageSegmenter, FilesetResolver } from "@mediapipe/tasks-vision";

let segmenter = null;

// Load the model
export async function loadAutoCropModel() {
    if (segmenter) return segmenter;

    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    segmenter = await ImageSegmenter.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: "/models/deeplab_v3.tflite",  // your downloaded model
        },
        outputCategoryMask: true
    });

    console.log("Auto-crop model loaded");
    return segmenter;
}

// Auto-crop function
export async function autoCropImage(base64Image) {
    await loadAutoCropModel();

    return new Promise((resolve) => {
        const img = new Image();
        img.src = base64Image;
        img.onload = () => {
            const result = segmenter.segment(img);
            const mask = result.categoryMask;

            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");

            // Draw original image
            ctx.drawImage(img, 0, 0, img.width, img.height);

            const imgData = ctx.getImageData(0, 0, img.width, img.height);
            const data = imgData.data;

            // Remove background pixels
            for (let i = 0; i < mask.data.length; i++) {
                if (mask.data[i] === 0) {         // 0 = background
                    data[i * 4 + 3] = 0;            // Make pixel transparent
                }
            }

            ctx.putImageData(imgData, 0, 0);

            resolve(canvas.toDataURL("image/png"));
        };
    });
}
