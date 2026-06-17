// 全局状态：Tab、送草莓、社区动态
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { DemoStage, TabKey, Review, Post, CommunityFilter } from '../types'
import { initialReviews } from '../data/mockReviews'
import { initialPosts } from '../data/mockPosts'

interface AppState {
  demoStage: DemoStage
  setDemoStage: (stage: DemoStage) => void

  activeTab: TabKey
  setTab: (tab: TabKey) => void
  communityPreferredFilter: CommunityFilter
  setCommunityPreferredFilter: (filter: CommunityFilter) => void
  tabBarVisible: boolean
  setTabBarVisible: (visible: boolean) => void

  reviews: Review[]
  addReview: (r: Review) => void
  removeReview: (id: string) => void

  posts: Post[]
  addPost: (p: Post) => void
  toggleLike: (id: string) => void

  user: { name: string; avatar: string }
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      demoStage: 'during',
      setDemoStage: (stage) => set({ demoStage: stage }),

      activeTab: 'me',
      setTab: (tab) => set({ activeTab: tab }),
      communityPreferredFilter: 'route',
      setCommunityPreferredFilter: (filter) => set({ communityPreferredFilter: filter }),
      tabBarVisible: true,
      setTabBarVisible: (visible) => set({ tabBarVisible: visible }),

      reviews: initialReviews,
      addReview: (r) => set((s) => ({ reviews: [r, ...s.reviews] })),
      removeReview: (id) => set((s) => ({ reviews: s.reviews.filter((r) => r.id !== id) })),

      posts: initialPosts,
      addPost: (p) => set((s) => ({ posts: [p, ...s.posts] })),
      toggleLike: (id) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === id
              ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }
              : p,
          ),
        })),

      user: { name: '张叔', avatar: '张' },
    }),
    {
      name: 'blink-app-store',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState) => {
        const state = persistedState as Partial<AppState>
        const existingReviews = Array.isArray(state.reviews) ? state.reviews : []
        const existingIds = new Set(existingReviews.map((review) => review.id))
        return {
          ...state,
          reviews: [...existingReviews, ...initialReviews.filter((review) => !existingIds.has(review.id))],
        }
      },
      partialize: (s) => ({
        demoStage: s.demoStage,
        communityPreferredFilter: s.communityPreferredFilter,
        reviews: s.reviews,
        posts: s.posts,
      }),
    },
  ),
)
