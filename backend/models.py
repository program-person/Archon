from pydantic import BaseModel
from typing import Any

class SearchRequest(BaseModel):
    """
    searchエンドポイントが受け取るデータの形
    フロントから{"query":"検索したい文字列"}が送られる
    """
    query: str
    max_results: int = 5

#レスポンスの型定義
class SourceItem(BaseModel):
    """
    回答の根拠となったwebページ1件分の情報
    """
    title: str 
    url: str
    content: str

class SearchResponse(BaseModel):
    """
    /searchエンドポイントが返すデータの形
    """
    answer: str
    sources: list[SourceItem]
    
    