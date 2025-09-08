import { useState } from 'react'
import { useIOCStore, IOCType, IOCSource } from '../store/iocStore'

export default function FilterBar() {
  const filters = useIOCStore(s => s.filters)
  const setFilters = useIOCStore(s => s.setFilters)

  const toggleType = (t: IOCType) => {
    const present = filters.types.includes(t)
    setFilters({ types: present ? filters.types.filter(x => x !== t) : [...filters.types, t] })
  }
  const toggleSource = (sName: IOCSource) => {
    const present = filters.sources.includes(sName)
    setFilters({ sources: present ? filters.sources.filter(x => x !== sName) : [...filters.sources, sName] })
  }

  return (
    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
      <div className="flex gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm">Types:</label>
          {(['ip','subnet','url'] as IOCType[]).map(t => (
            <button key={t} onClick={() => toggleType(t)} className={`px-2 py-1 rounded ${filters.types.includes(t) ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">Sources:</label>
          {(['blocklist.de','spamhaus','digitalside'] as IOCSource[]).map(s => (
            <button key={s} onClick={() => toggleSource(s)} className={`px-2 py-1 rounded ${filters.sources.includes(s) ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <input value={filters.search} onChange={e=>setFilters({search:e.target.value})} placeholder="Search value..." className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 border dark:border-gray-700" />
        <select value={filters.sortBy} onChange={e=>setFilters({sortBy: e.target.value as any})} className="px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 border dark:border-gray-700">
          <option value="latest">Latest first</option>
          <option value="alpha">Alphabetical</option>
        </select>
      </div>
    </div>
  )
}
