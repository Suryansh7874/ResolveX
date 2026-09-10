from ultralytics import YOLO

model = YOLO("best.pt")

result = model("test.jpg")

for r in result:
    print(r.probs)