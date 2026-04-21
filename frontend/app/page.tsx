'use client'//Nest.jsでブラウザ側で動かすための宣言

import { useState} from 'react'
import { SearchResponse, HistoryItem } from './types'
import Searchbar from '@/components/SearchBar'
import AnswerCard from '@/components/AnswerCard'
import Sidebar from '@/components/Sidebar'

export default function Home() {
  //--状態管理--
  //useStateは「変化する値」を管理する
  //[現在の値,値を変える関数]という形で使う

  const [query, setQuery] = useState('') //検索クエリ
  const [answer, setAnswer] = useState<SearchResponse | null>(null) //回答
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsloading] = useState(false)//ローディング状態
  const [isSidebarOpen, setisSidebarOpen] = useState(false)//サイドバーの状態

  //検索処理
  const handleSearch = async (searchQuery: string) => {
    if(!searchQuery.trim()) return

    setIsloading(true)
    setAnswer(null)

    try{
      //FastApiの/searchエンドポイントをたたく
      const res = await fetch("http://localhost:8000/search",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({query: searchQuery, max_results: 3}),
      })
      if (!res.ok) throw new Error("検索に失敗しました")

        const data: SearchResponse = await res.json()
        setAnswer(data)

        //履歴に保存
        await saveHistory(searchQuery, data)
    } catch (err) {
      console.error(err)
    } finally{
      setIsloading(false)
    }
  }

  //履歴保存
  const saveHistory = async (q: string, data: SearchResponse) =>{
    try{
      await fetch("http://localhost:8000/history",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          query: q,
          answer: data.answer,
          sources: data.sources,
        }),
      })
      //保存後に履歴一覧を再取得
      await fetchHistory()
    }catch (err){
      console.error("履歴保存エラー", err)
    }
  }

  //履歴の取得
  const fetchHistory = async () => {
    try{
      const res =await fetch("http://localhost:8000/history")
      const data: HistoryItem[] = await res.json()
      setHistory(data)
    }catch (err){
      console.error("履歴取得エラー", err)
    }
  }

  //履歴クリック
  const handleHistoryClick = (item: HistoryItem) => {
    setQuery(item.query)
    setAnswer({answer: item.answer, sources: item.sources})
    setisSidebarOpen(false)
  }

  //履歴の削除
  const handleDeleteHistory = async (id: number) => {
    try{
      await fetch('http://localhost:8000/history/${id}',{method: "DELETE"})
      await fetchHistory()
    }catch(err){
      console.error("履歴削除エラー", err)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden">
      {/*背景グリッド*/}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg, rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/*背景グロー*/}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,60,255,0.18), transparent)] pointer-events-none" />

      {/*サイドバー*/}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setisSidebarOpen(false)}
        history={history}
        onHistoryClick={handleHistoryClick}
        onDeleteHistory={handleDeleteHistory}
        onNewSearch={() => {
          setQuery("")
          setAnswer(null)
          setisSidebarOpen(false)
      }}
      />

      {/*メインコンテンツ*/}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/*ナビバー*/}
        <nav className="flex items-center justify-between px-6 py-4 border-b border-white/7">
          <div className="flex items-center gap-4">
            {/*ハンバーガーボタン*/}
            <button
              onClick={() => {
                setisSidebarOpen(true)
                fetchHistory() //サイドバーを開くたびに最新りれきを取得
              }}
              className="flex flex-col gap-1 p-1 hover:opacity-70 transition-opacity"
              >
                <span className="block w-[18px] h-[1.5px] bg-white/70 rounded" />
                <span className="block w-[18px] h-[1.5px] bg-white/70 rounded" />
                <span className="block w-[18px] h-[1.5px] bg-white/70 rounded" />
              </button>
              <span className="text-base font-extrabold tracking-wider uppercase">
                ARCH<span className="text-[#7c5cfc]">ON</span>
              </span>
          </div>
        </nav>

        {/*ヒーローエリア*/}
        <div className="flex flex-col items-center px-6 pt-12 pb-16">
          <div className="text-xs tracking-widet text-[#a78bfa] border border-[#7c5cfc]/35 bg-[#7c5cfc]/15 px-3 py-1 rounded-full mb-5 font-mono">
              Local AI ・ Powered by Ollama
          </div>
          <h1 className="text-4xl font-extrabold text-center tracking-tight mb-2">
            知を、 <span className="bg-gradient-to-r from-[#7c5cfc] to-[#a78bfa] bg-clip-text text-transparent">検索する。</span>
          </h1>
          <p className="text-white/30 text-sm mb-8">Web検索 ×　ローカルLLM推論</p>
          
          {/*検索バー*/}
          <Searchbar
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </div>

        {/*回答エリア*/}
        <div className="w-full max-w-2xl mx-auto px-6 pb-8">
          {isLoading && (
            <div className="bg-white/4 border border-white/8 rounded-2xl p-6 mb-4 w-full max-w-2xl ml-auto mr-8">
              {/*ヘッダー部分のスケルトン*/}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#7c5cfc] animate-pulse" />
                <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                <div className="h-3 w-24 bg-white/6 rounded animate-pulse ml-auto" />
              </div>
              {/*テキスト部分のスケルトン*/}
              <div className="space-y-3">
                <div className="h-3 bg-white/10 rounded animate-pulse w-full" />
                <div className="h-3 bg-white/10 rounded animate-pulse w-5/6" />
                <div className="h-3 bg-white/10 rounded animate-pulse w-4/6" />
                <div className="h-3 bg-white/8 rounded animate-pulse w-full mt-4" />
                <div className="h-3 bg-white/8 rounded animate-pulse w-3/4" />
              </div>
              {/*ソース部分のスケルトン*/}
              <div className="mt-6 pt-3 border-t border-white/6 flex gap-2">
                <div className="h-6 w-24 bg-white/6 rounded-md animate-pulse" />
                <div className="h-6 w-20 bg-white/6 rounded-md animate-pulse" />
                <div className="h-6 w-28 bg-white/6 rounded-md animate-pulse" />
              </div>
              {/*検索中テキスト*/}
              <div className="flex items-center gap-2 mt-4">
                <div className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc] animate-bounce" style={{animationDelay: "0ms"}} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc] animate-bounce" style={{animationDelay: "150ms"}} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#7c5cfc] animate-bounce" style={{animationDelay: "300ms" }} />
                <span className="text-xs text-white/30 font-mono ml-1">検索・推論中...</span>
              </div>
            </div>
          )}
          {answer &&(
            <AnswerCard answer={answer.answer} sources={answer.sources} />
          )}
        </div>
      </div>
    </div> 
  )
} 
