from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
from services.tavily import search_web
from services.ollama import generate_answer

#.envファイルを読み込む
load_dotenv()

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


@app.get("/")
async def health_check():
    return{
        "status": "ok",
        "model": os.getenv("OLLAMA_MODEL")
    }

@app.get("/test-ollama")
async def test_ollama():
    #ダミーの検索結果を渡します
    dummy_results = [
        {
            "title"  : "Rust公式サイト",
            "url"    : "https://rust-lang.org",
            "content": "Rustはメモリ安全性をコンパイル時に保証するシステムプログラミング言語です。",   
        }
    ]
    answer = await generate_answer("Rustとは何か", dummy_results)
    return{"answer" : answer}
