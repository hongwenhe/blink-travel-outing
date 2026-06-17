import {
  ChevronRight,
  CircleHelp,
  ClipboardList,
  FileText,
  Headphones,
  MessageCircleMore,
  ReceiptText,
  ShieldCheck,
  Star,
  TicketCheck,
  UserRound,
  WalletCards,
} from 'lucide-react'
import MiniProgramBar from '../components/MiniProgramBar'
import SectionTitle from '../components/SectionTitle'
import { useAppStore } from '../store/useAppStore'
import type { TabKey } from '../types'

type Entry = {
  label: string
  desc?: string
  icon: typeof UserRound
  color: string
  bg: string
  tab?: TabKey
}

const USER = {
  name: '何老师',
  phone: '138 **** 2026',
  level: '安心出游会员',
  avatar: '何',
}

const orderEntries: Entry[] = [
  { label: '全部订单', desc: '合同 / 付款 / 凭证', icon: ClipboardList, color: '#C8483B', bg: '#FCEAE7' },
  { label: '待出行', desc: '集合与交通提醒', icon: TicketCheck, color: '#D9A35F', bg: '#FFF2DD', tab: 'trip' },
  { label: '待评价', desc: '给服务送草莓', icon: Star, color: '#49AFA6', bg: '#E4F6F3', tab: 'review' },
  { label: '售后客服', desc: '订单问题协助', icon: Headphones, color: '#5C8A8A', bg: '#E8F2F2' },
]

const supportEntries: Entry[] = [
  { label: '发票与保险', icon: ReceiptText, color: '#C8483B', bg: '#FCEAE7' },
  { label: '账号安全', icon: ShieldCheck, color: '#5C8A8A', bg: '#E8F2F2' },
  { label: '意见反馈', icon: MessageCircleMore, color: '#D9A35F', bg: '#FFF2DD' },
  { label: '常见问题', icon: CircleHelp, color: '#7A6A8A', bg: '#F0ECF5' },
]

export default function Home() {
  const setTab = useAppStore((s) => s.setTab)

  return (
    <div className="page-enter h-full min-h-0 flex flex-col overflow-hidden">
      <MiniProgramBar title="我的" />
      <div className="flex-1 min-h-0 scroll-area no-scrollbar pb-[104px]">
        <section className="px-4 pt-3">
          <div className="paper-card relative overflow-hidden p-5">
            <div
              className="absolute -right-10 -top-10 h-44 w-44 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #C8483B 0%, transparent 62%)' }}
            />
            <div
              className="absolute -left-8 bottom-0 h-32 w-32 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #D9A35F 0%, transparent 62%)' }}
            />
            <div className="relative flex items-center gap-4">
              <div className="avatar-fallback h-16 w-16 rounded-full text-[24px] shrink-0">{USER.avatar}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-song text-[24px] font-bold leading-tight text-ink">{USER.name}</h1>
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[12px] font-semibold text-gold">
                    {USER.level}
                  </span>
                </div>
                <div className="t-cap mt-1">{USER.phone}</div>
              </div>
            </div>
          </div>
        </section>

        <MenuSection title="我的订单" icon={WalletCards} entries={orderEntries} onNavigate={setTab} />

        <MenuSection title="设置与支持" icon={FileText} entries={supportEntries} onNavigate={setTab} />
      </div>
    </div>
  )
}

function MenuSection({
  title,
  icon: Icon,
  entries,
  onNavigate,
}: {
  title: string
  icon: typeof UserRound
  entries: Entry[]
  onNavigate: (tab: TabKey) => void
}) {
  return (
    <section className="px-4 mt-4">
      <SectionTitle icon={Icon}>{title}</SectionTitle>
      <div className="paper-card overflow-hidden">
        {entries.map((entry, index) => {
          const EntryIcon = entry.icon
          return (
            <button
              key={entry.label}
              onClick={() => entry.tab && onNavigate(entry.tab)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-riceDeep/50 ${index > 0 ? 'border-t border-line/70' : ''}`}
            >
              <div
                className="h-10 w-10 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: entry.bg }}
              >
                <EntryIcon size={18} style={{ color: entry.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="t-body font-semibold text-ink leading-tight">{entry.label}</div>
                {entry.desc && <div className="t-cap mt-0.5 truncate">{entry.desc}</div>}
              </div>
              <ChevronRight size={18} className="text-fog shrink-0" />
            </button>
          )
        })}
      </div>
    </section>
  )
}
