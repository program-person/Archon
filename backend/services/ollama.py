import os
import httpx
from dotenv import load_dotenv

load_dotenv()

Ollama_Base_URL = os.getenv("OLLAMA_BASE_URL","http://localhost:11434")
Ollama_Model = os.getenv("OLLAMA_MODEL","qwen3")

async def generate_answer(query: str,search_results: list[dict]) -> str:
    """
    検索結果とクエリを受け取り、ollamaが回答を生成し、返す関数
    
    引数:
    query        :ユーザーの質問
    search_results: 検索結果のリスト
    戻り値：
        ollamaが生成した回答
    """

    #検索結果を番号付きテキストに整形し、プロンプトに埋め込み

    context = ""
    for i, result in enumerate(search_results, start = 1):
        context += f"[{i}] {result['title']}\n"
        context += f"{result['url']}\n"
        context += f"{result['content']}\n\n"

    prompt = f"""以下の検索結果情報をもとに、質問に対して日本語で回答してください。
    回答中に参照した情報には[1],[2のように番号を付与してください。
    質問: {query}
    検索結果: {context}
    【回答】"""

    #OllamaのResr APIにPOSTリクエストを送信
    #/api/generate　エンドポイントがテキスト生成を担当
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            f"{Ollama_Base_URL}/api/generate",
            json = {
                "model" : Ollama_Model,
                "prompt" : prompt,
                "stream" : False,
            },
        )
        response.raise_for_status()
    
    #れすっぽんすのjsonから回答のテキストのみ取り出す
    return response.json()["response"]