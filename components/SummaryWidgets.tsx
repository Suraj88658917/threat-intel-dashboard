// components/SummaryWidgets.tsx
import { useMemo } from 'react'
import { useIOCStore } from '../store/iocStore'
import { motion } from 'framer-motion'
import ChartComponent from './ChartComponent'

export default function SummaryWidgets() {
  const iocs = useIOCStore(s => s.iocs)

  const counts = useMemo(() => {
    const total = iocs.length
    const ips = iocs.filter(i => i.type === 'ip').length
    const urls = iocs.filter(i => i.type === 'url').length
    const subnets = iocs.filter(i => i.type === 'subnet').length
    return { total, ips, urls, subnets }
  }, [iocs])

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-6">
        <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 }} className="col-span-2 p-4 rounded-2xl shadow-sm bg-white dark:bg-gray-800 border dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total IOCs</div>
              <div className="text-3xl font-bold mt-2">{counts.total}</div>
              <div className="text-sm text-gray-500 mt-1">IPs: {counts.ips} • Subnets: {counts.subnets} • URLs: {counts.urls}</div>
            </div>

            <div className="w-48 h-20">
              {/* small summary chart */}
              <ChartComponent compact />
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500">Interactive: use filters and search to refine results. Cards animate on data changes.</div>
        </motion.div>

        <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="p-4 rounded-2xl shadow-sm bg-white dark:bg-gray-800 border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Top Source</div>
              <div className="text-xl font-semibold mt-1">{topSource(iocs)}</div>
            </div>
            <div className="text-sm text-gray-500">Live</div>
          </div>

          <div className="mt-3 text-xs text-gray-500">The most frequent feed source in the current dataset.</div>
        </motion.div>
      </div>
    </>
  )
}

function topSource(iocs: any[]) {
  if (!iocs.length) return '—'
  const map = new Map<string, number>()
  for (const i of iocs) map.set(i.source, (map.get(i.source) ?? 0) + 1)
  const sorted = Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  return sorted[0][0]
}
