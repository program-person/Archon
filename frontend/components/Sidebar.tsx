"use client"

import {HistoryItem} from "@/app/types"
import { discoverValidationDepths } from "next/dist/server/app-render/instant-validation/instant-validation"

type SidebarProps = {
    isOpen: boolean
    onClose: () => void
    history: HistoryItem[]
    onHistoryClick: (item: HistoryItem) => void
    onDeleteHistory: (id: number) => void
    onNewSearch: () => void
}

export default function Sidebar({
    isOpen,
    onClose,
    history,
    onHistoryClick,
    onDeleteHistory,
    onNewSearch,
}: SidebarProps) {

    const getDateLabel = (dateStr: string) => {
        const date = new Date(dateStr)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffHours = diffMs / (1000 * 60 * 60)
        const diffDays = diffMs / (1000 * 60 * 60 * 24)
        
        if(diffHours < 24) return "今日"
        if (diffDays < 2) return "昨日"
        if (diffDays < 7) return "今週"
        return "それ以前"
    }

    const grouped = history.reduce((acc,item) => {
        const label = getDateLabel(item.created_at)
        if (!acc[label]) acc[label] = []
        acc[label].push(item)
        return acc
    }, {} as Record<string, HistoryItem[]>)
    const groupOrder = ["今日","昨日","今週","それ以前"]
    
    return (
        <>
        {/*オーバーレイ*/}
        {isOpen && (
            <div 
                className="fixed inset-0 bg-black/55 z-10"
                onClick={onClose}
            />
        )}

        {/*サイドバー本体*/}
        <div className={'fixed left-0 top-0 bottom-0 w-[260px] bg-[#0f0f17] border-r border-white/8 z-20 flex flex-col transition-transform duratio-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}'}
        >
                
            {/*ヘッダー*/}
            <div className="flex items-center justify-between px-4 py-[18px] border-b border-white/7">
                <span className="text-sm font-extrabold tracking-widset uppercase">
                     ARCH<span className="text-[#7c5cfc]">ON</span>
                </span>
                <button
                    onClick={onClose}
                    className="text-white/40 hover:text-white text-lg leading-none transition-colors"
                >
                    ×
                </button>
            </div>
                    
            {/*あたらしい検索ボタン*/}
            <button
                onClick={onNewSearch}
                className="
                    mx-3 my-3 flex items-center gap-2
                    bg-[#7c5cfc]/12 border border-[#7c5cfc]/30
                    rounded-lg px-4 py-[10px]
                    text-white/65 text-xs hover:bg-[#7c5cfc]/20
                    transition-colors
                "
            >
                <span className="text-[#7c5cfc] text-sm">＋</span>
                新しい検索
            </button>

            {/*履歴リスト*/}
            <div className="flex-1 overflow-y-auto px-2 pb-4">
                {history.length === 0 ? (
                    <p className="text-white/25 text-xs text-center mt-8 font-mono">
                        検索はまだありません
                    </p>
            ) : (
                    groupOrder.map(label => {
                        const items = grouped[label]
                        if (!items) return null
                        return (
                            <div key={label}>
                                {/*グループラベル*/}
                                <div className="px-2 pt-4 pb-2 text-[10px] tracking-widest text-white/25 uppercase font-mono">
                                    {label}
                                </div>
                                {/*履歴アイテム*/}
                                {items.map(item => (
                                    <div
                                        key={item.id}
                                        className="group flex items-center justify-betweenpx-2 py-2 rounded-lg hover:bg-white/6 coursor-pointer mb-0.5 transition-colors"
                                    >
                                        <div
                                            className="flex-1 min-w-0"
                                            onClick={() => onHistoryClick(item)}
                                        >
                                            <p className="text-xs text-white/65 truncat6e leading-tight">
                                                {item.query}
                                            </p>
                                            <p className="text-[10px] text-white/22 font-mono mt-0.5">
                                                {new Date(item.created_at).toLocaleString("ja-JP",{
                                                    month: "numeric",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                        {/*さくじょボタン*/}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                onDeleteHistory(item.id)
                                            }}
                                            className="opacity-0 group-hover:opacity-100 text-white/30 hover: text-red-400 text-xs ml-2 transition-all"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )
                    })
                )}
             </div>
            {/*フッター*/}
            <div className="px-3 py-4">
                <div className="flex items-center gap-2 bg-white/4 rounded-lg px-3 py-2">
                    <div className="w-[7px] h-[7px]rounded-full bg-emerald-400 flex-shrink-0" />
                    <span className="text-[11px] text-white/45 font-mono">
                        Ollama ・ ローカル稼働中
                    </span>
                </div>
            </div> 

        </div>
    </>
    )
}