import { useEffect, useRef } from 'react'
import { useIOCStore } from '../store/iocStore'

export default function usePolling() {
  const fetchIOCs = useIOCStore((s) => s.fetchIOCs)
  const autoFetch = useIOCStore((s) => s.autoFetch)
  const intervalMin = useIOCStore((s) => s.fetchIntervalMin)
  const last = useIOCStore((s) => s.lastFetched)

  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    fetchIOCs({ replace: false })
  }, [])

  useEffect(() => {
    if (!autoFetch) return
    const ms = Math.max(1, intervalMin) * 60 * 1000
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = window.setInterval(() => {
      fetchIOCs({ since: last })
    }, ms)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [autoFetch, intervalMin, last])
}
