import type { NextApiRequest, NextApiResponse } from 'next'
import iocs from '../../data/iocs.json'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { since } = req.query
  let results = iocs as any[]
  if (since && typeof since === 'string') {
    results = results.filter(r => new Date(r.timestamp) > new Date(since))
  }
  setTimeout(() => {
    res.status(200).json({ ok: true, data: results })
  }, 200)
}
