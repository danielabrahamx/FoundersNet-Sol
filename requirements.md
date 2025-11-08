# requirements.md: FoundersNet (Minimalist Devnet dApp)

This document defines the comprehensive functional and non-functional requirements for the FoundersNet Minimal dApp, a decentralized prediction market platform built on Solana Devnet.

## 1. Project Overview

| Attribute | Value |
| :--- | :--- |
| **Project Name** | FoundersNet Minimal dApp |
| **Version** | 1.0 (Minimum Viable Product) |
| **Purpose** | To provide a functional, end-to-end decentralized prediction market application for testing on the Solana Devnet. |
| **Target Audience** | Solana Developers, Early Adopters, and Testers. |
| **Scope** | Pure dApp with no backend server - all state and logic on Solana blockchain. |

## 2. Functional Requirements

### REQ-AUTH: Wallet Connection and User Identity

| ID | Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **REQ-AUTH-001** | The application MUST allow users to connect a Solana wallet (Phantom, Solflare, Backpack) upon loading. | High | User can click "Connect Wallet" and select from available wallet adapters. |
| **REQ-AUTH-002** | The application MUST display the connected wallet's public key (truncated to first 3 + last 3 characters) and current SOL balance. | High | Header shows "5Gx7...k3Pm" and "◎ 2.45 SOL" when connected. |
| **REQ-AUTH-003** | The application MUST allow the user to disconnect their wallet. | Medium | Dropdown menu includes "Disconnect" option that clears wallet state. |
| **REQ-AUTH-004** | The application MUST use the connected wallet's public key as the sole identifier for the user. | High | No username/email required. All user data derived from wallet address. |
| **REQ-AUTH-005** | The application MUST attempt to auto-reconnect to the last-used wallet on page load. | Medium | If user previously connected Phantom, app auto-connects on return visit. |
| **REQ-AUTH-006** | The application MUST handle wallet connection failures gracefully with clear error messages. | High | Shows "Failed to connect: User rejected request" toast notification. |

### REQ-MARKET: Market Management (On-Chain)

| ID | Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **REQ-MARKET-001** | The application MUST allow a connected user to create a new prediction market on the Solana Devnet. | High | User can access "/create" route and submit market creation form. |
| **REQ-MARKET-002** | The market creation process MUST require a Title, Description, Category, Resolution Date, and Initial Pool Deposit (in SOL). | High | Form validates all required fields before allowing submission. |
| **REQ-MARKET-003** | The application MUST display a list of all active (open) markets fetched directly from the Solana Devnet. | High | Dashboard shows all markets where status = "Open". |
| **REQ-MARKET-004** | The application MUST allow filtering markets by Status (Open, Resolved) and Category. | Medium | Filter dropdowns update the displayed market list. |
| **REQ-MARKET-005** | The application MUST allow sorting markets by Volume (descending), Resolution Date (ascending), and Recently Created. | Medium | Sort dropdown re-orders the market list accordingly. |
| **REQ-MARKET-006** | Market title MUST be between 10-200 characters. | High | Form shows error if title is too short or too long. |
| **REQ-MARKET-007** | Market description MUST be between 50-1000 characters. | High | Form shows error if description doesn't meet requirements. |
| **REQ-MARKET-008** | Resolution date MUST be at least 24 hours in the future from creation time. | High | Date picker prevents selection of dates less than 1 day ahead. |
| **REQ-MARKET-009** | Resolution date MUST NOT be more than 365 days in the future. | Medium | Date picker prevents selection of dates more than 1 year ahead. |
| **REQ-MARKET-010** | Initial pool deposit MUST be at least 0.5 SOL. | High | Form validates minimum deposit amount. |
| **REQ-MARKET-011** | Initial pool deposit MUST NOT exceed user's wallet balance minus 0.02 SOL (for transaction fees). | High | Form shows error if user tries to deposit more than available balance. |
| **REQ-MARKET-012** | Market category MUST be one of: Sports, Politics, Crypto, Entertainment, Other. | Medium | Dropdown only allows selection from predefined categories. |
| **REQ-MARKET-013** | The application MUST allow the designated resolver (market creator by default) to resolve the market after the Resolution Date has passed. | High | Resolver sees "Resolve Market" button after resolution date, others do not. |
| **REQ-MARKET-014** | Market resolution MUST allow three outcomes: YES wins, NO wins, or Invalid/Cancel. | High | Resolution interface provides three clear options. |
| **REQ-MARKET-015** | Markets MUST NOT be resolvable before the Resolution Date. | High | "Resolve Market" button is disabled with tooltip explaining why. |
| **REQ-MARKET-016** | Once resolved, markets MUST NOT allow any further trading. | Critical | Trading widget shows "Market Resolved" and disables trade button. |
| **REQ-MARKET-017** | The application MUST display each market's total volume, liquidity (pool sizes), and participant count. | Medium | Market detail view shows these stats prominently. |

