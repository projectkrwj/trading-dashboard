import csv
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "asset_history.csv")

def read_asset_history():
    data = []

    if not os.path.isfile(CSV_PATH):
        return data

    with open(CSV_PATH, "r", newline="") as file:
        reader = csv.DictReader(file)

        for row in reader:
            data.append({
                "date": row["date"],
                "total_asset": float(row["total_asset"])
            })

    return data