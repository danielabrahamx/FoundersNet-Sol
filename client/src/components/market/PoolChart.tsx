import { useState, useEffect } from 'react'
import { Market } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { lamportsToSol } from '@/lib/utils'
import { addPoolSnapshot, getPoolSnapshots } from '@/lib/chartData'

interface PoolChartProps {
  market: Market
}

type Timeframe = '1h' | '24h' | '7d' | 'all'

export function PoolChart({ market }: PoolChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('24h')
  const yesPoolSol = lamportsToSol(market.yesPool)
  const noPoolSol = lamportsToSol(market.noPool)
  const totalPool = yesPoolSol + noPoolSol

  // Add snapshot whenever market data changes
  useEffect(() => {
    addPoolSnapshot(market.publicKey.toString(), market)
  }, [market, market.yesPool, market.noPool])

  // Get historical data for the selected timeframe
  const snapshots = getPoolSnapshots(market.publicKey.toString(), timeframe)

  // Format data for the chart
  const chartData = snapshots.map(snapshot => ({
    timestamp: snapshot.timestamp,
    time: new Date(snapshot.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    yesPool: snapshot.yesPool,
    noPool: snapshot.noPool,
  }))

  // Show current prices if no historical data
  if (chartData.length === 0) {
    chartData.push({
      timestamp: Date.now(),
      time: 'Now',
      yesPool: yesPoolSol,
      noPool: noPoolSol,
    })
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const yesValue = payload.find((p: any) => p.dataKey === 'yesPool')?.value || 0
      const noValue = payload.find((p: any) => p.dataKey === 'noPool')?.value || 0
      const total = yesValue + noValue
      const yesPercentage = ((yesValue / total) * 100).toFixed(1)
      const noPercentage = ((noValue / total) * 100).toFixed(1)

      return (
        <div className="bg-background border border-border rounded-md p-3 shadow-md">
          <p className="text-xs text-muted-foreground mb-2">{payload[0].payload.time}</p>
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
            YES: ◎{yesValue.toFixed(2)} ({yesPercentage}%)
          </p>
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
            NO: ◎{noValue.toFixed(2)} ({noPercentage}%)
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Total: ◎{total.toFixed(2)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Pool Distribution</CardTitle>
          <div className="flex gap-1">
            {(['1h', '24h', '7d', 'all'] as Timeframe[]).map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className="text-xs"
                aria-label={`View ${tf} timeframe`}
              >
                {tf.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="time"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => value}
              />
              <YAxis
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => `◎${value.toFixed(0)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="yesPool"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
                name="YES Pool"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="noPool"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
                name="NO Pool"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Current Total Pool: ◎{totalPool.toFixed(2)}
          </p>
          <div className="flex justify-center gap-6 mt-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600" />
              <span className="text-muted-foreground">YES: ◎{yesPoolSol.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600" />
              <span className="text-muted-foreground">NO: ◎{noPoolSol.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}