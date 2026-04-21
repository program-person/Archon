type SourceChipProps = {
    index: number
    title: string
    url: string
}

export default function SourceChip({ index , title, url }: SourceChipProps) {
    return (
        <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="
            flex items-center gap-1,
            bg-[#7c5cfc]/8 border border-[#7c5cfc]/20;
            rounded-md px-2 py-1 hover:bg-[#7c5cfc]/20;
            transition-colors coursor-pointer;
            "    
        >
            <span className="text-[#a78bfa] text-[9px] font-mono opacity-60">
                [{index}]
            </span>
            <span className="text-[#a78bfa] text-[11px] font-momno truncate max-w-[140px]">
                {title}
            </span>
        </a>
    )
}