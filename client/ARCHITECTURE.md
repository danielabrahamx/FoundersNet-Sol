# Architecture Documentation

This document explains the core architectural decisions and systems that power the FoundersNet prediction market platform.

## Overview

FoundersNet is a pure decentralized application (dApp) built on Solana Devnet. The platform enables users to create and bet on fundraising prediction events without any backend infrastructure - all state and business logic reside on the Solana blockchain.

## Core Systems

### 1. Admin System

#### Admin Wallet Identification
The admin system is based on a hardcoded wallet address check:

```typescript
// src/lib/admin.ts
const ADMIN_WALLET = new PublicKey('78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g')

export function isAdmin(walletPublicKey: PublicKey | null): boolean {
  if (!walletPublicKey) return false
  return walletPublicKey.equals(ADMIN_WALLET)
}
```

#### Admin Privileges
- **Event Creation**: Only admin wallets can create new prediction events
- **Event Resolution**: Only admin wallets can resolve events and determine outcomes
- **Visual Indicators**: Admin users see a purple "Admin" badge in the header
- **Admin Routes**: Access to `/admin` route is restricted to admin users only

#### Security Considerations
- Admin checks are performed both client-side and on-chain
- The admin wallet address is stored as a constant in the Anchor program
- All admin actions require wallet signature confirmation

### 2. One Bet Per Event Enforcement

#### PDA-Based Position Tracking
The system enforces one bet per event using Program Derived Addresses (PDAs):

```rust
// Anchor program - PDA seeds
pub fn user_position(
    ctx: Context<PlaceBet>,
    amount: u64,
    outcome: BetOutcome,
) -> Result<()> {
    let user_position = &ctx.accounts.user_position;
    
    // PDA ensures one position per user per event
    let seeds = &[
        b"user_position",
        user.key.as_ref(),
        market.key.as_ref(),
    ];
    let bump = Pubkey::find_program_address(seeds, program_id).1;
    
    // If position exists, user has already bet
    if user_position.yesShares > 0 || user_position.noShares > 0 {
        return Err(ErrorCode::AlreadyBetOnEvent.into());
    }
}
```

#### Frontend Enforcement
The UI prevents duplicate bets by checking existing positions:

```typescript
// src/hooks/useHasPosition.ts
export function useHasPosition(marketId: string): boolean {
  const { data: positions = [] } = useUserPositions()
  
  return positions.some(position => 
    position.market.toString() === marketId && 
    (position.yesShares > 0 || position.noShares > 0)
  )
}
```

#### User Experience
- Users who have already bet see an "Already Placed Bet" message
- The trading widget is replaced with a link to view their portfolio
- This prevents confusion and duplicate transactions

### 3. Real-time WebSocket Subscriptions

#### Anchor Event Subscription System
The platform uses Anchor's WebSocket subscription for real-time updates:

```typescript
// src/hooks/useAccountSubscription.ts
export function useAccountSubscription(
  publicKey?: PublicKey,
  accountTypes?: string[]
) {
  const { connection } = useConnection()
  const program = useProgram()
  
  useEffect(() => {
    if (!publicKey || !program) return
    
    // Subscribe to account changes
    const subscriptionId = connection.onAccountChange(
      publicKey,
      (accountInfo) => {
        // Invalidate related queries to trigger refetch
        queryClient.invalidateQueries(['market'])
        queryClient.invalidateQueries(['userPositions'])
      }
    )
    
    return () => {
      connection.removeAccountChangeListener(subscriptionId)
    }
  }, [publicKey, program])
}
```

#### Subscription Targets
- **Market Accounts**: Subscribe to individual market accounts for real-time pool updates
- **User Position Accounts**: Subscribe to user's position accounts for portfolio updates
- **Program Accounts**: Subscribe to program-level changes for global updates

#### Performance Optimizations
- Subscriptions are only created when the relevant component is mounted
- Automatic cleanup on component unmount prevents memory leaks
- Query invalidation ensures UI updates without full page refresh

#### User Experience Benefits
- Pool percentages update in real-time as other users place bets
- Portfolio updates immediately after winning claims
- No need for manual page refreshes to see latest data

### 4. Pool-Splitting Payout Formula

#### Constant Product Market Maker
The platform uses a simplified constant product formula for pool management:

```typescript
// src/lib/calculations.ts
export function calculatePotentialPayout(
  amount: number,
  outcome: 'yes' | 'no',
  yesPool: number,
  noPool: number
): { payout: number; profit: number; profitPercent: number } {
  const totalPool = yesPool + noPool
  const shares = outcome === 'yes' 
    ? (amount * yesPool) / (yesPool + amount)
    : (amount * noPool) / (noPool + amount)
  
  // Payout = original bet + share of losing pool
  const losingPool = outcome === 'yes' ? noPool : yesPool
  const winningPool = outcome === 'yes' ? yesPool + amount : noPool + amount
  const totalWinningShares = outcome === 'yes' 
    ? (yesPool * amount) / (yesPool + amount) + yesPool
    : (noPool * amount) / (noPool + amount) + noPool
  
  const payout = (shares / totalWinningShares) * (winningPool + losingPool)
  
  return {
    payout,
    profit: payout - amount,
    profitPercent: ((payout - amount) / amount) * 100
  }
}
```

