import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { Check, ClipboardList, Headset, ImagePlus, Mic, Send, Trash2 } from 'lucide-react'
import MiniProgramBar from '../components/MiniProgramBar'
import SectionTitle from '../components/SectionTitle'
import { dimensionMeta, duringReviewDimensions, strawberryMeta } from '../data/mockReviews'
import { useAppStore } from '../store/useAppStore'
import type { Review, StrawberryLevel } from '../types'

type Dim = Review['dimension']
type DraftStrawberryLevel = StrawberryLevel | null
const STRAWBERRY_LEVELS = Object.keys(strawberryMeta) as StrawberryLevel[]
const UPCOMING_SERVICE_ORDER = '「比邻同行」【古都风华・北京二环遇见希尔顿】双高5日丨故宫 八达岭 天坛 升级特色京味餐 赠缆车集体照 纯玩小团超省心'
const HISTORY_TRIPS = ['行程：【古都风华・北京二环遇见希尔顿】双高5日丨故宫 八达岭 天坛 升级特色京味餐 赠缆车集']
const MIN_REVIEW_TEXT_LENGTH = 5

function levelOf(review: Review): StrawberryLevel {
  return review.strawberryLevel ?? 'red'
}

export default function ReviewPage() {
  const demoStage = useAppStore((s) => s.demoStage)
  const reviews = useAppStore((s) => s.reviews)
  const addReview = useAppStore((s) => s.addReview)
  const removeReview = useAppStore((s) => s.removeReview)
  const [dim, setDim] = useState<Dim | null>(null)
  const [level, setLevel] = useState<DraftStrawberryLevel>(null)
  const [text, setText] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [imageCount, setImageCount] = useState(0)
  const [voiceAdded, setVoiceAdded] = useState(false)
  const [toast, setToast] = useState<string | null>(null)


  const submit = () => {
    const trimmedText = text.trim()
    if (!dim) {
      setToast('请先选择要送草莓的对象')
      setTimeout(() => setToast(null), 1600)
      return
    }
    if (!level) {
      setToast('请先选择要送的草莓')
      setTimeout(() => setToast(null), 1600)
      return
    }
    if (!trimmedText) {
      setToast('说说为什么送这颗草莓吧～')
      setTimeout(() => setToast(null), 1600)
      return
    }
    if (trimmedText.length <= MIN_REVIEW_TEXT_LENGTH) {
      setToast('请至少输入 6 个字后再赠送')
      setTimeout(() => setToast(null), 1600)
      return
    }
    addReview({ id: 'r-' + Date.now(), dimension: dim, strawberryLevel: level, text: trimmedText, createdAt: nowText() })
    setText('')
    setDim(null)
    setLevel(null)
    setAnonymous(false)
    setImageCount(0)
    setVoiceAdded(false)
    setToast('草莓已送出，感谢反馈！')
    setTimeout(() => setToast(null), 1600)
  }

  return (
    <div className="page-enter h-full min-h-0 flex flex-col overflow-hidden">
      <MiniProgramBar title="送草莓" />
      <div className="flex-1 min-h-0 scroll-area no-scrollbar pb-[104px]">
        {demoStage === 'before' ? <BeforeReview /> : demoStage === 'idle' ? <IdleReview /> : demoStage === 'duringBatch' ? <DuringBatchReview /> : (
          <DuringReview
            dim={dim}
            setDim={setDim}
            level={level}
            setLevel={setLevel}
            text={text}
            setText={setText}
            anonymous={anonymous}
            setAnonymous={setAnonymous}
            imageCount={imageCount}
            setImageCount={setImageCount}
            voiceAdded={voiceAdded}
            setVoiceAdded={setVoiceAdded}
            setToast={setToast}
            submit={submit}
            reviews={reviews}
            onRemove={removeReview}
          />
        )}
      </div>
      {toast && <div className="absolute left-1/2 -translate-x-1/2 bottom-24 z-40 px-3 py-1.5 rounded-full bg-ink text-white text-[13px] animate-slideIn">{toast}</div>}
    </div>
  )
}

