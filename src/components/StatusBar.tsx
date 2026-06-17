// iOS 风格状态栏 - 模拟微信小程序运行时
import { useEffect, useState } from 'react'

export default function StatusBar() {
  const [time, setTime] = useState(() => {
    const d = new Date()
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  })
  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date()
      setTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`)
    }, 30_000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="ios-status h-9 px-7 flex items-center justify-between text-[15px] font-semibold text-ink select-none">
      <span className="tracking-tight">{time}</span>
      <span className="absolute left-1/2 -translate-x-1/2 top-2 w-24 h-6 bg-ink rounded-full" />
      <span className="flex items-center gap-1.5">
        <Signal />
        <Wifi />
        <Battery />
      </span>
    </div>
  )
}

function Signal() {
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="none" aria-hidden>
      <rect x="0" y="7" width="3" height="4" rx="0.6" fill="currentColor" />
      <rect x="4.5" y="5" width="3" height="6" rx="0.6" fill="currentColor" />
      <rect x="9" y="2.5" width="3" height="8.5" rx="0.6" fill="currentColor" />
      <rect x="13.5" y="0" width="3" height="11" rx="0.6" fill="currentColor" />
    </svg>
  )
}

function Wifi() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none" aria-hidden>
      <path
        d="M8 10.5a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"
        fill="currentColor"
      />
      <path
        d="M3.2 5.2a6.8 6.8 0 0 1 9.6 0l-1.4 1.4a4.9 4.9 0 0 0-6.8 0L3.2 5.2Z"
        fill="currentColor"
      />
      <path
        d="M0 2.2a11 11 0 0 1 16 0l-1.4 1.4a9 9 0 0 0-13.2 0L0 2.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function Battery() {
  return (
    <span className="flex items-center">
      <span className="w-6 h-3 border border-ink rounded-[3px] relative inline-block">
        <span className="absolute left-[1.5px] top-[1.5px] bottom-[1.5px] w-[15px] bg-ink rounded-[1.5px]" />
      </span>
      <span className="w-[2px] h-[5px] bg-ink rounded-r ml-[1px]" />
    </span>
  )
}
