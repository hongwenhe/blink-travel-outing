import { demoStageList, demoStageMeta, reviewDemoStageList } from '../data/demoStageMeta'
import { useAppStore } from '../store/useAppStore'
import type { DemoStage } from '../types'

const allOnlyStage = { label: '全部', shortLabel: '全部', badgeClass: 'bg-mountain/10 text-mountain border-mountain/20' }

export default function DemoStageSwitcher() {
  const demoStage = useAppStore((s) => s.demoStage)
  const setDemoStage = useAppStore((s) => s.setDemoStage)
  const activeTab = useAppStore((s) => s.activeTab)
  const isReview = activeTab === 'review'
  const isMe = activeTab === 'me'
  const stages = isReview ? reviewDemoStageList : demoStageList
  const effectiveStage = !isReview && demoStage === 'duringBatch' ? 'during' : demoStage
  const current = isMe ? allOnlyStage : demoStageMeta[effectiveStage]
  const displayLabel = (stage: DemoStage) => (isReview && stage === 'during' ? '行中A' : demoStageMeta[stage].shortLabel)

  if (isMe) {
    return (
      <div className="w-full max-w-[420px]">
        <div className="paper-card p-1.5">
          <div className="rounded-2xl bg-cinnabar px-3 py-3 text-center text-white shadow-paper">
            <div className="text-[15px] font-semibold tracking-wide">全部</div>
            <div className="mt-0.5 text-[11px] text-white/85">全部</div>
          </div>
        </div>
        <div className="mt-2 px-1 text-center">
          <span className={`inline-flex rounded-full border px-2.5 py-1 text-[12px] ${current.badgeClass}`}>
            当前演示：全部
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[420px]">
      <div className="paper-card p-1.5">
        <div className={`grid gap-1 ${isReview ? 'grid-cols-4' : 'grid-cols-3'}`}>
          {stages.map((stage) => {
            const meta = demoStageMeta[stage]
            const active = stage === effectiveStage
            return (
              <button
                key={stage}
                onClick={() => setDemoStage(stage as DemoStage)}
                className={`rounded-2xl px-3 py-3 text-center transition ${
                  active ? 'bg-cinnabar text-white shadow-paper' : 'bg-rice text-inkSoft'
                }`}
              >
                <div className="text-[15px] font-semibold tracking-wide">{displayLabel(stage as DemoStage)}</div>
                <div className={`mt-0.5 text-[11px] ${active ? 'text-white/85' : 'text-fog'}`}>
                  {meta.label}
                </div>
              </button>
            )
          })}
        </div>
      </div>
      <div className="mt-2 px-1 text-center">
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[12px] ${current.badgeClass}`}>
          当前演示：{current.label}
        </span>
      </div>
    </div>
  )
}
