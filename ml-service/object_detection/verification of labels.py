from pathlib import Path

DATASET = Path("dataset")
VALID_CLASSES = {0, 1, 2}

for split in ["train", "valid", "test"]:

    labels_dir = DATASET / split / "labels"

    for label_file in labels_dir.glob("*.txt"):

        with open(label_file, "r") as f:

            for line_no, line in enumerate(f, start=1):

                parts = line.strip().split()

                if len(parts) != 5:
                    print(
                        f"Invalid annotation: "
                        f"{label_file}:{line_no}"
                    )
                    continue

                class_id = int(parts[0])

                if class_id not in VALID_CLASSES:
                    print(
                        f"Invalid class {class_id} "
                        f"in {label_file}"
                    )

print("Validation finished.")