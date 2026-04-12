from fastapi import APIRouter, HTTPException
from models import SearchRequest, SearchResponse, SourceItem
from services.tavily import search_web
from services.ollama import generate_answer

#APIルーターのインスタンス化
#main.pyのapp=FastAPI()と同様の考え方
router = APIRouter()

@router.post("/search", response_model=SearchResponse)
async def serch(request: SearchRequest):
    """
    検索クエリを受け取り、web検索、LLM推論で回答を返すエンドポイント
    """

    #Tavilyでのweb検索
    try:
        search_results = await search_web(
            query=request.query,
            max_results=request.max_results,
        )
        print("Tavily結果:",search_results)
    except Exception as e:
        #検索に失敗したときは500エラーを返す
        print("Tavilyエラー：", e)
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