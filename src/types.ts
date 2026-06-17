// 全局类型定义
export type TabKey = 'trip' | 'review' | 'community' | 'me'
export type DemoStage = 'before' | 'during' | 'duringBatch' | 'idle'
export type CommunityFilter = 'group' | 'route' | 'today' | 'all'

export type ItemType = 'transport' | 'meal' | 'hotel' | 'spot' | 'free'

export interface ItineraryItem {
  time: string
  type: ItemType
  title: string
  desc?: string
  duration?: string
}

export interface TripDay {
  date: string
  weekday: string
  title: string
  weather: string
  items: ItineraryItem[]
}

export interface TransportLeg {
  type: 'flight' | 'train' | 'bus'
  no: string
  from: string
  to: string
  departAt: string
  arriveAt: string
  seat: string
  gate?: string
  terminal?: string
}

export interface Staff {
  id: string
  role: 'guide' | 'butler' | 'volunteer' | 'driver'
  name: string
  title: string
  avatar: string
  phone: string
  desc: string
}

export interface Destination {
  city: string
  region: string
  summary: string
  climate: { summary: string; tips: string[] }
  customs: { summary: string; tips: string[] }
  notice: { summary: string; tips: string[] }
}

export interface Trip {
  id: string
  title: string
  cover: string
  startDate: string
  endDate: string
  origin: string
  destination: Destination
  transport: { outbound: TransportLeg; inbound: TransportLeg }
  staff: Staff[]
  days: TripDay[]
  tips: string[]
}

export type ReviewDimension =
  | 'sales'
  | 'guide'
  | 'butler'
  | 'transport'
  | 'dining'
  | 'hotel'
  | 'spot'
  | 'overall'
export type StrawberryLevel = 'red' | 'green' | 'rotten'

export interface Review {
  id: string
  dimension: ReviewDimension
  strawberryLevel: StrawberryLevel
  text: string
  createdAt: string
}

export interface Post {
  id: string
  author: { name: string; avatar: string }
  text: string
  images: string[]
  location?: string
  likes: number
  comments: number
  createdAt: string
  liked?: boolean
}
