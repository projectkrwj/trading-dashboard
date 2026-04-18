import ccxt
import os
from dotenv import load_dotenv

load_dotenv()

def get_okx_balance():
    exchange = ccxt.okx({
        "apiKey": os.getenv("OKX_API_KEY"),
        "secret": os.getenv("OKX_SECRET"),
        "password": os.getenv("OKX_PASSPHRASE"),
    })

    balance = exchange.fetch_balance()

    return {
            "USDT": balance["total"].get("USDT", 0),
            "BTC": balance["total"].get("BTC", 0)
        }