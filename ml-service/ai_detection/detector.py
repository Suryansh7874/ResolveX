from ultralytics import YOLO

MODEL_PATH = "ai_detection/best.pt"

model = YOLO(MODEL_PATH)


def detect_ai_image(image_path):

    results = model(image_path)

    result = results[0]

    probabilities = result.probs

    top1_index = int(probabilities.top1)
    confidence = float(probabilities.top1conf)

    class_name = result.names[top1_index]

    return {
        "result": class_name,
        "confidence": confidence
    }