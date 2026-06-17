// 出行信息 - 交通 / 服务人员 / 目的地 / 须知
import { useState } from 'react'
import { Plane, Phone, Sun, MapPinned, ShieldCheck, ChevronRight, Heart, FileCheck2 } from 'lucide-react'
import MiniProgramBar from '../components/MiniProgramBar'
import SectionTitle from '../components/SectionTitle'
import { mockTrip } from '../data/mockTrip'
import { useAppStore } from '../store/useAppStore'
import type { Staff } from '../types'

type Section = 'transport' | 'staff' | 'destination' | 'tips'

const TABS: { key: Section; label: string; icon: typeof Plane }[] = [
  { key: 'transport', label: '交通', icon: Plane },
  { key: 'staff', label: '服务', icon: Phone },
  { key: 'destination', label: '目的地', icon: MapPinned },
  { key: 'tips', label: '须知', icon: ShieldCheck },
]

export default function Info() {
  const demoStage = useAppStore((s) => s.demoStage)
  const stage = demoStage === 'duringBatch' ? 'during' : demoStage
  const [section, setSection] = useState<Section>('transport')
  return (
    <div className="page-enter h-full min-h-0 flex flex-col overflow-hidden">
      <MiniProgramBar title="出行信息" />
      <div className="flex-1 min-h-0 scroll-area no-scrollbar pb-[104px]">
        {stage === 'idle' ? (
          <IdleInfo />
        ) : stage === 'before' ? (
          <BeforeInfo />
        ) : (
          <>
        {/* 切换器 */}
        <div className="px-4 pt-1">
          <div className="paper-card p-1.5 grid grid-cols-4 gap-1">
            {TABS.map((t) => {
              const Icon = t.icon
              const isActive = section === t.key
              return (
                <button
                  key={t.key}
                  onClick={() => setSection(t.key)}
                  className={`flex flex-col items-center gap-0.5 py-2 rounded-xl transition ${
                    isActive ? 'bg-cinnabar text-white' : 'text-inkSoft'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-[12px] font-semibold">{t.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 交通 */}
        {section === 'transport' && <TransportSection />}
        {/* 服务人员 */}
        {section === 'staff' && <StaffSection />}
        {/* 目的地 */}
        {section === 'destination' && <DestinationSection />}
        {/* 须知 */}
        {section === 'tips' && <TipsSection />}
          </>
        )}
      </div>
    </div>
  )
}

function BeforeInfo() {
  return (
    <>
      <div className="px-4 mt-3">
        <SectionTitle icon={FileCheck2}>行前信息确认</SectionTitle>
        <div className="paper-card p-4">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-riceDeep/60 p-3">
              <div className="t-cap">去程航班</div>
              <div className="t-h2 text-ink font-semibold mt-1">{mockTrip.transport.outbound.no}</div>
              <div className="t-cap mt-1">{mockTrip.transport.outbound.departAt}</div>
            </div>
            <div className="rounded-2xl bg-riceDeep/60 p-3">
              <div className="t-cap">座位 / 登机口</div>
              <div className="digit text-cinnabar text-[18px] mt-1">
                {mockTrip.transport.outbound.seat} / {mockTrip.transport.outbound.gate}
              </div>
              <div className="t-cap mt-1">{mockTrip.transport.outbound.terminal}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 mt-4">
        <SectionTitle icon={ShieldCheck}>出发前重点确认</SectionTitle>
        <div className="paper-card p-4">
          <ul className="space-y-2">
            {[
              '证件、医保卡、常用药是否已装包',
              '导游群消息和集合时间是否已阅读',
              '天气偏晒偏干，需备防晒和润唇膏',
              '家属联系人和紧急电话建议先收藏',
            ].map((item) => (
              <li key={item} className="flex gap-2 t-body text-ink">
                <span className="text-gold shrink-0">·</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <StaffSection />
      <DestinationSection />
    </>
  )
}

function IdleInfo() {
  return (
    <div className="px-4 mt-3">
      <div className="paper-card p-6 text-center">
        <div className="font-song t-title text-ink">当前没有可展示的订单信息</div>
        <p className="t-body text-inkSoft mt-2 leading-relaxed">
          当用户下单后，这里会出现交通、服务人员、目的地和注意事项四类信息；进行中时还会强调当前酒店、紧急电话和实时服务。
        </p>
      </div>
    </div>
  )
}

function TransportSection() {
  const t = mockTrip.transport
  return (
    <div className="px-4 mt-4 space-y-3">
      <TransportCard title="去程" leg={t.outbound} tag="出发" />
      <TransportCard title="返程" leg={t.inbound} tag="回家" />
    </div>
  )
}

function TransportCard({
  title,
  leg,
  tag,
}: {
  title: string
  leg: typeof mockTrip.transport.outbound
  tag: string
}) {
  return (
    <div className="paper-card p-4 relative overflow-hidden">
      <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full bg-gold/20" />
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Plane size={16} className="text-cinnabar" />
          <span className="font-song t-h2 text-ink font-bold">{title}</span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-cinnabar text-white">{tag}</span>
      </div>
      <div className="t-cap">{leg.no}</div>
      <div className="mt-2 flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className="t-cap">{leg.from}</div>
          <div className="digit text-ink text-[18px] leading-tight">
            {leg.departAt.split(' ')[1]}
          </div>
        </div>
        <div className="flex flex-col items-center px-1 text-inkSoft">
          <div className="digit text-[12px]">→</div>
          <div className="w-12 h-px bg-line" />
        </div>
        <div className="flex-1 min-w-0 text-right">
          <div className="t-cap">{leg.to}</div>
          <div className="digit text-ink text-[18px] leading-tight">
            {leg.arriveAt.split(' ')[1]}
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[14px]">
        <span className="t-cap">座位</span>
        <span className="digit text-cinnabar text-[18px] font-bold">{leg.seat}</span>
        {leg.gate && (
          <>
            <span className="t-cap ml-2">登机口</span>
            <span className="digit text-ink text-[16px]">{leg.gate}</span>
          </>
        )}
        {leg.terminal && (
          <span className="t-cap ml-auto">{leg.terminal}</span>
        )}
      </div>
    </div>
  )
}

function StaffSection() {
  return (
    <div className="px-4 mt-4 space-y-2.5">
      {mockTrip.staff.map((s: Staff) => (
        <div key={s.id} className="paper-card p-4 flex items-center gap-3">
          <div className="avatar-fallback w-14 h-14 rounded-full text-[22px] shrink-0">{s.avatar}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-song t-h2 text-ink font-bold">{s.name}</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded ${
                  s.role === 'guide'
                    ? 'bg-cinnabar/10 text-cinnabar'
                    : s.role === 'butler'
                    ? 'bg-mountain/10 text-mountain'
                    : s.role === 'volunteer'
                    ? 'bg-gold/15 text-gold'
                    : 'bg-inkSoft/10 text-inkSoft'
                }`}
              >
                {s.title}
              </span>
            </div>
            <div className="t-cap mt-0.5">{s.desc}</div>
            <div className="digit text-inkSoft text-[13px] mt-0.5">{s.phone}</div>
          </div>
          <a
            href={`tel:${s.phone}`}
            className="w-11 h-11 rounded-full bg-cinnabar text-white flex items-center justify-center shrink-0 active:scale-95 shadow-paper"
            aria-label={`拨打 ${s.name}`}
          >
            <Phone size={18} />
          </a>
        </div>
      ))}
    </div>
  )
}

function DestinationSection() {
  const d = mockTrip.destination
  return (
    <div className="px-4 mt-4 space-y-3">
      <SectionTitle icon={MapPinned}>{d.city}</SectionTitle>
      <div className="paper-card p-4 relative overflow-hidden">
        <div
          className="absolute right-0 top-0 w-24 h-24 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #D9A35F 0%, transparent 70%)' }}
        />
        <div className="t-cap mt-0.5">{d.region}</div>
        <p className="t-body text-inkSoft mt-2">{d.summary}</p>
      </div>
      <SubCard icon={<Sun size={18} className="text-gold" />} title="气候" data={d.climate} />
      <SubCard icon={<Heart size={18} className="text-cinnabar" />} title="风土人情" data={d.customs} />
      <SubCard
        icon={<ShieldCheck size={18} className="text-mountain" />}
        title="注意事项"
        data={d.notice}
      />
    </div>
  )
}

function SubCard({
  icon,
  title,
  data,
}: {
  icon: React.ReactNode
  title: string
  data: { summary: string; tips: string[] }
}) {
  return (
    <div className="paper-card p-4">
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <span className="font-song t-h2 text-ink font-bold">{title}</span>
      </div>
      <p className="t-body text-inkSoft leading-relaxed">{data.summary}</p>
      <ul className="mt-2 space-y-1.5">
        {data.tips.map((t, i) => (
          <li key={i} className="flex gap-2 t-body text-ink">
            <span className="text-cinnabar shrink-0">·</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function TipsSection() {
  return (
    <div className="px-4 mt-4 space-y-3">
      <SectionTitle icon={ShieldCheck}>出行须知</SectionTitle>
      <div className="paper-card p-4">
        <ul className="space-y-1.5">
          {mockTrip.tips.map((t: string, i: number) => (
            <li key={i} className="flex gap-2 t-body text-ink">
              <span className="digit text-cinnabar shrink-0 w-5">{i + 1}.</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
      <SectionTitle icon={Phone}>紧急电话</SectionTitle>
      <div className="paper-card p-4">
        <ul className="space-y-2">
          {[
            { label: '导游 张德海', phone: '138-0011-2233' },
            { label: '小管家 李筱然', phone: '139-2244-5566' },
            { label: '随团医生 王医生', phone: '137-8899-0011' },
            { label: '报警 110', phone: '110' },
            { label: '急救 120', phone: '120' },
          ].map((p) => (
            <li key={p.label} className="flex items-center justify-between">
              <span className="t-body text-ink">{p.label}</span>
              <a
                href={`tel:${p.phone}`}
                className="digit text-cinnabar text-[15px] flex items-center gap-1"
              >
                {p.phone} <ChevronRight size={14} />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <SectionTitle icon={Heart}>健康提示</SectionTitle>
      <div className="rounded-2xl p-4 bg-gradient-to-br from-gold/15 to-cinnabar/10 border border-gold/30">
        <p className="t-body text-inkSoft leading-relaxed">
          行程海拔较高，行程中有任何不适请立即告知导游或随团医生。本提示仅为参考，用药与诊疗请遵医嘱。
        </p>
      </div>
    </div>
  )
}
