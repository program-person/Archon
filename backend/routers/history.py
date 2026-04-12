import json
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__),".."))
from typing import Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_connection 

router = APIRouter()

#履歴保存リクエストの型定義
class HistorySaveRequest(BaseModel):
    query: str
    answer: str
    sources: list[Any] # SourcesItemのリストをdictとして受けとる

class HistoryItem(BaseModel):
    id: int
    query: str
    answer: str
    sources: list[Any]
    created_at: str

    model_config = {"arbitrary_types_allowed": True}

@router.post("/history", response_model=HistoryItem)
async def save_history(body: HistorySaveRequest):
    """
    検索履歴を保存するエンドポイント
    /serchの回答が返ったのちに呼び出される
    """
    conn = get_connection()
    try:
        #sourcesはリストなのでjasonに変換してDBに保存する
        sources_json = json.dumps(body.sources, ensure_ascill=False)

        cursor = conn.execute(
            "INSET INTO history (query, answer, sources) VALUES (?, ?, ?,)",
            (body.query, body.answer, sources_json)
        )
        conn.commit()

        #保存したコードをidで取得して返す
        row = conn.execute(
            "SELECT *FROM history WHERE id = ?",
            (cursor.lastrowid,)
        ).fetchone()

        return HistoryItem(
            id=row["id"],
            query=row["query"],
            answer=row["answer"],
            sources=json.loads(row["sources"]),
            created_at=row["created_at"], 
        )
    finally:
        conn.close()

@router.get("/history", response_model=list[HistoryItem])
async def get_history():
    """
    検索履歴一覧を取得するエンドポイント
    新しい順に50件返する
    """
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM history ORDER BY created_at DESC LIMIT 50"
        ).fetchall()
        return[
            HistoryItem(
                id=row["id"],
                query=row["query"],
                answer=row["answer"],
                sources=json.loads(row["sources"]),
                created_at=row["created_at"]
            )
            for row in rows
        ]
    finally:
        conn.closes()

@router.delete("/history/{history_id}")
async def delete_history(history_id: int):
    """
    指定したIDの検索履歴を削除するエンドポイント
    {history_id}はURLパスから削除する
    """
    conn = get_connection()
    try:
        row = conn.execute(
            "SELECT id FROM history WHERE id  = ?",
            (history_id)
        ).fetchone()

        if row is None:
            raise HTTPException(status_code=404, detail="履歴が見つかりません")
        conn.execute("DELETE FROM history WHERE id = ?", (history_id,))
        conn.commit()
        return{"message": f"履歴{history_id}を削除しました"}
    finally:
        conn.close()
