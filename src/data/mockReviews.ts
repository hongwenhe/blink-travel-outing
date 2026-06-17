// 送草莓维度与初始数据
import type { Review, StrawberryLevel } from '../types'

export const dimensionMeta: Record<
  Review['dimension'],
  { label: string; emoji: string; hint: string; color: string; stage: 'before' | 'during' }
> = {
  sales: { label: '销售小管家', emoji: '🎧', hint: '热情 / 负责 / 详细', color: '#C8483B', stage: 'before' },
  guide: { label: '导游', emoji: '🧭', hint: '讲解 / 服务态度', color: '#C8483B', stage: 'during' },
  butler: { label: '全陪小管家', emoji: '🤝', hint: '生活照料 / 行程陪伴', color: '#5C8A8A', stage: 'during' },
  transport: { label: '交通', emoji: '🚌', hint: '车况 / 司机 / 准点', color: '#3A6B8A', stage: 'during' },
  dining: { label: '餐食', emoji: '🍲', hint: '口味 / 卫生 / 份量', color: '#D9A35F', stage: 'during' },
  hotel: { label: '住宿', emoji: '🛏️', hint: '整洁 / 安静 / 便利', color: '#7A6A8A', stage: 'during' },
  spot: { label: '景点', emoji: '🏞️', hint: '体验 / 时间 / 动线', color: '#4A8A5C', stage: 'during' },
  overall: { label: '共比邻整体服务', emoji: '🏅', hint: '整体体验 / 安心感', color: '#B53E32', stage: 'during' },
}

export const strawberryMeta: Record<
  StrawberryLevel,
  { label: string; emoji: string; meaning: string; color: string; bg: string }
> = {
  red: { label: '红草莓', emoji: '🍓', meaning: '满意', color: '#C8483B', bg: '#FDE8E4' },
  green: { label: '青草莓', emoji: '🍓', meaning: '一般', color: '#4A8A5C', bg: '#E7F2E5' },
  rotten: { label: '烂草莓', emoji: '🍓', meaning: '不满意', color: '#6B5A48', bg: '#EFE5DA' },
}

export const duringReviewDimensions: Review['dimension'][] = [
  'guide',
  'butler',
  'transport',
  'dining',
  'hotel',
  'spot',
  'sales',
  'overall',
]

export const initialReviews: Review[] = [
  {
    id: 'r1',
    dimension: 'guide',
    strawberryLevel: 'red',
    text: '张导讲得太生动了，纳西古乐都听哭了，孩子下次还想跟着来。',
    createdAt: '2026-06-15 19:42',
  },
  {
    id: 'r2',
    dimension: 'dining',
    strawberryLevel: 'green',
    text: '汽锅鸡味道不错，腊排骨稍微有点咸，希望后面能清淡些。',
    createdAt: '2026-06-16 12:10',
  },
  {
    id: 'r3',
    dimension: 'butler',
    strawberryLevel: 'red',
    text: '全陪小管家一路提醒吃药和集合时间，老人跟着很安心。',
    createdAt: '2026-06-16 18:30',
  },
  {
    id: 'r4',
    dimension: 'transport',
    strawberryLevel: 'red',
    text: '车子干净，司机开得稳，行李也帮忙放好了。',
    createdAt: '2026-06-17 08:20',
  },
  {
    id: 'r5',
    dimension: 'hotel',
    strawberryLevel: 'green',
    text: '房间挺整洁，就是晚上走廊有人说话，稍微有点吵。',
    createdAt: '2026-06-17 09:05',
  },
  {
    id: 'r6',
    dimension: 'spot',
    strawberryLevel: 'red',
    text: '景点安排不赶，给我们留了拍照和休息的时间。',
    createdAt: '2026-06-17 11:18',
  },
  {
    id: 'r7',
    dimension: 'sales',
    strawberryLevel: 'red',
    text: '出发前小李把集合地点和证件要求讲得很清楚。',
    createdAt: '2026-06-17 13:26',
  },
  {
    id: 'r8',
    dimension: 'overall',
    strawberryLevel: 'red',
    text: '整体服务周到，家里老人第一次跟团也没有紧张。',
    createdAt: '2026-06-17 16:40',
  },
]
