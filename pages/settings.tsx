import Link from 'next/link'
import { useState } from 'react'
import { useIOCStore } from '../store/iocStore'

export default function Settings() {
  const fetchIntervalMin = useIOCStore(s => s.fetchIntervalMin)
  const autoFetch = useIOCStore(s => s.autoFetch)
  const pageSize = useIOCStore(s => s.pageSize)
  const setConfig = useIOCStore(s => s.setConfig)

  const [interval, setIntervalLocal] = useState(fetchIntervalMin)
  const [auto, setAuto] = useState(autoFetch)
  const [ps, setPs] = useState(pageSize)

  const save = () => {
    setConfig({ fetchIntervalMin: Number(interval), autoFetch: Boolean(auto), pageSize: Number(ps) })
    alert('Saved')
  }

  return (
    <div>
      <div className="p-6 border-b dark:border-gray-700">
        <Link href="/" className="text-sm">← Back</Link>
      </div>
      <main className="container mx-auto p-6">
        <h2 className="text-xl font-semibold">Settings</h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm text-gray-500">Auto Fetch</span>
            <select value={String(auto)} onChange={e=>setAuto(e.target.value === 'true')} className="mt-2 p-2 rounded">
              <option value="true">Enabled</option>
              <option value="false">Disabled</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-500">Fetch Interval (minutes)</span>
            <input type="number" value={interval} onChange={e=>setIntervalLocal(Number(e.target.value))} className="mt-2 p-2 rounded" />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-gray-500">Page Size</span>
            <input type="number" value={ps} onChange={e=>setPs(Number(e.target.value))} className="mt-2 p-2 rounded" />
          </label>
        </div>

        <div className="mt-6">
          <button onClick={save} className="px-4 py-2 rounded bg-primary-500 text-white">Save</button>
        </div>
      </main>
    </div>
  )
}
