import create from 'zustand'
import axios from 'axios'

export type IOCType = 'ip' | 'subnet' | 'url'
export type IOCSource = 'blocklist.de' | 'spamhaus' | 'digitalside'

export type IOC = {
  value: string
  type: IOCType
  source: IOCSource
  timestamp: string
}

type State = {
  iocs: IOC[]
  loading: boolean
  error?: string
  lastFetched?: string
  filters: {
    types: IOCType[]
    sources: IOCSource[]
    search: string
    sortBy: 'latest' | 'alpha'
  }
  page: number
  pageSize: number
  fetchIntervalMin: number
  autoFetch: boolean
  fetchIOCs: (opts?: { since?: string; replace?: boolean }) => Promise<void>
  setFilters: (patch: Partial<State['filters']>) => void
  setPage: (p: number) => void
  setConfig: (conf: Partial<Pick<State, 'fetchIntervalMin' | 'autoFetch' | 'pageSize'>>) => void
}

export const useIOCStore = create<State>((set, get) => ({
  iocs: [],
  loading: false,
  lastFetched: undefined,
  error: undefined,
  filters: { types: [], sources: [], search: '', sortBy: 'latest' },
  page: 1,
  pageSize: 10,
  fetchIntervalMin: 5,
  autoFetch: false,

  fetchIOCs: async ({ since, replace } = {}) => {
    set({ loading: true, error: undefined })
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || ''
      const q = since ? `?since=${encodeURIComponent(since)}` : ''
      const res = await axios.get(`${base}/api/iocs${q}`)
      const data = res.data?.data ?? []
      const existing = get().iocs
      const merged = replace ? data : [...existing, ...data]
      const map = new Map<string, IOC>()
      ;(merged as IOC[]).forEach((i) => {
        map.set(i.value, i)
      })
      const uniq = Array.from(map.values())
      uniq.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      set({ iocs: uniq, loading: false, lastFetched: new Date().toISOString() })
    } catch (err: any) {
      set({ loading: false, error: err?.message ?? 'Fetch failed' })
    }
  },

  setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch }, page: 1 })),
  setPage: (p) => set({ page: p }),
  setConfig: (conf) => set((s) => ({ ...s, ...conf } as any))
}))
