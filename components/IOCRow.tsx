import { IOC } from '../store/iocStore'
import { motion } from 'framer-motion'

export default function IOCRow({ ioc }: { ioc: IOC }) {
  return (
    <motion.tr initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <td className="px-4 py-3 font-mono text-sm w-1/3 break-all">{ioc.value}</td>
      <td className="px-4 py-3 text-sm">{ioc.type}</td>
      <td className="px-4 py-3 text-sm">{ioc.source}</td>
      <td className="px-4 py-3 text-sm">{new Date(ioc.timestamp).toLocaleString()}</td>
    </motion.tr>
  )
}
