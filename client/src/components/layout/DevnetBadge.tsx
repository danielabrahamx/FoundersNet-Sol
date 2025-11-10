import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'

export function DevnetBadge() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700 cursor-help"
          aria-label="Devnet mode information"
        >
          ⚠️ DEVNET MODE
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        This app uses Solana Devnet. No real funds at risk.
      </TooltipContent>
    </Tooltip>
  )
}