### REQ-TRADE: Trading and Betting

| ID | Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **REQ-TRADE-001** | The application MUST allow a connected user to place a bet (buy YES or NO shares) on any open market. | High | Trading widget allows selection of YES or NO and submission of trade. |
| **REQ-TRADE-002** | The trading interface MUST clearly display the current price of YES and NO shares. | High | Shows "YES: ◎0.65" and "NO: ◎0.35" prominently. |
| **REQ-TRADE-003** | The trading interface MUST calculate and display the potential shares received and return before the user confirms the transaction. | High | Shows "You'll receive: 1.54 shares" and "Potential return: +53.8%". |
| **REQ-TRADE-004** | All trading actions MUST initiate a transaction to the Solana Devnet smart contract. | High | Clicking "Place Trade" triggers wallet signature request. |
| **REQ-TRADE-005** | Minimum trade size MUST be 0.01 SOL. | High | Form shows error if amount is less than 0.01 SOL. |
| **REQ-TRADE-006** | Maximum trade size MUST NOT exceed user's wallet balance minus 0.01 SOL (for fees). | High | Form validates against current wallet balance. |
| **REQ-TRADE-007** | Users MUST NOT be able to trade after the Resolution Date has passed. | Critical | Trading widget is disabled with message "Trading closed" if past resolution date. |
| **REQ-TRADE-008** | Transaction fees MUST be displayed before trade confirmation. | Medium | Shows "Estimated fee: ◎0.00025" in trade summary. |
| **REQ-TRADE-009** | The application MUST show the user's current position in a market (if any) before placing a new trade. | Medium | Widget shows "You hold: 5 YES shares (cost: ◎3.25)" above trade form. |
| **REQ-TRADE-010** | Trade amounts MUST be validated to 2 decimal places (0.01 SOL precision). | High | Input field only accepts numbers with up to 2 decimal places. |
| **REQ-TRADE-011** | Users MUST be able to see real-time price updates as they adjust trade amount. | Medium | Price and potential return update immediately as user types. |

### REQ-POSITION: User Positions and Settlements

| ID | Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **REQ-POSITION-001** | Users MUST be able to view all their active positions across all markets. | High | Portfolio view lists all markets user has traded in. |
| **REQ-POSITION-002** | Each position MUST display: Market name, Outcome (YES/NO), Shares held, Cost basis, Current value, Profit/Loss. | High | Portfolio table shows all these columns for each position. |
| **REQ-POSITION-003** | Profit/Loss MUST be calculated as: (Current Value - Cost Basis). | High | P&L is accurate based on current market prices. |
| **REQ-POSITION-004** | Profit/Loss MUST be color-coded: Green for profit, Red for loss, Gray for break-even. | Medium | Visual distinction makes it easy to see performance at a glance. |
| **REQ-POSITION-005** | Users MUST be able to filter positions by: All, Open Markets, Resolved Markets. | Medium | Filter dropdown shows only positions matching selected status. |
| **REQ-POSITION-006** | After market resolution, winning positions MUST show claimable winnings. | High | Resolved markets show "Claim Winnings" button if user won. |
| **REQ-POSITION-007** | Users MUST be able to claim their winnings from resolved markets. | High | "Claim Winnings" button triggers on-chain transaction to receive payout. |
| **REQ-POSITION-008** | Losing positions MUST clearly indicate total loss after resolution. | Medium | Shows "-100%" P&L in red for losing positions. |
| **REQ-POSITION-009** | The application MUST show lifetime portfolio summary: Total value, Total P&L, Win rate. | Medium | Portfolio header shows aggregate statistics. |

