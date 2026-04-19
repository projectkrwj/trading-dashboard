import csv
import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "asset_history.csv")

def log_asset(total_asset):
    today = datetime.now().strftime("%Y-%m-%d")
    rows = []
    found = False

    if os.path.isfile(CSV_PATH):
        with open(CSV_PATH, "r", newline="") as file:
            reader = csv.reader(file)
            rows = list(reader)

        for i in range(1, len(rows)):
            if rows[i][0] == today:
                rows[i][1] = total_asset
                found = True
                break

    if not found:
        if not rows:
            rows.append(["date", "total_asset"])
        rows.append([today, total_asset])

    with open(CSV_PATH, "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerows(rows)

    return True