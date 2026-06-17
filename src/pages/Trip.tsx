// 行程页 - 按天折叠的时间轴
import { useMemo, useState } from 'react'
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ArrowRight,
  CalendarClock,
  Luggage,
  Plane,
  PhoneCall,
  Users,
  Map,
  Trophy,
  CheckCircle2,
  Share2,
  X,
} from 'lucide-react'
import MiniProgramBar from '../components/MiniProgramBar'
import SectionTitle from '../components/SectionTitle'
import { mockTrip } from '../data/mockTrip'
import { useAppStore } from '../store/useAppStore'
import type { ItemType, ItineraryItem, Staff, TripDay } from '../types'

type BeforeTripContact = {
  title: string
  name: string
  roleLabel: string
  phone: string
  desc: string
  photo: string
}

type ItineraryPreviewItem = {
  dayLabel: string
  title: string
  meta: string
}

type DuringLeaderboardItem = {
  name: string
  posts: number
  likes: number
  avatar: string
}

const aiImage = (prompt: string, imageSize: string = 'landscape_16_9') =>
  `https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`

const TYPE_LABEL: Record<ItemType, string> = {
  transport: '交通',
  meal: '餐食',
  hotel: '住宿',
  spot: '景点',
  free: '自由',
}

const TYPE_COLOR: Record<ItemType, string> = {
  transport: '#3A6B8A',
  meal: '#D9A35F',
  hotel: '#7A6A8A',
  spot: '#C8483B',
  free: '#5C8A8A',
}

const DURING_LEADERBOARD: DuringLeaderboardItem[] = [
  {
    name: '李阿姨',
    posts: 8,
    likes: 126,
    avatar: aiImage(
      'realistic square wechat avatar portrait, Chinese older woman traveler, bright smile, outdoor travel background, premium social profile',
      'square_hd',
    ),
  },
  {
    name: '张叔',
    posts: 6,
    likes: 98,
    avatar: aiImage(
      'realistic square wechat avatar portrait, Chinese older man traveler, kind smile, travel scene, premium social profile',
      'square_hd',
    ),
  },
  {
    name: '周阿姨',
    posts: 5,
    likes: 87,
    avatar: aiImage(
      'realistic square wechat avatar portrait, Chinese middle aged woman traveler, warm smile, scenic background, premium social profile',
      'square_hd',
    ),
  },
  {
    name: '王医生',
    posts: 4,
    likes: 73,
    avatar: aiImage(
      'realistic square wechat avatar portrait, Chinese middle aged male doctor traveler, friendly expression, clean background',
      'square_hd',
    ),
  },
  {
    name: '陈老师',
    posts: 4,
    likes: 68,
    avatar: aiImage(
      'realistic square wechat avatar portrait, Chinese retired female teacher traveler, gentle smile, natural travel background',
      'square_hd',
    ),
  },
  {
    name: '孙阿姨',
    posts: 3,
    likes: 62,
    avatar: aiImage(
      'realistic square wechat avatar portrait, Chinese older woman traveler, elegant and warm, outdoor scenic background',
      'square_hd',
    ),
  },
  {
    name: '刘叔',
    posts: 3,
    likes: 57,
    avatar: aiImage(
      'realistic square wechat avatar portrait, Chinese older man traveler, relaxed smile, sunny travel background',
      'square_hd',
    ),
  },
  {
    name: '顾阿姨',
    posts: 3,
    likes: 51,
    avatar: aiImage(
      'realistic square wechat avatar portrait, Chinese middle aged woman traveler, cheerful expression, scenic outdoor portrait',
      'square_hd',
    ),
  },
  {
    name: '赵叔',
    posts: 2,
    likes: 46,
    avatar: aiImage(
      'realistic square wechat avatar portrait, Chinese older male traveler, friendly smile, clean travel profile portrait',
      'square_hd',
    ),
  },
  {
    name: '吴阿姨',
    posts: 2,
    likes: 41,
    avatar: aiImage(
      'realistic square wechat avatar portrait, Chinese older woman traveler, bright smile, premium social portrait',
      'square_hd',
    ),
  },
  {
    name: '唐老师',
    posts: 2,
    likes: 39,
    avatar: aiImage(
      'realistic square wechat avatar portrait, Chinese retired male teacher traveler, calm smile, outdoor portrait',
      'square_hd',
    ),
  },
  {
    name: '蒋阿姨',
    posts: 1,
    likes: 33,
    avatar: aiImage(
      'realistic square wechat avatar portrait, Chinese older woman traveler, kind expression, elegant scenic portrait',
      'square_hd',
    ),
  },
]