### REQ-VIEW: Views and Navigation

| ID | Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **REQ-VIEW-001** | The application MUST include a Market List view (Dashboard) accessible at "/" route. | High | Landing page shows all markets with filtering and sorting. |
| **REQ-VIEW-002** | The application MUST include a Market Detail view accessible at "/market/:marketId" route. | High | Clicking a market navigates to detailed view with trading interface. |
| **REQ-VIEW-003** | The application MUST include a Portfolio view accessible at "/portfolio" route. | High | Navigation includes "Portfolio" link that shows user's positions. |
| **REQ-VIEW-004** | The application MUST include a Create Market view accessible at "/create" route. | High | Navigation includes "Create" link that shows market creation form. |
| **REQ-VIEW-005** | The application MUST require wallet connection to access Portfolio and Create views. | High | Attempting to access these routes while disconnected redirects to home with message. |
| **REQ-VIEW-006** | The application MUST display a persistent header with navigation, wallet status, and Devnet indicator. | High | Header is visible on all pages with consistent layout. |
| **REQ-VIEW-007** | The application MUST use client-side routing with no page reloads. | Medium | Navigation between views is instant with no full page refresh. |
| **REQ-VIEW-008** | Market Detail view MUST include: Title, Description, Resolution date, Trading widget, Price chart, Recent trades, Market stats. | High | All key information is present on market detail page. |
| **REQ-VIEW-009** | Portfolio view MUST include: Position list, Transaction history, Portfolio summary. | High | User can see complete trading activity and current holdings. |

### REQ-DATA: Data Integrity and Blockchain State

| ID | Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **REQ-DATA-001** | All market state MUST be fetched directly from on-chain accounts. | Critical | No mock data or hardcoded markets - all data from Solana RPC. |
| **REQ-DATA-002** | Market data MUST be cached for no longer than 30 seconds. | High | TanStack Query staleTime set to 30 seconds or less. |
| **REQ-DATA-003** | User positions MUST be calculated from Program Derived Addresses (PDAs) associated with user's wallet. | High | Positions derived from on-chain PDAs, not stored locally. |
| **REQ-DATA-004** | The application MUST refetch market data when user navigates back to a view. | Medium | Leaving and returning to Markets view shows latest data. |
| **REQ-DATA-005** | Active market views MUST subscribe to account changes via WebSocket. | Medium | Market Detail page updates automatically when on-chain state changes. |
| **REQ-DATA-006** | The application MUST handle missing or invalid market data gracefully. | High | Corrupted market accounts are skipped, not crash the app. |
| **REQ-DATA-007** | All on-chain data queries MUST include appropriate error handling. | High | RPC failures show user-friendly error messages, not raw errors. |
| **REQ-DATA-008** | Price calculations MUST be performed on-chain or derived from on-chain pool ratios. | Critical | No client-side price manipulation - prices reflect true on-chain state. |

### REQ-ERROR: Error Handling and Recovery

| ID | Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **REQ-ERROR-001** | Transaction failures MUST display human-readable error messages. | High | "Insufficient funds" instead of "Error: 0x1" raw codes. |
| **REQ-ERROR-002** | Common errors MUST have specific messages: Insufficient balance, Market closed, Network error, Wallet rejection. | High | Each error type has a clear, actionable message. |
| **REQ-ERROR-003** | RPC timeouts MUST trigger automatic retry with exponential backoff (max 3 attempts). | Medium | Failed RPC calls automatically retry before showing error. |
| **REQ-ERROR-004** | Wallet disconnection MUST clear all user-specific data and redirect to home. | High | Disconnecting wallet clears portfolio data and shows connect prompt. |
| **REQ-ERROR-005** | The application MUST include error boundaries to prevent full app crashes. | High | Component errors show fallback UI, not blank screen. |
| **REQ-ERROR-006** | Network errors MUST show "Connection failed" message with "Retry" option. | Medium | Users can manually retry failed operations. |
| **REQ-ERROR-007** | Transaction errors MUST include a link to the failed transaction on Solscan. | Medium | Users can investigate failed transactions on block explorer. |
| **REQ-ERROR-008** | Form validation errors MUST appear inline below the relevant input field. | High | Users see validation feedback immediately, not on submit. |

