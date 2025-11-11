import { AlertTriangle, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatSol } from '@/lib/utils'

interface ConfirmBetDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  amount: number
  outcome: 'YES' | 'NO'
  eventTitle: string
  isLoading?: boolean
}

export function ConfirmBetDialog({
  isOpen,
  onClose,
  onConfirm,
  amount,
  outcome,
  eventTitle,
  isLoading = false,
}: ConfirmBetDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Confirm Large Bet
          </DialogTitle>
          <DialogDescription>
            You are about to place a large bet. Please review the details below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Event</p>
              <p className="text-sm font-medium truncate">{eventTitle}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bet Amount</p>
                <p className="text-lg font-semibold">{formatSol(amount)} SOL</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Outcome</p>
                <p className="text-lg font-semibold">
                  <span className={outcome === 'YES' ? 'text-green-600' : 'text-red-600'}>
                    {outcome}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Warning:</strong> This is a significant amount. Please double-check your bet details before confirming.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Placing Bet...
              </>
            ) : (
              'Confirm Bet'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}