from exchange.okx import get_okx_balance
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "API running"}

@app.get("/balance")
def balance():
    return get_okx_balance()