#### Pool Dynamics
1. **Initial State**: 50/50 split of initial liquidity
2. **Bet Placement**: 
   - YES bets increase YES pool and decrease YES odds
   - NO bets increase NO pool and decrease NO odds
3. **Payout Calculation**: Winners share the losing pool proportionally

#### Advantages
- **Dynamic Odds**: Odds automatically adjust based on market sentiment
- **Liquidity Provision**: Initial liquidity ensures always-available counterpart
- **Simple Mechanics**: Easy for users to understand potential returns

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── layout/           # Header, DevnetBadge, ThemeToggle
│   ├── market/           # MarketCard, MarketList, TradingWidget
│   ├── admin/            # Admin components
│   ├── portfolio/        # Portfolio components
│   ├── ui/              # Shadcn UI components
│   └── wallet/          # WalletButton, WalletModal
├── hooks/               # Custom React hooks
├── lib/                 # Utilities, constants, calculations
├── pages/               # Route components
└── types/               # TypeScript type definitions
```

### State Management

#### React Query for Server State
- **Markets**: `useMarkets()` - Fetches all market accounts
- **Market**: `useMarket(id)` - Fetches single market account
- **User Positions**: `useUserPositions()` - Fetches user's positions
- **Balance**: `useBalance()` - Fetches wallet SOL balance

#### Local State with useState
- Form inputs (bet amounts, event creation fields)
- UI state (selected outcomes, dialog visibility)
- Temporary state during transactions

#### WebSocket Integration
- Real-time subscriptions using Anchor's `connection.onAccountChange`
- Automatic query invalidation on account updates
- Cleanup on component unmount

### Routing Strategy

#### React Router v6
```typescript
// src/App.tsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Markets />} />
    <Route path="event/:eventId" element={<MarketDetail />} />
    <Route path="portfolio" element={<ProtectedRoute><PortfolioPage /></ProtectedRoute>} />
    <Route path="create" element={<ProtectedRoute><CreateMarketPage /></ProtectedRoute>} />
    <Route path="admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
  </Route>
</Routes>
```

#### Protected Routes
- Portfolio, Create, and Admin routes require wallet connection
- Automatic redirect to home with toast notification for unauthenticated users
- Admin routes additionally require admin wallet verification

## Blockchain Integration

### Anchor Program Architecture

#### Program Accounts
1. **Market Account**: Stores event data and pool information
2. **User Position Account**: PDA-based, one per user per event
3. **Program State**: Global program configuration

#### Key Instructions
1. **create_market**: Admin only, creates new prediction event
2. **place_bet**: Places YES/NO bet (one per user per event)
3. **resolve_market**: Admin only, resolves event with outcome
4. **claim_winnings**: Users claim winnings from resolved events

#### Error Handling
```rust
// Custom error codes for user-friendly messages
#[error_code]
pub enum ErrorCode {
    #[msg("You have already placed a bet on this event")]
    AlreadyBetOnEvent = 6007,
    #[msg("This market is no longer accepting bets")]
    MarketNotOpen = 6005,
    #[msg("Only the admin can resolve this market")]
    UnauthorizedResolver = 6009,
    // ... more error codes
}
```

### Wallet Integration

#### Solana Wallet Adapter
- **Multi-wallet Support**: Phantom, Solflare, Trust Wallet
- **Auto-connection**: Automatic wallet reconnection on page load
- **Transaction Signing**: All blockchain operations require user confirmation
- **Network Detection**: Ensures wallet is connected to Devnet

#### Transaction Flow
1. User initiates action (place bet, resolve event, etc.)
2. Frontend builds transaction using Anchor program
3. Wallet prompts for signature confirmation
4. Transaction is submitted to Solana network
5. Frontend shows pending state with toast notification
6. On confirmation, UI updates and shows success/error message

## Security Considerations

### Input Validation
- **Client-side**: React Hook Form with Zod validation
- **On-chain**: Anchor program validates all inputs
- **Amount Limits**: Minimum bet amounts and maximum balance checks

### Access Control
- **Admin Actions**: Verified both client-side and on-chain
- **Protected Routes**: Frontend route guards with redirects
- **Wallet Verification**: All actions require connected wallet

### Error Handling
- **User-Friendly Messages**: Technical errors translated to understandable messages
- **Graceful Degradation**: Network issues handled with retry mechanisms
- **Transaction Monitoring**: Pending transactions tracked until confirmation

## Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: Route-based code splitting with React.lazy
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Analysis**: Regular bundle size monitoring
- **Memoization**: React.memo and useMemo for expensive calculations

### Blockchain Optimizations
- **Batch Transactions**: Multiple operations combined where possible
- **Connection Pooling**: Reused RPC connections
- **Subscription Management**: Efficient WebSocket subscription cleanup
- **Query Caching**: TanStack Query with appropriate stale times

## Deployment Architecture

### Static Site Generation
- **Vite Build**: Optimized production builds
- **CDN Deployment**: Static assets served via CDN
- **Environment Variables**: Runtime configuration via environment variables

### Infrastructure
- **No Backend**: Pure frontend application
- **Blockchain State**: All state stored on Solana Devnet
- **Decentralized**: No single point of failure

This architecture ensures FoundersNet is truly decentralized, scalable, and maintainable while providing an excellent user experience.