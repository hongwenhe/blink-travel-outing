// 微信小程序胶囊 - 模拟原生导航右上角
export default function MiniProgramBar({ title }: { title?: string }) {
  return (
    <div className="h-11 px-4 flex items-center justify-between relative">
      <div className="w-9 h-9 flex items-center justify-center -ml-2">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
          <path
            d="M14 5H8a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z"
            stroke="#2A2A2A"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path d="M8 11h6" stroke="#2A2A2A" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      {title && (
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-[17px] font-semibold text-ink tracking-wide font-song">
          {title}
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <div className="w-9 h-9 rounded-full bg-rice border border-line flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
            <circle cx="9" cy="9" r="7" stroke="#2A2A2A" strokeWidth="1.5" />
            <path d="M5.5 5.5 12.5 12.5M12.5 5.5 5.5 12.5" stroke="#2A2A2A" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="px-2.5 h-9 rounded-full bg-rice border border-line flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-ink" />
          <span className="w-1 h-1 rounded-full bg-ink" />
          <span className="w-1 h-1 rounded-full bg-ink" />
        </div>
      </div>
    </div>
  )
}