function DuringReview({ dim, setDim, level, setLevel, text, setText, anonymous, setAnonymous, imageCount, setImageCount, voiceAdded, setVoiceAdded, setToast, submit, reviews, onRemove }: { dim: Dim | null; setDim: (dim: Dim | null) => void; level: DraftStrawberryLevel; setLevel: (level: DraftStrawberryLevel) => void; text: string; setText: (text: string) => void; anonymous: boolean; setAnonymous: (anonymous: boolean) => void; imageCount: number; setImageCount: Dispatch<SetStateAction<number>>; voiceAdded: boolean; setVoiceAdded: (voiceAdded: boolean) => void; setToast: (toast: string | null) => void; submit: () => void; reviews: Review[]; onRemove: (id: string) => void }) {
  return (
    <>
      <DuringReviewIntro />
      <section className="px-4 pt-4">
        <SectionTitle className="mb-5 pt-3 pb-1">您要给谁送草莓？</SectionTitle>
        <div className="paper-card p-4">
          <div className="grid grid-cols-3 gap-2">
            {duringReviewDimensions.map((k) => <DimensionButton key={k} dim={k} active={dim === k} onClick={() => setDim(k)} />)}
          </div>
          <StrawberryPicker value={level} onChange={setLevel} />
          <div className="mt-3">
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={dim ? `说说为什么给${dimensionMeta[dim].label}送这颗草莓…` : '说说为什么送这颗草莓…'} rows={3} className="w-full p-3 rounded-xl border border-line bg-rice text-ink t-body focus:outline-none focus:border-cinnabar resize-none" />
          </div>
          <GiftSubmitArea
            anonymous={anonymous}
            onAnonymousChange={setAnonymous}
            onImageClick={() => { setImageCount((count) => count + 1); setToast('已添加图片'); setTimeout(() => setToast(null), 1600) }}
            onVoiceClick={() => { setVoiceAdded(true); setToast('已添加语音'); setTimeout(() => setToast(null), 1600) }}
            imageCount={imageCount}
            voiceAdded={voiceAdded}
            onSubmit={submit}
            className="mt-3"
          />
        </div>
      </section>
      <ReviewHistory reviews={reviews} onRemove={onRemove} />
    </>
  )
}

function DuringReviewIntro() {
  return (
    <div className="px-4 pt-2">
      <div className="rounded-[28px] bg-riceDeep/55 px-4 py-4 text-center">
        <div className="font-song t-title text-ink font-bold">旅途中可随时送草莓</div>
        <div className="t-body mt-1 leading-relaxed text-inkSoft">您的每一颗草莓，都能帮助共比邻做得更好。谢谢您的热心。</div>
      </div>
    </div>
  )
}

function DuringBatchReview() {
  const reviews = useAppStore((s) => s.reviews)
  const addReview = useAppStore((s) => s.addReview)
  const removeReview = useAppStore((s) => s.removeReview)
  const [ratings, setRatings] = useState<Record<Dim, DraftStrawberryLevel>>(() => Object.fromEntries(duringReviewDimensions.map((dim) => [dim, null])) as Record<Dim, DraftStrawberryLevel>)
  const [text, setText] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [imageCount, setImageCount] = useState(0)
  const [voiceAdded, setVoiceAdded] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 1600)
  }

  const submitBatch = () => {
    const selected = duringReviewDimensions.filter((dim) => ratings[dim])
    if (selected.length === 0) {
      showToast('请至少给一项送草莓')
      return
    }
    const trimmedText = text.trim()
    selected.forEach((dim, index) => {
      addReview({
        id: `r-${Date.now()}-${dim}-${index}`,
        dimension: dim,
        strawberryLevel: ratings[dim] as StrawberryLevel,
        text: trimmedText || `给${dimensionMeta[dim].label}送出${strawberryMeta[ratings[dim] as StrawberryLevel].label}`,
        createdAt: nowText(),
      })
    })
    setRatings(Object.fromEntries(duringReviewDimensions.map((dim) => [dim, null])) as Record<Dim, DraftStrawberryLevel>)
    setText('')
    setAnonymous(false)
    setImageCount(0)
    setVoiceAdded(false)
    showToast(`已一次送出 ${selected.length} 颗草莓`)
  }

  return (
    <>
      <DuringReviewIntro />
      <section className="px-4 pt-4">
        <SectionTitle>一次给每项送草莓</SectionTitle>
        <div className="paper-card p-4">
          <div className="rounded-2xl bg-[#FFF8EC] px-3 py-2.5 text-center text-[15px] leading-relaxed text-inkSoft">
            每次可以一次提交一项或几项，想提交时随时都可以提交。
          </div>
          <div className="mt-3 space-y-2.5">
            {duringReviewDimensions.map((dim) => (
              <BatchDimensionRow key={dim} dim={dim} value={ratings[dim]} onChange={(level) => setRatings((current) => ({ ...current, [dim]: level }))} />
            ))}
          </div>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="有共同想补充的话，可以写在这里…" rows={3} className="mt-3 w-full p-3 rounded-xl border border-line bg-rice text-ink t-body focus:outline-none focus:border-cinnabar resize-none" />
          <GiftActionRow
            anonymous={anonymous}
            onAnonymousChange={setAnonymous}
            onImageClick={() => { setImageCount((count) => count + 1); showToast('已添加图片') }}
            onVoiceClick={() => { setVoiceAdded(true); showToast('已添加语音') }}
            imageCount={imageCount}
            voiceAdded={voiceAdded}
          />
          <button onClick={submitBatch} className="btn-primary w-full h-11 mt-3 flex items-center justify-center gap-1.5 text-[16px]"><Send size={16} /> 点击赠送草莓</button>
          <div className="mt-2 text-center text-[12px] leading-relaxed text-inkSoft">感谢您的监督，帮助我们做得更好。</div>
        </div>
      </section>
      <ReviewHistory reviews={reviews} onRemove={removeReview} />
      {toast && <div className="mx-auto mt-3 w-fit rounded-full bg-ink px-3 py-1.5 text-[13px] text-white animate-slideIn">{toast}</div>}
    </>
  )
}

