// App - 顶层路由 / Tab 切换
import type { ComponentType } from 'react'
import DemoStageSwitcher from './components/DemoStageSwitcher'
import PhoneFrame from './components/PhoneFrame'
import TabBar from './components/TabBar'
import Home from './pages/Home'
import Trip from './pages/Trip'
import Review from './pages/Review'
import Community from './pages/Community'
import { useAppStore } from './store/useAppStore'
import type { TabKey } from './types'

const PAGES: Record<TabKey, ComponentType> = {
  trip: Trip,
  review: Review,
  community: Community,
  me: Home,
}

export default function App() {
  const demoStage = useAppStore((s) => s.demoStage)
  const activeTab = useAppStore((s) => s.activeTab)
  const setTab = useAppStore((s) => s.setTab)
  const tabBarVisible = useAppStore((s) => s.tabBarVisible)
  const Page = PAGES[activeTab]

  return (
    <PhoneFrame toolbar={<DemoStageSwitcher />}>
      <div className="relative h-full min-h-0 overflow-hidden bg-rice/80">
        <Page key={`${demoStage}-${activeTab}`} />
        {tabBarVisible && <TabBar active={activeTab} onChange={setTab} />}
      </div>
    </PhoneFrame>
  )
}
