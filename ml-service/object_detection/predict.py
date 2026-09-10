from ultralytics import YOLO

model = YOLO(
    "runs/resolvex_3class/weights/best.pt"
)

results = model.predict(
    source="test_image.jpg",
    conf=0.40,
    save=True
)

for result in results:

    for box in result.boxes:

        class_id = int(box.cls[0])
        confidence = float(box.conf[0])

        class_name = result.names[class_id]

        print(
            class_name,
            confidence
        )