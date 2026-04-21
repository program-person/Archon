//バックエンドのSourceItem
export type SourceItem = {
    title: string
    url: string
    content: string
}

//バックエンドのSearchResponce
export type SearchResponse = {
    answer: string
    sources: SourceItem[]
}

//バックグラウンドのHistoryItem
export type HistoryItem = {
    id: number
    query: string
    answer: string
    sources: SourceItem[]
    created_at: string
}
