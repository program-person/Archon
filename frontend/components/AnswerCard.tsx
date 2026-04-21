import { SourceItem } from "@/app/types"
import SourceChip from "./SourceChip"
import Reactmarkdown from"react-markdown"

type AnswerCardProps = {
    answer: string
    sources: SourceItem[]
}

export default function AnswerCard({ answer, sources}: AnswerCardProps){
    return (
        <div className="bg-white/4 border border-white/8 rounded-2xl p-6 mb-4">
            
            {/*ヘッダー*/}
            <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#7c5cfc]" />
                    <span className="text-[10px] tracking-widnest text-[#7c5cfc] uyppercase dont-mono">
                        AI回答
                    </span>
                    <span className="text-[10px] text-white/25 font-mono ml-auto">
                        Ollama - local
                    </span>
                </div>

                {/*回答*/}
                <div className="
                    text-white/78 text-sm leading-relaxced 
                    prose prose-invert prose-sm max-w-none 
                    prose-p:my-3
                    prose-headings:mt-6 prose-headings:md-3
                    prose-li:my-1
                    prose-strong:text-white
                    mt-4
                ">
                    <Reactmarkdown>
                        {answer}
                    </Reactmarkdown>
                </div>

                {/*ソース一覧*/}
                {sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/6">
                        <div className="flex flex-wrap gap-2">
                            {sources.map((sources, i) => (
                                <SourceChip
                                key={i}
                                index={i + 1}
                                title={sources.title}
                                url={sources.title}
                            />
                            ))}    
                        </div>
                    </div>
                )}
            </div>
    )
}