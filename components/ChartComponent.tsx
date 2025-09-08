// components/ChartComponent.tsx
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip, Area, AreaChart, CartesianGrid } from 'recharts'
import { useMemo } from 'react'
import { useIOCStore } from '../store/iocStore'
import { motion } from 'framer-motion'

type Props = { compact?: boolean }

export default function ChartComponent({ compact = false }: Props) {
  const iocs = useIOCStore(s => s.iocs)

  // Aggregate counts per hour (or day if many)
  const data = useMemo(() => {
    if (!iocs || iocs.length === 0) return []
    // bucket by hour (YYYY-MM-DD HH:00)
    const map = new Map<string, number>()
    for (const i of iocs) {
      const d = new Date(i.timestamp)
      const key = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:00`
      map.set(key, (map.get(key) ?? 0) + 1)
    }
    // sort keys
    const arr = Array.from(map.entries()).sort((a,b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    return arr.map(([k,v]) => ({ time: k.replace(' 00:00',''), count: v }))
  }, [iocs])

  if (compact) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-4 rounded-2xl shadow-sm bg-white dark:bg-gray-800 border dark:border-gray-700">
      <div className="text-sm text-gray-500 mb-2">IOC Trends</div>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
            <Tooltip />
            <Area type="monotone" dataKey="count" stroke="#2563eb" fillOpacity={1} fill="url(#colorCount)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-xs text-gray-500">Counts are aggregated by hour (from IOC timestamps).</div>
    </motion.div>
  )
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}