function BatchDimensionRow({ dim, value, onChange }: { dim: Dim; value: DraftStrawberryLevel; onChange: (level: StrawberryLevel) => void }) {
  const m = dimensionMeta[dim]
  return (
    <div className="rounded-2xl border border-line bg-rice px-3 py-3">
      <div className="flex items-center gap-2">
        <div className="text-[24px] leading-none">{m.emoji}</div>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold text-ink">{m.label}</div>
          <div className="t-cap">{m.hint}</div>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {STRAWBERRY_LEVELS.map((level) => {
          const s = strawberryMeta[level]
          const active = value === level
          return (
            <button key={level} type="button" onClick={() => onChange(level)} className={`rounded-xl border px-2 py-2 text-center transition ${active ? 'border-cinnabar shadow-paper' : 'border-line bg-[#FFFBF1]'}`} style={{ background: active ? s.bg : undefined }}>
              <div className="text-[20px] leading-none" style={{ filter: level === 'green' ? 'hue-rotate(95deg) saturate(1.4)' : level === 'rotten' ? 'grayscale(0.75) brightness(0.75)' : undefined }}>{s.emoji}</div>
              <div className="mt-1 text-[14px] font-bold" style={{ color: active ? s.color : '#4A4A4A' }}>{s.meaning}</div>
              <div className="mt-0.5 text-[11px] font-semibold" style={{ color: active ? s.color : '#8A8174' }}>{s.label}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function DimensionButton({ dim, active, onClick }: { dim: Dim; active: boolean; onClick: () => void }) {
  const m = dimensionMeta[dim]
  const isOverall = dim === 'overall'
  return (
    <button onClick={onClick} className={`relative rounded-2xl border px-2 py-3 text-center transition ${isOverall ? 'col-span-2' : ''} ${active ? 'border-cinnabar bg-cinnabar/5 shadow-paper' : 'border-line bg-rice'}`}>
      <div className="text-[24px] leading-none mb-1">{m.emoji}</div>
      <div className="text-[14px] font-semibold text-ink">{m.label}</div>
      <div className="t-cap">{m.hint}</div>
    </button>
  )
}

function StrawberryPicker({ value, onChange }: { value: DraftStrawberryLevel; onChange: (level: StrawberryLevel) => void }) {
  return (
    <div className="mt-4">
      <div className="t-cap mb-1.5">选择要送的草莓</div>
      <div className="grid grid-cols-3 gap-2">
        {STRAWBERRY_LEVELS.map((level) => {
          const m = strawberryMeta[level]
          const active = value === level
          return <button key={level} onClick={() => onChange(level)} className={`rounded-2xl border p-3 text-center transition ${active ? 'border-cinnabar shadow-paper' : 'border-line'}`} style={{ background: active ? m.bg : '#F7F1E5' }}>
            <div className="text-[30px] leading-none" style={{ filter: level === 'green' ? 'hue-rotate(95deg) saturate(1.4)' : level === 'rotten' ? 'grayscale(0.75) brightness(0.75)' : undefined }}>{m.emoji}</div>
            <div className="mt-1 text-[17px] font-bold" style={{ color: m.color }}>{m.meaning}</div>
            <div className="mt-1 font-semibold text-[13px]" style={{ color: m.color }}>{m.label}</div>
          </button>
        })}
      </div>
    </div>
  )
}

function AnonymousToggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex w-fit items-center gap-2 rounded-full bg-rice px-3 py-1.5 text-[13px] text-inkSoft">
      <button type="button" onClick={() => onChange(!checked)} className={`flex h-4 w-4 items-center justify-center rounded border transition ${checked ? 'border-cinnabar bg-cinnabar text-white' : 'border-line bg-white'}`} aria-pressed={checked}>
        {checked && <Check size={12} strokeWidth={3} />}
      </button>
      <span>匿名赠送</span>
    </label>
  )
}

function GiftSubmitArea({ anonymous, onAnonymousChange, onImageClick, onVoiceClick, imageCount, voiceAdded, onSubmit, className = '' }: { anonymous: boolean; onAnonymousChange: (checked: boolean) => void; onImageClick: () => void; onVoiceClick: () => void; imageCount: number; voiceAdded: boolean; onSubmit: () => void; className?: string }) {
  return (
    <div className={className}>
      <GiftActionRow
        anonymous={anonymous}
        onAnonymousChange={onAnonymousChange}
        onImageClick={onImageClick}
        onVoiceClick={onVoiceClick}
        imageCount={imageCount}
        voiceAdded={voiceAdded}
      />
      <button onClick={onSubmit} className="btn-primary w-full h-11 mt-3 flex items-center justify-center gap-1.5 text-[16px]"><Send size={16} /> 点击赠送草莓</button>
      <div className="mt-2 text-center text-[12px] leading-relaxed text-inkSoft">感谢您的监督，帮助我们做得更好。</div>
    </div>
  )
}

function GiftActionRow({ anonymous, onAnonymousChange, onImageClick, onVoiceClick, imageCount, voiceAdded }: { anonymous: boolean; onAnonymousChange: (checked: boolean) => void; onImageClick: () => void; onVoiceClick: () => void; imageCount: number; voiceAdded: boolean }) {
  return (
    <div className="mt-2 flex items-center justify-between gap-2">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <button type="button" onClick={onImageClick} className="rounded-full border border-line bg-rice px-3 py-1.5 text-[13px] text-inkSoft flex items-center gap-1.5 active:scale-95 transition"><ImagePlus size={15} /> 发图片</button>
        <button type="button" onClick={onVoiceClick} className="rounded-full border border-line bg-rice px-3 py-1.5 text-[13px] text-inkSoft flex items-center gap-1.5 active:scale-95 transition"><Mic size={15} /> 语音输入</button>
        {imageCount > 0 && <span className="rounded-full bg-cinnabar/10 px-2.5 py-1 text-[12px] text-cinnabar">图片 × {imageCount}</span>}
        {voiceAdded && <span className="rounded-full bg-gold/12 px-2.5 py-1 text-[12px] text-gold">已录入语音</span>}
      </div>
      <div className="shrink-0">
        <AnonymousToggle checked={anonymous} onChange={onAnonymousChange} />
      </div>
    </div>
  )
}

function BeforeReview() {
  const reviews = useAppStore((s) => s.reviews)
  const addReview = useAppStore((s) => s.addReview)
  const removeReview = useAppStore((s) => s.removeReview)
  const [level, setLevel] = useState<DraftStrawberryLevel>(null)
  const [text, setText] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [imageCount, setImageCount] = useState(0)
  const [voiceAdded, setVoiceAdded] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 1600)
  }

  const submit = () => {
    const trimmedText = text.trim()
    if (!level) {
      showToast('请先选择要送的草莓')
      return
    }
    if (!trimmedText) {
      showToast('请先写下对销售小管家的反馈')
      return
    }
    if (trimmedText.length <= MIN_REVIEW_TEXT_LENGTH) {
      showToast('请至少输入 6 个字后再赠送')
      return
    }
    addReview({ id: 'r-' + Date.now(), dimension: 'sales', strawberryLevel: level, text: trimmedText, createdAt: nowText() })
    setText('')
    setLevel(null)
    setAnonymous(false)
    setImageCount(0)
    setVoiceAdded(false)
    showToast('已赠送给销售小管家')
  }

  return (
    <div className="px-4 mt-3 space-y-3">
      <div className="paper-card p-4 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cinnabar/8" />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cinnabar text-white shrink-0"><Headset size={19} /></div>
            <div className="min-w-0 flex-1">
              <div className="font-song t-h2 text-ink font-bold">小李 · 共比邻旅游小管家</div>
            </div>
          </div>
          <div className="mt-3 rounded-2xl bg-rice px-3 py-2.5">
            <div className="t-cap">服务订单</div>
            <div className="mt-1 line-clamp-2 text-[13px] font-semibold leading-relaxed text-ink">{UPCOMING_SERVICE_ORDER}</div>
          </div>
          <StrawberryPicker value={level} onChange={setLevel} />
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="说说为什么给销售小管家送这颗草莓…" rows={3} className="mt-3 w-full p-3 rounded-xl border border-line bg-rice text-ink t-body focus:outline-none focus:border-cinnabar resize-none" />
          <GiftActionRow
            anonymous={anonymous}
            onAnonymousChange={setAnonymous}
            onImageClick={() => { setImageCount((count) => count + 1); showToast('已添加图片') }}
            onVoiceClick={() => { setVoiceAdded(true); showToast('已添加语音') }}
            imageCount={imageCount}
            voiceAdded={voiceAdded}
          />
          <button onClick={submit} className="btn-primary w-full h-11 mt-4 flex items-center justify-center gap-1.5 text-[16px]"><Send size={16} /> 点击赠送草莓</button>
          <div className="mt-2 text-center text-[12px] leading-relaxed text-inkSoft">感谢您的监督，帮助我们做得更好。</div>
        </div>
      </div>
      <PostDepartureStrawberrySection />
      <ReviewHistory reviews={reviews} onRemove={removeReview} className="mt-4" />
      {toast && <div className="mx-auto w-fit rounded-full bg-ink px-3 py-1.5 text-[13px] text-white animate-slideIn">{toast}</div>}
    </div>
  )
}

function PostDepartureStrawberrySection({ className = '' }: { className?: string }) {
  return (
    <section className={className}>
      <SectionTitle icon={ClipboardList}>出发后可以送的草莓</SectionTitle>
      <div className="paper-card p-4">
        <div className="grid grid-cols-3 gap-2">{duringReviewDimensions.filter((k) => k !== 'sales').map((k) => <LockedDimension key={k} dim={k} />)}</div>
      </div>
    </section>
  )
}

function LockedDimension({ dim }: { dim: Dim }) {
  const m = dimensionMeta[dim]
  const isOverall = dim === 'overall'
  return <div className={`rounded-2xl border border-line bg-rice px-2 py-3 text-center opacity-75 ${isOverall ? 'col-span-3' : ''}`}><div className="text-[24px] leading-none mb-1">{m.emoji}</div><div className="text-[14px] font-semibold text-ink">{m.label}</div><div className="t-cap">{m.hint}</div></div>
}

function ReviewHistory({ reviews, onRemove, className = 'px-4 mt-4' }: { reviews: Review[]; onRemove: (id: string) => void; className?: string }) {
  return (
    <div className={className}>
      <SectionTitle className="mb-2 pt-5 pb-2">我送出的草莓</SectionTitle>
      <TripHistoryInfo />
      {reviews.length === 0 ? <div className="paper-card p-6 text-center t-cap">还没有送出草莓，期待您的第一条反馈～</div> : <ul className="m-0 list-none space-y-2.5 p-0">{reviews.map((r) => {
        const d = dimensionMeta[r.dimension]
        const s = strawberryMeta[levelOf(r)]
        return <li key={r.id} className="paper-card p-3.5"><div className="flex items-center gap-2 mb-1"><span className="text-[18px]" style={{ filter: levelOf(r) === 'green' ? 'hue-rotate(95deg) saturate(1.4)' : levelOf(r) === 'rotten' ? 'grayscale(0.75) brightness(0.75)' : undefined }}>{s.emoji}</span><span className="text-[12px] px-1.5 py-0.5 rounded" style={{ background: s.bg, color: s.color }}>{s.label} · {s.meaning}</span><span className="text-[12px] px-1.5 py-0.5 rounded" style={{ background: d.color + '22', color: d.color }}>{d.label}</span><span className="t-cap ml-auto">{r.createdAt}</span></div><p className="t-body text-ink leading-relaxed">{r.text}</p><div className="mt-1.5 flex justify-end"><button onClick={() => onRemove(r.id)} className="t-cap text-fog flex items-center gap-0.5"><Trash2 size={12} /> 删除</button></div></li>
      })}</ul>}
    </div>
  )
}

function TripHistoryInfo() {
  return (
    <div className="mb-5 mt-1 space-y-1 px-1 text-[15px] leading-relaxed text-inkSoft">
      {HISTORY_TRIPS.map((trip) => <div key={trip}>{HISTORY_TRIPS.length === 1 ? trip.replace(/^行程：/, '') : trip}</div>)}
    </div>
  )
}

function IdleReview() {
  const [toast, setToast] = useState<string | null>(null)
  const saveQrCode = () => {
    setToast('已保存到相册')
    setTimeout(() => setToast(null), 1600)
  }

  return (
    <div className="px-4 mt-3">
      <div className="paper-card p-6 text-center">
        <div className="font-song t-title text-ink">您没有送草莓的行程</div>
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

function nowText() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
