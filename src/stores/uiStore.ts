import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'
export type Lang = 'en' | 'ja'

interface UIState {
  theme: Theme
  lang: Lang
  sidebarCollapsed: boolean
  recentCountries: string[]
  favoriteIndicators: string[]
  setTheme: (theme: Theme) => void
  setLang: (lang: Lang) => void
  toggleSidebar: () => void
  addRecentCountry: (iso3: string) => void
  toggleFavoriteIndicator: (code: string) => void
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.classList.toggle('dark', prefersDark)
  } else {
    root.classList.toggle('dark', theme === 'dark')
  }
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      lang: (navigator.language.startsWith('ja') ? 'ja' : 'en') as Lang,
      sidebarCollapsed: false,
      recentCountries: [],
      favoriteIndicators: [],

      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },

      setLang: (lang) => set({ lang }),

      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),

      addRecentCountry: (iso3) => {
        const current = get().recentCountries.filter((c) => c !== iso3)
        set({ recentCountries: [iso3, ...current].slice(0, 10) })
      },

      toggleFavoriteIndicator: (code) => {
        const favs = get().favoriteIndicators
        if (favs.includes(code)) {
          set({ favoriteIndicators: favs.filter((f) => f !== code) })
        } else {
          set({ favoriteIndicators: [...favs, code] })
        }
      },
    }),
    {
      name: 'ui-store',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme)
        }
      },
    }
  )
)
