// 底部 Tab 栏 - 5 个主功能
import type { TabKey } from '../types'
import { Map, Image as ImageIcon, User } from 'lucide-react'
import gongbilinLogo from '../assets/gongbilin-logo.png'

interface Props {
  active: TabKey
  onChange: (k: TabKey) => void
}

type NavTab = { key: TabKey; label: string; icon: typeof Map | 'strawberry'; color: string; bg: string; readonly?: false }
type BrandTab = { key: 'gongbilin'; label: string; icon: 'gongbilin'; color: string; bg: string; readonly: true }

const tabs: (NavTab | BrandTab)[] = [
  { key: 'trip', label: '行程', icon: Map, color: '#3A6B8A', bg: '#E9F1F5' },
  { key: 'review', label: '送草莓', icon: 'strawberry', color: '#49AFA6', bg: '#E4F6F3' },
  { key: 'gongbilin', label: '共比邻', icon: 'gongbilin', color: '#C8483B', bg: '#FCEAE7', readonly: true },
  { key: 'community', label: '风采', icon: ImageIcon, color: '#D9A35F', bg: '#FFF2DD' },
  { key: 'me', label: '我的', icon: User, color: '#7A6A8A', bg: '#F0ECF5' },
]

export default function TabBar({ active, onChange }: Props) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[86px] bg-rice/95 backdrop-blur border-t border-line/80 pb-5 pt-2 px-1 z-30 shadow-[0_-8px_20px_rgba(80,50,30,0.08)]">
      <div className="flex justify-between items-stretch h-full">
        {tabs.map((t) => {
          const Icon = t.icon
          const isActive = active === t.key
          const isBrand = t.key === 'gongbilin'
          return (
            <button
              key={t.key}
              onClick={() => !isBrand && onChange(t.key)}
              className="flex-1 flex flex-col items-center justify-center gap-1 active:scale-95 transition"
              aria-label={t.label}
              type="button"
            >
              <div
                className="w-12 h-9 flex items-center justify-center rounded-full border transition"
                style={{
                  background: isActive ? t.bg : 'transparent',
                  borderColor: isActive ? t.color : 'transparent',
                  boxShadow: isActive ? `0 6px 14px ${t.color}30` : 'none',
                }}
              >
                {Icon === 'strawberry' ? (
                  <span className="text-[24px] leading-none" style={{ filter: 'hue-rotate(95deg) saturate(1.6)' }}>🍓</span>
                ) : Icon === 'gongbilin' ? (
                  <img src={gongbilinLogo} alt="共比邻" className="h-7 w-7 rounded-full object-contain" />
                ) : (
                  <Icon
                    size={23}
                    strokeWidth={isActive ? 2.4 : 1.9}
                    style={{ color: t.color }}
                  />
                )}
              </div>
              <span
                className={`text-[13px] tracking-wide text-ink ${isActive ? 'font-semibold' : ''}`}
              >
                {t.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
