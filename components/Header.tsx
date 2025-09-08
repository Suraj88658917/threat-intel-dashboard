// components/Header.tsx
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useIOCStore } from '../store/iocStore'
import { motion } from 'framer-motion'

export default function Header() {
  const fetchIOCs = useIOCStore(s => s.fetchIOCs)
  const last = useIOCStore(s => s.lastFetched)
  const loading = useIOCStore(s => s.loading)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const prefers = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(prefers)
    if (prefers) document.documentElement.classList.add('dark')
  }, [])

  const toggleDark = () => {
    setDark(d => {
      const next = !d
      if (next) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
      return next
    })
  }

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      className="px-6 py-4 flex items-center justify-between border-b dark:border-gray-700 bg-white dark:bg-gray-900"
    >
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.35 }}
          className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M3 12h3l2 3 4-8 3 6 4-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>

        <div>
          <h1 className="text-xl font-semibold">Threat-Intel Dashboard</h1>
          <div className="text-xs text-gray-500 dark:text-gray-400">Realtime IOCs — mock feeds</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => fetchIOCs({ replace: false })}
          className="px-3 py-1 rounded bg-primary-500 text-white shadow hover:opacity-95"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>

        <Link href="/settings"className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm">Settings
        </Link>

        <button onClick={toggleDark} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm">
          {dark ? 'Light' : 'Dark'}
        </button>

        <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">
          {last ? `Last: ${new Date(last).toLocaleTimeString()}` : ''}
        </div>
      </div>
    </motion.header>
  )
}