### REQ-NOTIF: User Notifications and Feedback

| ID | Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **REQ-NOTIF-001** | Transaction submission MUST show "Pending" notification with transaction signature. | High | Immediately after signing, toast shows "Transaction submitted..." |
| **REQ-NOTIF-002** | Transaction confirmation MUST show "Success" notification within 2 seconds of finalization. | High | Toast updates to "Transaction confirmed!" with green check icon. |
| **REQ-NOTIF-003** | Transaction failures MUST show "Failed" notification with specific reason. | High | Toast shows "Transaction failed: Insufficient funds" with red X icon. |
| **REQ-NOTIF-004** | All transaction notifications MUST include a link to Solscan (Devnet). | Medium | "View on Solscan" link opens block explorer in new tab. |
| **REQ-NOTIF-005** | Pending notifications MUST NOT auto-dismiss until transaction confirms or fails. | High | Pending toast remains visible until outcome is known. |
| **REQ-NOTIF-006** | Success and error notifications MUST auto-dismiss after 5-10 seconds. | Medium | Toasts disappear automatically but can be manually dismissed. |
| **REQ-NOTIF-007** | The application MUST show loading indicators during data fetching. | High | Skeleton screens or spinners appear while loading markets. |
| **REQ-NOTIF-008** | Empty states MUST have helpful messages and call-to-action. | Medium | "No markets found. Create the first one!" with button. |
| **REQ-NOTIF-009** | Form submissions MUST disable submit buttons and show loading state. | High | "Place Trade" button shows spinner and is disabled during transaction. |

### REQ-DEVNET: Devnet-Specific Features

| ID | Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **REQ-DEVNET-001** | The application MUST display a persistent "DEVNET MODE" indicator at all times. | Critical | Yellow badge in header always visible on all pages. |
| **REQ-DEVNET-002** | The DEVNET indicator MUST NOT be dismissible. | Critical | No "X" or close button - always present. |
| **REQ-DEVNET-003** | The application MUST provide an "Airdrop SOL" function in the wallet dropdown. | High | Connected users see "Airdrop 1 SOL" button. |
| **REQ-DEVNET-004** | Airdrop function MUST call `connection.requestAirdrop()` for 1 SOL. | High | Clicking airdrop requests 1 SOL from Devnet faucet. |
| **REQ-DEVNET-005** | Airdrop success MUST update the displayed wallet balance. | High | Balance updates to reflect airdropped SOL. |
| **REQ-DEVNET-006** | Airdrop failures MUST show clear error message (rate limit or network). | Medium | Toast shows "Airdrop failed: Rate limited" or similar. |
| **REQ-DEVNET-007** | All Solscan links MUST point to devnet.solscan.io. | High | No mainnet links - all explorer links use Devnet cluster. |
| **REQ-DEVNET-008** | The RPC endpoint MUST be configured to Solana Devnet. | Critical | Environment variable or hardcoded to https://api.devnet.solana.com |
| **REQ-DEVNET-009** | The application MUST warn users if balance is below 0.1 SOL. | Medium | "Low balance. Airdrop SOL for testing." message in wallet dropdown. |
| **REQ-DEVNET-010** | The application MUST use Devnet Program ID (from deployed Anchor program). | Critical | All transactions target the correct Devnet program address. |

### REQ-CHART: Data Visualization

