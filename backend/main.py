from apscheduler.schedulers.background import BackgroundScheduler
from services.asset_logger import log_asset
from services.asset_reader import read_asset_history
from exchange.okx import get_okx_balance
from fastapi import FastAPI
from contextlib import asynccontextmanager

scheduler = BackgroundScheduler()

def save_asset_snapshot():
    try:
        balance = get_okx_balance()
        total_asset = balance["USDT"]
        log_asset(total_asset)
        print(f"Snapshot saved: {total_asset}")
    except Exception as e:
        print(f"Snapshot error: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    save_asset_snapshot()
    scheduler.add_job(save_asset_snapshot, "interval", minutes=5)
    scheduler.start()
    yield
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)

@app.get("/")
def root():
    return {"message": "API running"}

@app.get("/history")
def history():
    return read_asset_history()