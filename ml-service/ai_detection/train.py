from ultralytics import YOLO

def main():
    model = YOLO("yolo26n-cls.pt")

    model.train(
        data="dataset",
        epochs=50,
        imgsz=224,
        batch=32,
        project="runs",
        name="ai_detector"
    )

if __name__ == "__main__":
    main()