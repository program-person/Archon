from fastapi import APIRouter, HTTPException
from models import SearchRequest, SearchResponse, SourceItem
from services.tavily import search_web
from services.ollama import generate_answer
from database import get_connection, increment_usage, get_monthly_usage

#APIルーターのインスタンス化
#main.pyのapp=FastAPI()と同様の考え方
router = APIRouter()

#上限回数の定義
MONTHLY_LIMIT = 1000
WARNING_THRESHOLD = 900

@router.post("/search", response_model=SearchResponse)
async def serch(request: SearchRequest):
    """
    検索クエリを受け取り、web検索、LLM推論で回答を返すエンドポイント
    """
    current_usage = get_monthly_usage()
    if current_usage >= MONTHLY_LIMIT:
        raise HTTPException(
            status_code = 429,
            detail=f"今月のTavily API使用回数が上限({MONTHLY_LIMIT}回)に達しました"
        )

    #Tavilyでのweb検索
    try:
        search_results = await search_web(
            query=request.query,
            max_results=request.max_results,
        )
        #検索成功時にカウントをふやす
        increment_usage()

    except Exception as e:
        #検索に失敗したときは500エラーを返す
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500,detail=f"検索エラー：{str(e)}")
    
    #ollamaで回答を作成
    try:
        answer = await generate_answer(
            query=request.query,
            search_results=search_results,
        )
        print("Ollama回答：", answer)
    except Exception as e:
        import traceback
        print("Ollamaエラー：")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"回答生成エラー：{str(e)}")

    #レスポンスを組みたてて返す
    sources = [
        SourceItem(
            title=r["title"],
            url=r["url"],
            content=r["content"] 
        ) for r in search_results
    ]

    return SearchResponse(answer=answer, sources=sources)