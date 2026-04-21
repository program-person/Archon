'use client'

//propsの型定義
type SearchBarProps = {
    query: string
    setQuery: (value: string) => void
    onSearch: (query: string) => void
    isLoading: boolean
}

export default function Searchbar({query, setQuery, onSearch, isLoading}: SearchBarProps) {

    //Enterで検索できるように
    const handlekeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>  {
        if (e.key === "Enter"){
            onSearch(query)
        }
    }

    return (
        <div className="w-full max-w-[600px] relative">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handlekeyDown}
                placeholder="なんでも"
                disabled={isLoading}
                className="
                    w-full bg-white/6 border border-white/12 rounded-xl
                    py-4 pl-5 pr-14 text-white test-sm
                    placeholder: text-white/22
                    focus: outline-none focus: border-[#7c5cfc]/60
                    disabled: opacity-50 transition-colors
                "
            />

            <button
                onClick={() => onSearch(query)}
                disabled={isLoading}
                className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    bg-[#7c5cfc] hover: bg-[#6d4de8] disabled: opacoity-50
                    rounded-lg w-8 h-8 flex items-center justify-center
                    transition-colors
                "
            >
                <svg
                    width="13" height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
            </button>
        </div>
    )
}