import { useMemo } from 'react'
import { Program } from '@coral-xyz/anchor'
import { useWallet } from './useWallet'
import { getProgram } from '@/lib/anchor'

/**
 * Hook to get the Anchor Program instance
 * Memoizes the program instance based on wallet state
 * @returns Program instance or null if wallet not connected
 */
export function useProgram(): Program | null {
  const { publicKey, signTransaction, signAllTransactions } = useWallet()

  return useMemo(() => {
    if (!publicKey || !signTransaction || !signAllTransactions) {
      return null
    }
    const walletInterface = {
      publicKey,
      signTransaction,
      signAllTransactions,
    }
    return getProgram(walletInterface)
  }, [publicKey, signTransaction, signAllTransactions])
}
