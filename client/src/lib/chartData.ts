import { Market } from '@/types'
import { lamportsToSol } from './utils'

export interface PoolSnapshot {
  timestamp: number
  yesPool: number
  noPool: number
  totalPool: number
}

const marketSnapshots = new Map<string, PoolSnapshot[]>()

export function addPoolSnapshot(marketId: string, market: Market) {
  const yesPool = lamportsToSol(market.yesPool)
  const noPool = lamportsToSol(market.noPool)

  const snapshot: PoolSnapshot = {
    timestamp: Date.now(),
    yesPool,
    noPool,
    totalPool: yesPool + noPool,
  }

  const existing = marketSnapshots.get(marketId) || []
  existing.push(snapshot)
  if (existing.length > 100) existing.shift()
  marketSnapshots.set(marketId, existing)
}

export function getPoolSnapshots(
  marketId: string,
  timeframe: '1h' | '24h' | '7d' | 'all'
): PoolSnapshot[] {
  const snapshots = marketSnapshots.get(marketId) || []
  const now = Date.now()
  const cutoff = {
    '1h': now - 3600000,
    '24h': now - 86400000,
    '7d': now - 604800000,
    'all': 0,
  }[timeframe]

  return snapshots.filter(s => s.timestamp >= cutoff)
}