| ID | Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **REQ-CHART-001** | Market Detail MUST include a price chart showing YES and NO price history. | Medium | Chart displays two lines (green for YES, red for NO). |
| **REQ-CHART-002** | Price chart MUST support timeframe selection: 1H, 24H, 7D, All. | Low | Tabs or buttons allow switching between time ranges. |
| **REQ-CHART-003** | Price chart MUST show price (0-1 SOL) on Y-axis and time on X-axis. | Medium | Chart is properly labeled and easy to read. |
| **REQ-CHART-004** | Price chart MUST show tooltip with exact values on hover. | Low | Hovering shows "YES: ◎0.65 at 2:30 PM". |
| **REQ-CHART-005** | If historical data is unavailable, chart MUST show current price only. | Medium | For newly created markets, shows flat line at current price. |
| **REQ-CHART-006** | Chart MUST be responsive and readable on mobile devices. | Medium | Chart scales appropriately for small screens. |

### REQ-HISTORY: Transaction History

| ID | Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **REQ-HISTORY-001** | Portfolio view MUST include a transaction history section. | Medium | Shows chronological list of all user's trades. |
| **REQ-HISTORY-002** | Each transaction MUST display: Date/time, Market name, Action (Buy YES/NO), Amount, Price, Transaction signature. | Medium | All key details visible for each trade. |
| **REQ-HISTORY-003** | Transaction signatures MUST link to Solscan (Devnet). | Medium | Clicking signature opens transaction on block explorer. |
| **REQ-HISTORY-004** | Transaction history MUST be sorted by date (most recent first). | Medium | Latest trades appear at the top. |
| **REQ-HISTORY-005** | If user has no transaction history, MUST show empty state. | Low | "You haven't placed any trades yet" message. |

## 3. Non-Functional Requirements

### Performance

| ID | Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **PERF-001** | All on-chain data retrieval (market lists, balances) MUST complete within 3 seconds under normal network conditions. | High | Markets load within 3 seconds on standard internet connection. |
| **PERF-002** | Initial page load (First Contentful Paint) MUST occur within 1.5 seconds. | Medium | Core UI renders quickly on first visit. |
| **PERF-003** | Client JavaScript bundle MUST be under 500KB (gzipped). | Medium | Optimized bundle size for fast loading. |
| **PERF-004** | The application MUST use code-splitting for routes to minimize initial bundle. | Low | Dashboard, Portfolio, Create loaded as separate chunks. |
| **PERF-005** | Market listings MUST use virtualization if displaying more than 50 markets. | Low | Large lists scroll smoothly without lag. |
| **PERF-006** | WebSocket subscriptions MUST be cleaned up when components unmount. | High | No memory leaks from abandoned subscriptions. |
| **PERF-007** | The application MUST debounce user inputs (search, filters) by 300ms. | Low | Typing in search doesn't trigger excessive re-renders. |

### Security

| ID | Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **SEC-001** | All transactions MUST be signed client-side via the user's wallet, with private keys never exposed to the application. | Critical | Application never has access to private keys. |
| **SEC-002** | The application MUST validate all user inputs before submitting to blockchain. | High | Form validation prevents invalid data from reaching smart contract. |
| **SEC-003** | The application MUST use HTTPS in production deployment. | High | All traffic encrypted in transit. |
| **SEC-004** | The application MUST sanitize any user-generated content (market descriptions) to prevent XSS. | High | No script injection possible through market descriptions. |
| **SEC-005** | The application MUST NOT store sensitive data (private keys, seed phrases) in localStorage or sessionStorage. | Critical | No sensitive data persisted in browser storage. |
| **SEC-006** | The application MUST verify Program Derived Addresses (PDAs) are correctly derived. | High | Cannot manipulate PDAs to access other users' data. |
| **SEC-007** | All external links (Solscan) MUST open in new tab with `rel="noopener noreferrer"`. | Medium | Prevents tabnapping attacks. |

### Usability

