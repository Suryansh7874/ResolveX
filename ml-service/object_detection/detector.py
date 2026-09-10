from ultralytics import YOLO

MODEL_PATH = "object_detection/best.pt"

model = YOLO(MODEL_PATH)


def detect_objects(image_path):
    results = model(image_path)

    detections = []

    for result in results:
        if result.boxes is None:
            continue

        for box in result.boxes:
            class_id = int(box.cls[0])
            confidence = float(box.conf[0])

            object_name = result.names[class_id]

            detections.append({
                "object": object_name,
                "confidence": confidence
            })

    return detections