export default function Trip() {
  const demoStage = useAppStore((s) => s.demoStage)
  const stage = demoStage === 'duringBatch' ? 'during' : demoStage
  const [sharingTrip, setSharingTrip] = useState(false)
  const [shareToast, setShareToast] = useState<string | null>(null)
  const [openIdx, setOpenIdx] = useState(() => {
    return getTodayTripIndex()
  })

  const onTripForwardConfirm = (who: string) => {
    setSharingTrip(false)
    setShareToast(`已转发给${who}`)
    window.setTimeout(() => setShareToast(null), 1800)
  }

  return (
    <div className="page-enter relative h-full min-h-0 flex flex-col overflow-hidden">
      <MiniProgramBar title="我的行程" />
      <div className="flex-1 min-h-0 scroll-area no-scrollbar pb-[104px]">
        {stage === 'idle' ? (
          <EmptyTrip />
        ) : stage === 'before' ? (
          <BeforeTrip />
        ) : (
          <DuringTrip openIdx={openIdx} setOpenIdx={setOpenIdx} />
        )}
      </div>

      {stage !== 'idle' && (
        <button
          type="button"
          onClick={() => setSharingTrip(true)}
          className="absolute bottom-[108px] right-4 z-30 flex h-14 min-w-[72px] items-center justify-center rounded-full bg-cinnabar px-4 text-white shadow-[0_14px_28px_rgba(200,72,59,0.35)] active:scale-95"
          aria-label="转发行程"
        >
          <span className="text-[17px] font-semibold tracking-[0.08em]">分享</span>
        </button>
      )}

      {sharingTrip && (
        <TripForwardSheet
          demoStage={stage}
          onClose={() => setSharingTrip(false)}
          onConfirm={onTripForwardConfirm}
        />
      )}

      {shareToast && (
        <div className="absolute bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-3 py-1.5 text-[13px] text-white shadow-lg animate-slideIn">
          {shareToast}
        </div>
      )}
    </div>
  )
}

