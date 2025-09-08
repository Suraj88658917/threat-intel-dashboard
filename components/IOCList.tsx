import IOCRow from './IOCRow'
import { useMemo } from 'react'
import { useIOCStore } from '../store/iocStore'

export default function IOCList() {
  const { iocs, filters, page, pageSize } = useIOCStore(s => ({ iocs: s.iocs, filters: s.filters, page: s.page, pageSize: s.pageSize }))
  const setPage = useIOCStore(s => s.setPage)

  const filtered = useMemo(() => {
    let data = iocs
    if (filters.types.length) data = data.filter(d => filters.types.includes(d.type))
    if (filters.sources.length) data = data.filter(d => filters.sources.includes(d.source))
    if (filters.search) data = data.filter(d => d.value.toLowerCase().includes(filters.search.toLowerCase()))
    if (filters.sortBy === 'alpha') data = data.slice().sort((a,b)=>a.value.localeCompare(b.value))
    else data = data.slice().sort((a,b)=>new Date(b.timestamp).getTime()-new Date(a.timestamp).getTime())
    return data
  }, [iocs, filters])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page-1)*pageSize, page*pageSize)

  return (
    <div className="mt-4">
      <div className="overflow-x-auto rounded bg-white dark:bg-gray-800 border dark:border-gray-700">
        <table className="w-full table-auto">
          <thead className="text-left text-sm text-gray-500 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map(i => <IOCRow key={i.value} ioc={i} />)}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="text-sm text-gray-500">Showing {(page-1)*pageSize+1} - {Math.min(page*pageSize, filtered.length)} of {filtered.length}</div>
        <div className="flex gap-2">
          <button onClick={() => setPage(Math.max(1, page-1))} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700">Prev</button>
          <div className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800">{page}/{totalPages}</div>
          <button onClick={() => setPage(Math.min(totalPages, page+1))} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700">Next</button>
        </div>
      </div>
    </div>
  )
}