| ID | Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **USE-001** | The application MUST be fully responsive and usable on mobile (375px), tablet (768px), and desktop (1024px+) devices. | High | All features accessible and readable at all breakpoints. |
| **USE-002** | All interactive elements MUST have minimum 44x44px touch targets on mobile. | Medium | Buttons and links are easy to tap on touchscreens. |
| **USE-003** | The application MUST use clear, concise labels for all buttons and actions. | High | No ambiguous "Submit" or "OK" buttons - use "Place Trade", "Create Market". |
| **USE-004** | Form validation errors MUST appear inline and be immediately visible. | High | Users see errors as they type or on blur, not just on submit. |
| **USE-005** | The application MUST show loading states for all async operations. | High | Users never see blank screens - always skeleton or spinner. |
| **USE-006** | The application MUST provide empty states with helpful calls-to-action. | Medium | Empty states guide users on what to do next. |
| **USE-007** | All monetary amounts MUST be displayed with SOL symbol (◎) and appropriate decimal places. | Medium | Consistent formatting throughout: "◎1.23" not "1.23 SOL". |
| **USE-008** | Navigation MUST indicate the current active page. | Medium | Active tab/link has visual distinction (underline, color). |

### Reliability

| ID | Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **REL-001** | The application MUST gracefully handle Solana network errors (e.g., RPC failure, transaction failure) and provide clear user feedback. | High | Network issues show user-friendly messages, not technical errors. |
| **REL-002** | The application MUST continue functioning if individual markets have corrupted data. | Medium | Bad market data is skipped, rest of app continues working. |
| **REL-003** | The application MUST handle wallet disconnection mid-session without crashing. | High | Disconnecting wallet clears state gracefully. |
| **REL-004** | The application MUST retry failed RPC calls with exponential backoff (max 3 attempts). | Medium | Transient network issues self-recover. |
| **REL-005** | The application MUST include error boundaries to contain component failures. | High | Component errors don't crash entire application. |
| **REL-006** | The application MUST handle transaction timeouts (>30 seconds) with appropriate messaging. | Medium | Long-pending transactions eventually show timeout message. |

### Accessibility (A11Y)

| ID | Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **A11Y-001** | All interactive elements MUST be keyboard accessible (tab navigation). | High | Can navigate entire app using only keyboard. |
| **A11Y-002** | All form inputs MUST have associated labels (visible or aria-label). | High | Screen readers can identify all form fields. |
| **A11Y-003** | Color contrast MUST meet WCAG AA standards (4.5:1 for normal text). | Medium | Text is readable for users with visual impairments. |
| **A11Y-004** | All images and icons MUST have appropriate alt text or aria-labels. | Medium | Screen readers can describe all visual elements. |
| **A11Y-005** | Focus indicators MUST be clearly visible on all focusable elements. | High | Keyboard users can see which element has focus. |
| **A11Y-006** | The application MUST use semantic HTML (button, nav, main, article). | Medium | Assistive technologies understand page structure. |
| **A11Y-007** | Modals and dialogs MUST trap focus and be dismissible via Escape key. | High | Modal interactions are accessible. |
| **A11Y-008** | Error messages MUST be announced to screen readers via aria-live regions. | Medium | Screen reader users hear validation errors. |

### Compatibility

| ID | Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **COMPAT-001** | The application MUST work on Chrome/Chromium 90+, Firefox 88+, Safari 14+, and Brave 1.25+. | High | Tested and functional on all major browsers. |
| **COMPAT-002** | The application MUST work with Phantom, Solflare, and Backpack wallet extensions. | High | All three wallets can connect and sign transactions. |
| **COMPAT-003** | The application MUST be compatible with Solana Web3.js latest stable version. | High | Uses current Solana SDK. |
| **COMPAT-004** | The application MUST work with Anchor Framework latest stable version. | High | Compatible with current Anchor release. |

### Maintainability

| ID | Requirement | Priority | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **MAINT-001** | All code MUST be written in TypeScript with strict mode enabled. | High | No `any` types except where absolutely necessary. |
| **MAINT-002** | All components MUST use functional components with hooks (no class components). | Medium | Consistent React patterns throughout. |
| **MAINT-003** | The application MUST separate concerns: Components, hooks, utilities, types. | Medium | Clear directory structure as defined in tech-stack.md. |
| **MAINT-004** | All custom hooks MUST follow naming convention: `use[Name]`. | Low | Easy to identify custom hooks. |
| **MAINT-005** | All magic numbers MUST be extracted to constants. | Low | No hardcoded values scattered through code. |