function BeforeTrip() {
  const countdown = useMemo(() => getCountdown(mockTrip.startDate), [])
  const [beforeToast, setBeforeToast] = useState<string | null>(null)
  const transportInfo = getTransportInfo()
  const contactCards = getBeforeTripContacts()
  const productShortName = mockTrip.title.split('·')[0].trim()
  const returnDateDisplay = '2026-06-19'
  const groupQrImage = getMockQrImage('七彩云南出团群')
  const heroImage = aiImage(
    'realistic travel photography, Yunnan travel destination hero image, Blue Moon Valley and snow mountain, warm sunrise light, premium tourism campaign visual, high contrast, elegant composition',
  )
  const itineraryPreview: ItineraryPreviewItem[] = mockTrip.days.map((day: TripDay, idx: number) => ({
    dayLabel: `第 ${idx + 1} 天`,
    title: day.title,
    meta: `${day.weekday} · ${day.weather}`,
  }))

  return (
    <>
      <div className="px-4 mt-3">
        <div className="overflow-hidden rounded-[28px] border border-gold/25 bg-[#FFFCF6] shadow-[0_16px_40px_rgba(125,89,45,0.12)]">
          <div className="relative h-40 overflow-hidden">
            <img src={heroImage} alt={productShortName} className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(36,27,18,0.72)] via-[rgba(36,27,18,0.18)] to-transparent" />
            <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-[rgba(104,56,39,0.72)] px-3 py-1 text-[13px] font-semibold tracking-[0.2em] text-white">
              行前
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="text-[13px] tracking-[0.18em] text-white/80">出发时间</div>
              <div className="mt-1 font-song text-[31px] font-bold leading-none text-white">
                {mockTrip.startDate}
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="text-[13px] tracking-[0.16em] text-cinnabar/80">商品简称</div>
                <div className="mt-1 font-song text-[30px] font-bold leading-[1.15] text-ink">
                  {productShortName}
                </div>
                <div className="mt-2 text-[17px] font-semibold leading-[1.6] text-inkSoft">
                  共计7天6晚
                </div>
                <div className="mt-1 text-[16px] leading-[1.6] text-inkSoft">
                  返程时间：{returnDateDisplay}
                </div>
              </div>
              <div className="shrink-0 rounded-[22px] bg-[#FFF4EE] px-4 py-3 text-right shadow-inner">
                <div className="digit text-[38px] leading-none text-cinnabar">{countdown.days}</div>
                <div className="mt-1 text-[14px] font-semibold text-inkSoft">{countdown.label}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <SectionTitle icon={Plane}>交通信息</SectionTitle>
        <div className="paper-card p-4">
          <div className="space-y-3">
            {[
              {
                label: '去程',
                no: mockTrip.transport.outbound.no,
                route: `${mockTrip.transport.outbound.from} → ${mockTrip.transport.outbound.to}`,
                date: transportInfo.outbound.date,
                departTime: transportInfo.outbound.departTime,
                arriveTime: transportInfo.outbound.arriveTime,
                seat: mockTrip.transport.outbound.seat,
                gate: mockTrip.transport.outbound.gate || '待通知',
              },
              {
                label: '返程',
                no: mockTrip.transport.inbound.no,
                route: `${mockTrip.transport.inbound.from} → ${mockTrip.transport.inbound.to}`,
                date: returnDateDisplay,
                departTime: transportInfo.inbound.departTime,
                arriveTime: transportInfo.inbound.arriveTime,
                seat: mockTrip.transport.inbound.seat,
                gate: mockTrip.transport.inbound.gate || '待通知',
              },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] bg-riceDeep/55 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="rounded-full bg-cinnabar/10 px-3 py-1 text-[13px] font-semibold text-cinnabar">
                    {item.label}
                  </div>
                  <div className="text-[14px] text-inkSoft">{item.date}</div>
                </div>
                <div className="mt-2 text-[20px] font-semibold text-ink">{item.no}</div>
                <div className="mt-1 text-[15px] leading-[1.7] text-inkSoft">{item.route}</div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-2xl bg-white/80 px-3 py-2.5">
                    <div className="t-cap">起飞 / 出发</div>
                    <div className="mt-1 text-[16px] font-semibold text-ink">{item.departTime}</div>
                  </div>
                  <div className="rounded-2xl bg-white/80 px-3 py-2.5">
                    <div className="t-cap">到达</div>
                    <div className="mt-1 text-[16px] font-semibold text-ink">{item.arriveTime}</div>
                  </div>
                  <div className="rounded-2xl bg-white/80 px-3 py-2.5">
                    <div className="t-cap">座位</div>
                    <div className="mt-1 text-[16px] font-semibold text-ink">{item.seat}</div>
                  </div>
                  <div className="rounded-2xl bg-white/80 px-3 py-2.5">
                    <div className="t-cap">登机口</div>
                    <div className="mt-1 text-[16px] font-semibold text-ink">{item.gate}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <SectionTitle icon={Users}>出团群二维码</SectionTitle>
        <div className="paper-card p-4">
          <div className="rounded-[28px] bg-[#FFF8EC] px-5 py-5 text-center">
            <img src={groupQrImage} alt="出团群二维码" className="mx-auto h-36 w-36 rounded-[20px] object-cover" />
            <div className="mx-auto mt-4 max-w-[260px] text-[15px] leading-[1.75] text-inkSoft">
              入群后可查看集合通知、出发提醒和导游实时消息，方便同行人同步信息。
            </div>
            <button
              type="button"
              onClick={() => {
                setBeforeToast('已保存到相册')
                window.setTimeout(() => setBeforeToast(null), 1600)
              }}
              className="mt-3 btn-outline-pill"
            >
              保存到相册
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <SectionTitle icon={CalendarClock}>行前建议</SectionTitle>
        <div className="paper-card p-4">
          <ul className="space-y-2">
            {[
              `出发前重点确认身份证、机票信息和座位号：${mockTrip.transport.outbound.seat}。`,
              '第 6 天玉龙雪山海拔最高，建议提前准备保暖衣物和氧气。',
              '石林、古城、环湖几天步行较多，鞋子优先选择防滑、柔软、好穿脱的款式。',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-gold shrink-0" />
                <span className="t-body text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="px-4 mt-4">
        <SectionTitle icon={Luggage}>准备物品</SectionTitle>
        <div className="paper-card p-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              '身份证 / 医保卡',
              '常用药 / 肠胃药',
              '薄外套 / 保暖衣',
              '防晒霜 / 润唇膏',
              '舒适防滑鞋',
              '雨伞 / 充电器',
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-riceDeep/60 px-3 py-2.5 text-[15px] text-ink">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <ContactCardsSection contacts={contactCards} />
      </div>

      <div className="px-4 mt-4 mb-3">
        <SectionTitle icon={Map}>行程介绍</SectionTitle>
        <div className="paper-card p-4">
          <div className="space-y-2.5">
            {itineraryPreview.map((item: ItineraryPreviewItem) => (
              <div key={item.dayLabel} className="rounded-[20px] bg-riceDeep/55 px-3 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gold text-white flex flex-col items-center justify-center shrink-0">
                    <span className="digit text-[16px] leading-none">{item.dayLabel.replace('第 ', '').replace(' 天', '')}</span>
                    <span className="text-[10px] mt-0.5">DAY</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[17px] font-semibold text-ink">{item.title}</div>
                    <div className="mt-1 text-[14px] text-inkSoft">{item.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {beforeToast && (
        <div className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 rounded-full bg-ink px-3 py-1.5 text-[13px] text-white shadow-lg animate-slideIn">
          {beforeToast}
        </div>
      )}
      <div className="px-4 mt-4 text-center text-[14px] leading-relaxed text-fog">仅显示最近的一次行程</div>
    </>
  )
}

function DuringTrip({
  openIdx,
  setOpenIdx,
}: {
  openIdx: number
  setOpenIdx: React.Dispatch<React.SetStateAction<number>>
}) {
  const [showAllItinerary, setShowAllItinerary] = useState(false)
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false)
  const todayIdx = getTodayTripIndex()
  const todayTrip = mockTrip.days[todayIdx]
  const returnInfo = getTransportInfo().inbound
  const contacts = getBeforeTripContacts()
  const finishedCount = todayIdx
  const progressPercent = Math.round(((todayIdx + 1) / mockTrip.days.length) * 100)
  const leaderboardItems = showFullLeaderboard ? DURING_LEADERBOARD : DURING_LEADERBOARD.slice(0, 10)

  if (showAllItinerary) {
    return (
      <>
        <div className="px-4 pt-2">
          <button
            type="button"
            onClick={() => setShowAllItinerary(false)}
            className="inline-flex items-center gap-1 text-[15px] font-semibold text-cinnabar"
          >
            <ChevronLeft size={16} />
            返回今日行程
          </button>
          <SectionTitle icon={Map} className="mb-2 pt-3 pb-0">全部行程</SectionTitle>
          <div className="paper-card p-4">
            <div className="text-[14px] text-inkSoft">已玩过的内容会保留在这里，随时可以回看。</div>
          </div>
        </div>
        <AllTripScheduleSection openIdx={openIdx} setOpenIdx={setOpenIdx} todayIdx={todayIdx} />
      </>
    )
  }

  return (
    <>
      <div className="px-4 pt-2">
        <div className="overflow-hidden rounded-[28px] border border-cinnabar/10 bg-[#FFFBF5] shadow-[0_16px_36px_rgba(125,89,45,0.10)]">
          <div className="bg-gradient-to-r from-[#F8E5DB] via-[#FFF4EA] to-[#FFFBF5] px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[13px] tracking-[0.16em] text-cinnabar/80">今日行程</div>
                <div className="mt-1 font-song text-[28px] font-bold leading-[1.15] text-ink">
                  第 {todayIdx + 1} 天 · {todayTrip.title}
                </div>
                <div className="mt-2 text-[15px] leading-[1.7] text-inkSoft">
                  {todayTrip.weekday} · {todayTrip.weather} · 已完成 {finishedCount} 天行程
                </div>
              </div>
              <div className="shrink-0 rounded-[20px] bg-white/85 px-3 py-3 text-right shadow-[0_8px_18px_rgba(125,89,45,0.08)]">
                <div className="digit text-[26px] leading-none text-cinnabar">{progressPercent}%</div>
                <div className="mt-1 text-[12px] text-inkSoft">旅程进度</div>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/70">
              <div className="h-full rounded-full bg-cinnabar" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <SectionTitle icon={CalendarClock}>今天要玩什么</SectionTitle>
        <div className="paper-card p-4">
          <div className="mb-3 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setOpenIdx(todayIdx)
                setShowAllItinerary(true)
              }}
              className="inline-flex items-center gap-1 text-[14px] font-semibold text-cinnabar"
            >
              全部行程
              <ArrowRight size={15} />
            </button>
          </div>
          <div className="space-y-3">
            {todayTrip.items.map((it: ItineraryItem, i: number) => {
                const color = TYPE_COLOR[it.type]
                return (
                  <div key={`${it.time}-${i}`} className="flex gap-3">
                    <div className="w-[50px] shrink-0 pt-0.5 text-right">
                      <div className="digit text-[16px] text-cinnabar">{it.time}</div>
                    </div>
                    <div className="relative flex-1 rounded-[20px] bg-riceDeep/45 px-3 py-3">
                      <div className="absolute left-0 top-0 h-full w-1.5 rounded-l-[20px]" style={{ background: color }} />
                      <div className="pl-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className="rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
                            style={{ background: color }}
                          >
                            {TYPE_LABEL[it.type]}
                          </span>
                          {it.duration && <span className="text-[12px] text-inkSoft">{it.duration}</span>}
                        </div>
                        <div className="mt-1 text-[17px] font-semibold leading-[1.5] text-ink">{it.title}</div>
                        {it.desc && <div className="mt-1 text-[14px] leading-[1.7] text-inkSoft">{it.desc}</div>}
                      </div>
                    </div>
                  </div>
                )
            })}
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <SectionTitle icon={Trophy}>风采排行榜</SectionTitle>
        <div className="paper-card p-4">
          <div className="mt-3 rounded-[18px] border border-line/55 bg-[#FFFDF8]">
            <div className="grid grid-cols-[38px_42px_minmax(0,1fr)_62px_74px] items-center gap-2 border-b border-line/55 px-3 py-2 text-[12px] text-inkSoft">
              <div>排名</div>
              <div />
              <div>昵称</div>
              <div className="text-right">风采数</div>
              <div className="text-right">总点赞</div>
            </div>
            {leaderboardItems.map((item, index) => (
              <div
                key={item.name}
                className="grid grid-cols-[38px_42px_minmax(0,1fr)_62px_74px] items-center gap-2 border-b border-line/40 px-3 py-2.5 last:border-b-0"
              >
                <div className="digit text-[16px] text-cinnabar">{index + 1}</div>
                <img src={item.avatar} alt={item.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                <div className="truncate text-[15px] font-semibold text-ink">{item.name}</div>
                <div className="text-right text-[15px] text-ink">{item.posts}</div>
                <div className="text-right text-[15px] font-semibold text-cinnabar">{item.likes}</div>
              </div>
            ))}
          </div>
          {DURING_LEADERBOARD.length > 10 && !showFullLeaderboard && (
            <button
              type="button"
              onClick={() => setShowFullLeaderboard(true)}
              className="mt-3 w-full rounded-[18px] border border-line/60 bg-[#FFF8EE] px-3 py-3 text-[15px] font-semibold text-cinnabar active:scale-[0.99]"
            >
              查看更多
            </button>
          )}
        </div>
      </div>

      <div className="px-4 mt-4">
        <SectionTitle icon={Plane}>返程信息</SectionTitle>
        <div className="paper-card p-4">
          <div className="rounded-[24px] bg-[#FFF7EA] px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[18px] font-semibold text-ink">{mockTrip.transport.inbound.no}</div>
                <div className="mt-1 text-[15px] text-inkSoft">
                  {mockTrip.transport.inbound.from} → {mockTrip.transport.inbound.to}
                </div>
              </div>
              <div className="rounded-full bg-white/90 px-3 py-1 text-[13px] font-semibold text-cinnabar">
                返程第 {mockTrip.days.length} 天
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-white px-3 py-2.5">
                <div className="text-[12px] text-inkSoft">返程时间</div>
                <div className="mt-1 text-[16px] font-semibold text-ink">{returnInfo.date} {returnInfo.departTime}</div>
              </div>
              <div className="rounded-2xl bg-white px-3 py-2.5">
                <div className="text-[12px] text-inkSoft">抵达时间</div>
                <div className="mt-1 text-[16px] font-semibold text-ink">{returnInfo.arriveTime}</div>
              </div>
              <div className="rounded-2xl bg-white px-3 py-2.5">
                <div className="text-[12px] text-inkSoft">座位</div>
                <div className="mt-1 text-[16px] font-semibold text-ink">{mockTrip.transport.inbound.seat}</div>
              </div>
              <div className="rounded-2xl bg-white px-3 py-2.5">
                <div className="text-[12px] text-inkSoft">登机口</div>
                <div className="mt-1 text-[16px] font-semibold text-ink">{mockTrip.transport.inbound.gate || '待通知'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        <ContactCardsSection contacts={contacts} />
      </div>

      <div className="h-3" />
      <div className="px-4 text-center text-[14px] leading-relaxed text-fog">您当前是行程中，待出行订单在您本次行程结束后会显示</div>
    </>
  )
}

function ContactCardsSection({ contacts }: { contacts: BeforeTripContact[] }) {
  return (
    <>
      <SectionTitle icon={PhoneCall}>联系方式</SectionTitle>
      <div className="paper-card p-4">
        <div className="space-y-3">
          {contacts.map((contact) => {
          const theme = getContactTheme(contact.title)
          return (
            <div
              key={contact.title}
              className="rounded-[24px] border border-[#E6DCCB] bg-[#FFFCF6] px-3 py-3 shadow-[0_8px_20px_rgba(125,89,45,0.06)]"
            >
              <div className="flex gap-3">
                <img
                  src={contact.photo}
                  alt={contact.name}
                  className="h-24 w-20 shrink-0 rounded-[18px] object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${theme.badge}`}>
                      {contact.title}
                    </span>
                    <span className="text-[13px] text-inkSoft">{contact.roleLabel}</span>
                  </div>
                  <div className="mt-2 text-[22px] font-semibold leading-tight text-ink">{contact.name}</div>
                  <div className="mt-2 text-[15px] leading-[1.7] text-inkSoft">{contact.desc}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 rounded-[18px] bg-[#FFF6EA] px-3 py-3">
                <div className="min-w-0">
                  <div className="text-[12px] tracking-[0.12em] text-inkSoft">联系电话</div>
                  <div className={`mt-1 text-[24px] font-semibold leading-none ${theme.phone}`}>
                    {contact.phone}
                  </div>
                </div>
                <button
                  type="button"
                  className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3.5 py-2 text-[14px] font-semibold ${theme.action}`}
                >
                  <PhoneCall size={14} />
                  拨打
                </button>
              </div>
            </div>
          )
          })}
        </div>
      </div>
    </>
  )
}

function AllTripScheduleSection({
  openIdx,
  setOpenIdx,
  todayIdx,
}: {
  openIdx: number
  setOpenIdx: React.Dispatch<React.SetStateAction<number>>
  todayIdx: number
}) {
  return (
    <div className="px-4 mt-4 mb-3">
      <div className="paper-card p-4">
        <div className="space-y-2.5">
          {mockTrip.days.map((d: TripDay, idx: number) => {
            const isOpen = openIdx === idx
            const isCompleted = idx < todayIdx
            const isToday = idx === todayIdx
            return (
              <div key={d.date} className="rounded-[22px] border border-line/55 bg-[#FFFDF8]">
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="flex w-full items-center gap-3 px-3 py-3 text-left"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl text-white ${
                      isCompleted ? 'bg-[#88A56D]' : isToday ? 'bg-cinnabar' : 'bg-inkSoft'
                    }`}
                  >
                    <span className="digit text-[17px] leading-none">{idx + 1}</span>
                    <span className="text-[10px] mt-0.5">DAY</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="text-[17px] font-semibold text-ink">第 {idx + 1} 天 · {d.title}</div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          isCompleted
                            ? 'bg-[#E6F0DE] text-[#5E7A45]'
                            : isToday
                              ? 'bg-cinnabar/10 text-cinnabar'
                              : 'bg-riceDeep/70 text-inkSoft'
                        }`}
                      >
                        {isCompleted ? '已玩过' : isToday ? '今天' : '待进行'}
                      </span>
                    </div>
                    <div className="mt-1 text-[13px] text-inkSoft">{d.weekday} · {d.weather}</div>
                  </div>
                  {isCompleted ? (
                    <CheckCircle2 size={18} className="text-[#5E7A45]" />
                  ) : isOpen ? (
                    <ChevronUp size={20} className="text-inkSoft" />
                  ) : (
                    <ChevronDown size={20} className="text-inkSoft" />
                  )}
                </button>
                {isOpen && (
                  <div className="border-t border-line/50 px-3 pb-3 pt-2 animate-slideIn">
                    <ul className="space-y-2.5">
                      {d.items.map((it: ItineraryItem, i: number) => {
                        const color = TYPE_COLOR[it.type]
                        return (
                          <li key={`${it.time}-${i}`} className="rounded-[18px] bg-riceDeep/40 px-3 py-2.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="digit text-[15px] text-cinnabar">{it.time}</span>
                              <span
                                className="rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
                                style={{ background: color }}
                              >
                                {TYPE_LABEL[it.type]}
                              </span>
                              {it.duration && <span className="text-[12px] text-inkSoft">{it.duration}</span>}
                            </div>
                            <div className="mt-1 text-[16px] font-semibold text-ink">{it.title}</div>
                            {it.desc && <div className="mt-1 text-[13px] leading-[1.7] text-inkSoft">{it.desc}</div>}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function getCountdown(startDate: string) {
  const today = new Date()
  const start = new Date(startDate)
  today.setHours(0, 0, 0, 0)
  start.setHours(0, 0, 0, 0)
  const diff = Math.max(0, Math.round((start.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)))

  return {
    days: diff,
    label: diff === 0 ? '今天出发' : '天后出发',
  }
}

function getTransportInfo() {
  const formatLeg = (departAt: string, arriveAt: string) => {
    const [date = departAt, departTime = departAt] = departAt.split(' ')
    const [, arriveTime = arriveAt] = arriveAt.split(' ')
    return { date, departTime, arriveTime }
  }

  return {
    outbound: formatLeg(mockTrip.transport.outbound.departAt, mockTrip.transport.outbound.arriveAt),
    inbound: formatLeg('2026-06-19 14:20', '2026-06-19 17:35'),
  }
}

function getBeforeTripContacts(): BeforeTripContact[] {
  const guide = mockTrip.staff.find((item: Staff) => item.role === 'guide')
  const butler = mockTrip.staff.find((item: Staff) => item.role === 'butler')

  return [
    {
      title: '导游',
      name: guide?.name || '张导',
      phone: guide?.phone || '138-0011-2233',
      roleLabel: guide?.title || '全程导游',
      desc: guide?.desc || '熟悉云南线路节奏，负责景点讲解、集合提醒和全程带队。',
      photo: aiImage('realistic portrait photo, Chinese male tour guide in his 40s, warm smile, travel setting, premium portrait', 'portrait_4_3'),
    },
    {
      title: '全陪小管家',
      name: butler?.name || '李筱然',
      phone: butler?.phone || '139-2244-5566',
      roleLabel: butler?.title || '全陪小管家',
      desc: butler?.desc || '负责起居照应、群内通知和行前行中各种细节协助。',
      photo: aiImage('realistic portrait photo, Chinese young female travel butler, friendly expression, soft natural light, premium portrait', 'portrait_4_3'),
    },
    {
      title: '订单小管家',
      name: '出行订单服务',
      phone: '400-820-6677',
      roleLabel: '订单服务',
      desc: '出发前证件、订单、座位及改签咨询都可优先联系这位小管家。',
      photo: aiImage('realistic portrait photo, Chinese female travel service manager, professional and friendly, clean background, premium portrait', 'portrait_4_3'),
    },
  ]
}

function getContactTheme(title: string) {
  if (title === '导游') {
    return {
      ribbon: 'from-[#F5E6C8] via-[#FFF7E7] to-[#FFFDF8]',
      glow: 'from-[#E8B36A] to-transparent',
      badge: 'bg-[#FCEED8] text-[#B7771D]',
      action: 'bg-[#FFF7E7] text-[#B7771D]',
      phone: 'text-[#B7771D]',
    }
  }

  if (title === '全陪小管家') {
    return {
      ribbon: 'from-[#F7DBD3] via-[#FFF1EC] to-[#FFFDF8]',
      glow: 'from-[#E28E7E] to-transparent',
      badge: 'bg-[#FBE6E0] text-cinnabar',
      action: 'bg-[#FFF0EB] text-cinnabar',
      phone: 'text-cinnabar',
    }
  }

  return {
    ribbon: 'from-[#DDE6F2] via-[#F5F8FC] to-[#FFFDF8]',
    glow: 'from-[#92A9C7] to-transparent',
    badge: 'bg-[#EAF0F8] text-[#4E678A]',
    action: 'bg-[#F0F5FB] text-[#4E678A]',
    phone: 'text-[#4E678A]',
  }
}

function getMockQrImage(label: string) {
  const size = 220
  const cell = 8
  const grid = 21
  const finder = new Set<string>()
  const paintFinder = (startX: number, startY: number) => {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        const outer = x === 0 || x === 6 || y === 0 || y === 6
        const inner = x >= 2 && x <= 4 && y >= 2 && y <= 4
        if (outer || inner) finder.add(`${startX + x}-${startY + y}`)
      }
    }
  }

  paintFinder(0, 0)
  paintFinder(14, 0)
  paintFinder(0, 14)

  const modules: string[] = []
  for (let y = 0; y < grid; y += 1) {
    for (let x = 0; x < grid; x += 1) {
      const key = `${x}-${y}`
      const shouldFill =
        finder.has(key) ||
        ((x * 5 + y * 3 + label.length) % 7 < 3 &&
          !(
            (x < 8 && y < 8) ||
            (x > 12 && y < 8) ||
            (x < 8 && y > 12)
          ))

      if (shouldFill) {
        modules.push(
          `<rect x="${26 + x * cell}" y="${26 + y * cell}" width="${cell - 1}" height="${cell - 1}" rx="1" fill="#476F6F" />`,
        )
      }
    }
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" rx="28" fill="#FFF8EC"/>
      <rect x="12" y="12" width="${size - 24}" height="${size - 24}" rx="22" fill="#F7F1E5" stroke="#D8CDB4"/>
      ${modules.join('')}
      <rect x="84" y="84" width="52" height="52" rx="16" fill="#C8483B"/>
      <text x="110" y="116" text-anchor="middle" font-size="24" font-family="Arial" fill="#ffffff">团</text>
    </svg>
  `

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function TripForwardSheet({
  demoStage,
  onClose,
  onConfirm,
}: {
  demoStage: ReturnType<typeof useAppStore.getState>['demoStage']
  onClose: () => void
  onConfirm: (who: string) => void
}) {
  const companions = ['老伴', '周阿姨', '张叔', '李姐', '赵叔', '陈阿姨']
  const summaryText =
    demoStage === 'before'
      ? `行前行程单 · ${mockTrip.startDate} 出发 · ${mockTrip.title}`
      : `今日行程同步 · 第 ${getTodayTripIndex() + 1} 天 · ${mockTrip.days[getTodayTripIndex()]?.title || mockTrip.days[0].title}`

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end animate-slideIn">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative rounded-t-3xl bg-rice p-4 pb-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="font-song t-title text-ink font-bold">转发给同行人</div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-riceDeep/60"
          >
            <X size={14} />
          </button>
        </div>

        <div className="rounded-2xl border border-line/70 bg-[#FFF8EC] px-3 py-2.5">
          <div className="text-[13px] font-semibold text-cinnabar">即将转发的内容</div>
          <div className="mt-1 text-[16px] font-semibold leading-[1.5] text-ink">{summaryText}</div>
          <div className="mt-1 text-[13px] leading-[1.6] text-inkSoft">
            {mockTrip.transport.outbound.no} · {mockTrip.transport.outbound.from} → {mockTrip.transport.outbound.to}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-3">
          {companions.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => onConfirm(name)}
              className="flex flex-col items-center gap-1.5 active:scale-95"
            >
              <TripWechatAvatar name={name} size={52} />
              <span className="text-[12px] text-ink">{name}</span>
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 text-[13px] text-inkSoft">
          <Share2 size={14} /> 下单人可一键把当前行程同步给同行人
        </div>
      </div>
    </div>
  )
}

function getTodayTripIndex() {
  const today = new Date().toISOString().slice(0, 10)
  const index = mockTrip.days.findIndex((item: TripDay) => item.date === today)
  return index >= 0 ? index : 0
}

function tripAvatarPrompt(name: string) {
  const mapping: Record<string, string> = {
    老伴: 'realistic square wechat avatar portrait, Chinese older woman traveler, gentle smile, clean background',
    周阿姨: 'realistic square wechat avatar portrait, Chinese middle aged woman traveler, warm smile, clean background',
    张叔: 'realistic square wechat avatar portrait, Chinese older man traveler, relaxed expression, clean background',
    李姐: 'realistic square wechat avatar portrait, Chinese middle aged woman, soft light, clean background',
    赵叔: 'realistic square wechat avatar portrait, Chinese older man, kind smile, clean background',
    陈阿姨: 'realistic square wechat avatar portrait, Chinese older woman, friendly expression, clean background',
    default: 'realistic square wechat avatar portrait, Chinese traveler, friendly smile, clean background',
  }

  return mapping[name] || mapping.default
}

function TripWechatAvatar({
  name,
  size,
}: {
  name: string
  size: number
}) {
  return (
    <img
      src={aiImage(tripAvatarPrompt(name), 'square_hd')}
      alt={name}
      width={size}
      height={size}
      className="shrink-0 rounded-[12px] border border-line/60 bg-riceDeep object-cover"
    />
  )
}

function EmptyTrip() {
  const [toast, setToast] = useState<string | null>(null)
  const saveQrCode = () => {
    setToast('已保存到相册')
    setTimeout(() => setToast(null), 1600)
  }

  return (
    <div className="px-4 mt-3">
      <div className="paper-card p-6 text-center">
        <div className="font-song t-title text-ink">暂无待出发行程</div>
        <p className="t-body text-inkSoft mt-2 leading-relaxed">可以去看看我们的旅游线路，遇到喜欢的行程再联系小管家咨询。</p>
        <button className="btn-primary mx-auto mt-4 h-10 px-5 text-[15px]">去看看旅游线路</button>
        <div className="mx-auto mt-5 w-fit rounded-[24px] border border-line bg-rice p-3 shadow-paper">
          <div className="grid h-36 w-36 grid-cols-7 gap-1 rounded-[16px] bg-white p-2">
            {Array.from({ length: 49 }).map((_, index) => (
              <span key={index} className={`rounded-[3px] ${[0, 1, 2, 7, 14, 16, 22, 24, 28, 32, 34, 40, 42, 43, 44, 6, 12, 18, 30, 36, 48].includes(index) ? 'bg-ink' : index % 5 === 0 ? 'bg-cinnabar' : 'bg-riceDeep'}`} />
            ))}
          </div>
        </div>
        <div className="mt-3 font-song t-h2 text-ink font-bold">销售小管家二维码</div>
        <button type="button" onClick={saveQrCode} className="mt-2 btn-outline-pill">保存到相册</button>
        <p className="t-body text-inkSoft mt-2 leading-relaxed">保存到相册后，用微信识别二维码，添加您的专属小管家。</p>
      </div>
      {toast && <div className="mx-auto mt-3 w-fit rounded-full bg-ink px-3 py-1.5 text-[13px] text-white animate-slideIn">{toast}</div>}
    </div>
  )
}
