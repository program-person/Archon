import os 
from dotenv import load_dotenv
from tavily import TavilyClient\

load_dotenv()
#.envのapikeyを読みこむ
client = TavilyClient(api_key = os.getenv("TAVILY_API_KEY"))

async def search_web(query: str, max_results:int = 5) -> list[dict]:
    """
    クエリを受け取ってweb検索し、結果のリストを返す関数

    引数:
        query      :検索クエリ("Rustとは何か")np
        max_results:取得する検索結果の件数(5件)
    戻り値:
        [
            {
                "title"  :記事タイトル,
                "url"    :記事のURL,
                "content":記事の抜粋
            },
            ...
        ]
    """
    #Taivilyに検索リクエストを送信
    ##search_deph="basic"で無料枠の消費を抑える
    response = client.search(
        query = query,
        search_depth = "basic",
        max_results = max_results
    )
    #responseの中のresiltsキーに検索結果のリストがあるのでその必要項目だけを返す
    results = []
    for item in response["results"]:
        results.append({
            "title"  : item.get("title", ""),
            "url"    : item.get("url", ""),
            "content": item.get("content", "")
        })
    return results