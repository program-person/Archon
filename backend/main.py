import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from routers import search, history
from database import init_db
import sqlite3


#.envファイルを読み込む
load_dotenv()
init_db()

#fastapiのインスタンスを作成
app = FastAPI(
    title = "Archon API",
    description = "Web検索　×　LLLM推論システム",
    version = "0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:3000"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(search.router)
app.include_router(history.router)

@app.get("/")
async def health_check():
    return{
        "status": "ok",
    }
