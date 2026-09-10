from fastapi import FastAPI, UploadFile, File
import tempfile
import os

from object_detection.detector import detect_objects
from ai_detection.detector import detect_ai_image

app = FastAPI()


@app.post("/detect-object")
async def detect_object(file: UploadFile = File(...)):

    suffix = os.path.splitext(file.filename)[1]

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
        temp.write(await file.read())
        temp_path = temp.name

    try:
        detections = detect_objects(temp_path)

        return {
            "success": True,
            "detections": detections
        }

    finally:
        os.remove(temp_path)


@app.post("/detect-ai-image")
async def detect_ai(file: UploadFile = File(...)):

    suffix = os.path.splitext(file.filename)[1]

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
        temp.write(await file.read())
        temp_path = temp.name

    try:
        result = detect_ai_image(temp_path)

        return {
            "success": True,
            **result
        }

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/health")
def health():
    return {
        "success": True,
        "message": "ML service is running"
    }