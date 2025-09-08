// pages/index.tsx
import Head from 'next/head'
import Header from '../components/Header'
import SummaryWidgets from '../components/SummaryWidgets'
import FilterBar from '../components/FilterBar'
import IOCList from '../components/IOCList'
import usePolling from '../hooks/usePolling'
import { useIOCStore } from '../store/iocStore'
import ChartComponent from '../components/ChartComponent'

export default function Home() {
  usePolling()
  const loading = useIOCStore(s => s.loading)
  const last = useIOCStore(s => s.lastFetched)

  return (
    <div>
      <Head>
        <title>Threat-Intel Dashboard</title>
      </Head>

      <Header />

      <main className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <div className="text-sm text-gray-500">{loading ? 'Loading...' : last ? `Last: ${new Date(last).toLocaleString()}` : ''}</div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => window.scrollTo({ top: 9999, behavior: 'smooth' })} className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800">Jump to list</button>
          </div>
        </div>

        {/* Top widgets + small chart */}
        <SummaryWidgets />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <FilterBar />
            </div>

            <div className="bg-transparent p-0">
              <IOCList />
            </div>
          </div>

          <div>
            {/* Large chart card */}
            <ChartComponent />
          </div>
        </div>
      </main>
    </div>
  )
}