## 4. Business Logic Specifications

### Market Mechanism (Simple Pool Betting)

| Attribute | Specification |
| :--- | :--- |
| **Model** | Simple pool betting - winners split the total pool. |
| **How it works** | Users bet SOL on YES or NO. All bets go into a single pool. |
| **Pricing** | No dynamic pricing - bets are placed at current pool ratio. |
| **Implied Odds** | `YES implied probability = YES_pool / TOTAL_pool` <br> `NO implied probability = NO_pool / TOTAL_pool` |
| **Example** | If 60 SOL bet on YES and 40 SOL on NO, total pool = 100 SOL <br> YES implied odds: 60% <br> NO implied odds: 40% |
| **Shares** | Each SOL bet = 1 share. If you bet 5 SOL on YES, you get 5 YES shares. |

### Settlement Logic (Pool Splitting)

| Outcome | Winner Payout | Loser Payout | Example |
| :--- | :--- | :--- | :--- |
| **YES Wins** | All YES bettors split the entire pool proportionally | NO bets are lost (0 SOL) | 100 SOL total pool, you hold 10 YES shares out of 60 total YES shares → you get (10/60) × 100 = 16.67 SOL |
| **NO Wins** | All NO bettors split the entire pool proportionally | YES bets are lost (0 SOL) | 100 SOL total pool, you hold 5 NO shares out of 40 total NO shares → you get (5/40) × 100 = 12.5 SOL |
| **Invalid/Cancel** | All bettors get their original bets refunded | Both YES and NO get refunds | You bet 5 SOL → you get 5 SOL back |

### Payout Calculation

**Formula for winners:**
```
Your Payout = (Your Shares / Total Winning Shares) × Total Pool
```

**Example:**
- Total pool: 100 SOL (60 YES, 40 NO)
- You bet: 10 SOL on YES (you have 10 YES shares)
- Outcome: YES wins
- Your payout: (10 / 60) × 100 = 16.67 SOL
- Your profit: 16.67 - 10 = 6.67 SOL (66.7% return)

### Fee Structure (MVP)

| Fee Type | Amount | Beneficiary |
| :--- | :--- | :--- |
| **Trading Fee** | 0% (no protocol fee for MVP) | N/A |
| **Transaction Fee** | ~0.00025 SOL (Solana network fee) | Solana validators |
| **Market Creation Fee** | Transaction fee only | Solana validators |

*Note: Protocol fees may be added in post-MVP versions*

## 5. Supporting Information

### Assumptions

| ID | Assumption |
| :--- | :--- |
| **A-001** | Users have a modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Brave 1.25+). |
| **A-002** | Users have a compatible Solana wallet extension installed (Phantom, Solflare, or Backpack). |
| **A-003** | Users are operating on the Solana Devnet and have access to Devnet SOL. |
| **A-004** | Users understand basic blockchain/Web3 concepts (wallets, transactions, gas fees). |
| **A-005** | The core market logic is implemented and deployed as a functional Anchor program on Devnet. |
| **A-006** | The Solana Devnet is operational and responsive (RPC endpoints available). |
| **A-007** | Users have JavaScript enabled in their browser. |
| **A-008** | The deployed Anchor program's IDL is available for generating TypeScript types. |

### Dependencies

| ID | Dependency | Type | Critical |
| :--- | :--- | :--- | :--- |
| **D-001** | Deployed Solana Anchor Program (Devnet) | Smart Contract | Yes |
| **D-002** | Solana Devnet RPC Endpoint | Infrastructure | Yes |
| **D-003** | @solana/web3.js library | NPM Package | Yes |
| **D-004** | @coral-xyz/anchor library | NPM Package | Yes |
| **D-005** | @solana/wallet-adapter-react | NPM Package | Yes |
| **D-006** | React 18+ | NPM Package | Yes |
| **D-007** | TanStack Query v5+ | NPM Package | Yes |
|
