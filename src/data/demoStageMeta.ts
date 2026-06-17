import type { DemoStage } from '../types'

export const demoStageMeta: Record<
  DemoStage,
  { label: string; shortLabel: string; desc: string; accentClass: string; badgeClass: string }
> = {
  before: {
    label: '出行前',
    shortLabel: '行前',
    desc: '展示用户出发前确认信息、倒计时和准备事项。',
    accentClass: 'text-gold',
    badgeClass: 'bg-gold/15 text-gold border-gold/30',
  },
  during: {
    label: '出行中',
    shortLabel: '行中',
    desc: '展示用户旅途中当天行程、送草莓和社区互动。',
    accentClass: 'text-cinnabar',
    badgeClass: 'bg-cinnabar/10 text-cinnabar border-cinnabar/25',
  },
  duringBatch: {
    label: '出行中 · B版',
    shortLabel: '行中B',
    desc: '展示用户一次性给多个服务维度送草莓的批量打分方案。',
    accentClass: 'text-cinnabar',
    badgeClass: 'bg-cinnabar/10 text-cinnabar border-cinnabar/25',
  },
  idle: {
    label: '无待出行订单',
    shortLabel: '空窗',
    desc: '展示当前没有待出行订单时的空状态与引导内容。',
    accentClass: 'text-mountain',
    badgeClass: 'bg-mountain/10 text-mountain border-mountain/20',
  },
}

export const demoStageList: DemoStage[] = ['before', 'during', 'idle']
export const reviewDemoStageList: DemoStage[] = ['before', 'during', 'duringBatch', 'idle']
