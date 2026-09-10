from pathlib import Path
import shutil

BASE = Path(__file__).parent

POTHOLE_DATASET = BASE / "raw_datasets" / "pothole"
STREETLIGHT_DATASET = BASE / "raw_datasets" / "streetlight"
OUTPUT_DATASET = BASE / "dataset"

SPLITS = ["train", "valid", "test"]


def process_iit_labels(src_label, dst_label):
    """
    IIT classes:
        0 = pothole
        1 = crocodile crack
        2 = longitudinal crack

    Final classes:
        0 = pothole
        1 = road_damage
        2 = streetlight
    """

    new_lines = []

    with open(src_label, "r") as f:
        for line in f:
            parts = line.strip().split()

            if len(parts) != 5:
                continue

            class_id = int(parts[0])

            # pothole -> 0
            if class_id == 0:
                new_class = 0

            # both crack classes -> road_damage = 1
            elif class_id in (1, 2):
                new_class = 1

            else:
                print(f"WARNING: unexpected IIT class {class_id}")
                continue

            parts[0] = str(new_class)
            new_lines.append(" ".join(parts))

    with open(dst_label, "w") as f:
        f.write("\n".join(new_lines))


def process_streetlight_labels(src_label, dst_label):
    """
    EJCH:
        0 = Street_Light

    Final:
        2 = streetlight
    """

    new_lines = []

    with open(src_label, "r") as f:
        for line in f:
            parts = line.strip().split()

            if len(parts) != 5:
                continue

            class_id = int(parts[0])

            if class_id != 0:
                print(
                    f"WARNING: unexpected Streetlight class {class_id}"
                )
                continue

            parts[0] = "2"
            new_lines.append(" ".join(parts))

    with open(dst_label, "w") as f:
        f.write("\n".join(new_lines))


def copy_iit_dataset():

    for split in SPLITS:

        src_images = POTHOLE_DATASET / split / "images"
        src_labels = POTHOLE_DATASET / split / "labels"

        dst_images = OUTPUT_DATASET / split / "images"
        dst_labels = OUTPUT_DATASET / split / "labels"

        dst_images.mkdir(parents=True, exist_ok=True)
        dst_labels.mkdir(parents=True, exist_ok=True)

        for image in src_images.iterdir():

            if not image.is_file():
                continue

            shutil.copy2(image, dst_images / image.name)

            label = src_labels / f"{image.stem}.txt"

            if label.exists():
                process_iit_labels(
                    label,
                    dst_labels / label.name
                )


def copy_streetlight_dataset():

    for split in SPLITS:

        src_images = STREETLIGHT_DATASET / split / "images"
        src_labels = STREETLIGHT_DATASET / split / "labels"

        dst_images = OUTPUT_DATASET / split / "images"
        dst_labels = OUTPUT_DATASET / split / "labels"

        dst_images.mkdir(parents=True, exist_ok=True)
        dst_labels.mkdir(parents=True, exist_ok=True)

        for image in src_images.iterdir():

            if not image.is_file():
                continue

            # Since you confirmed filenames do not collide,
            # direct copying is fine.
            shutil.copy2(image, dst_images / image.name)

            label = src_labels / f"{image.stem}.txt"

            if label.exists():
                process_streetlight_labels(
                    label,
                    dst_labels / label.name
                )


if __name__ == "__main__":

    print("Preparing IIT Madras dataset...")
    copy_iit_dataset()

    print("Preparing Streetlight dataset...")
    copy_streetlight_dataset()

    print("\nDataset preparation completed.")