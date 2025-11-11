# FoundersNet - Prediction Market Platform

A decentralized prediction market platform built on Solana Devnet for fundraising events. This is a pure dApp with no backend - all state and logic reside on the Solana blockchain.

## 🚀 Installation & Setup

### Prerequisites

Before getting started, ensure you have:

- **Node.js 20+** (LTS recommended)
- **npm** package manager
- **Solana wallet extension** installed in your browser:
  - [Phantom Wallet](https://phantom.app/) (recommended)
  - [Solflare](https://solflare.com/)
  - [Trust Wallet](https://trustwallet.com/)

### Installation

1. **Navigate to the client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Review and update `.env` file:**
   ```env
   VITE_SOLANA_NETWORK=devnet
   VITE_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
   VITE_PROGRAM_ID=AkWgeWixTroxjHczNkhRbLmNBFpoP45rP3Zarg25zjg3
   VITE_ADMIN_WALLET=78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g
   ```

## 🏃 Development

Start the development server:

```bash
cd client
npm run dev
```

The application will be available at:
- **Local:** `http://localhost:5173`
- **Network:** `http://[your-ip]:5173` (accessible from other devices)

The server supports hot module replacement (HMR) - changes to your code will instantly reflect in the browser.

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Build and deploy:**
   ```bash
   npm run build
   vercel --prod
   ```

3. **Set environment variables in Vercel dashboard:**
   ```
   VITE_SOLANA_NETWORK=devnet
   VITE_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
   VITE_PROGRAM_ID=AkWgeWixTroxjHczNkhRbLmNBFpoP45rP3Zarg25zjg3
   VITE_ADMIN_WALLET=78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g
   ```

### Netlify Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   ```bash
   npx netlify deploy --prod --dir=dist
   ```

3. **Set environment variables in Netlify dashboard:**
   ```
   VITE_SOLANA_NETWORK=devnet
   VITE_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
   VITE_PROGRAM_ID=AkWgeWixTroxjHczNkhRbLmNBFpoP45rP3Zarg25zjg3
   VITE_ADMIN_WALLET=78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g
   ```

### Cloudflare Pages Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy with Wrangler:**
   ```bash
   npx wrangler pages publish dist --project-name=foundersnet
   ```

## 🧪 Testing

For comprehensive testing guidelines, see [TESTING.md](./TESTING.md).

### Quick Test Commands

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📋 Key Features

### Core Functionality
- ✅ **Event Creation**: Admin users can create fundraising prediction events
- ✅ **Betting System**: Users can place YES/NO bets on events
- ✅ **One Bet Per Event**: Enforced restriction to prevent multiple positions
- ✅ **Real-time Updates**: WebSocket-based live pool updates
- ✅ **Admin Resolution**: Admins can resolve events and determine outcomes
- ✅ **Winnings Claims**: Users can claim winnings from resolved events

### User Experience
- ✅ **Responsive Design**: Works on mobile, tablet, and desktop
- ✅ **Dark Mode**: Full dark/light theme support with persistence
- ✅ **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- ✅ **Loading States**: Skeleton screens and proper loading indicators
- ✅ **Error Handling**: User-friendly error messages and recovery
- ✅ **Large Bet Confirmations**: Dialog for bets > 1 SOL

### Wallet Integration
- ✅ **Multi-wallet Support**: Phantom, Solflare, Trust Wallet
- ✅ **Devnet Airdrops**: 1 SOL airdrop functionality
- ✅ **Balance Display**: Real-time SOL balance updates
- ✅ **Copy Address**: Easy wallet address copying
- ✅ **Transaction Links**: Direct links to Solscan for transactions

## 🏗️ Architecture

### Frontend Stack
- **React 18+** with TypeScript in strict mode
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn UI** components with Radix primitives
- **TanStack Query** for data fetching and caching
- **React Router** for client-side routing

### Blockchain Integration
- **Solana Devnet** for testing (no real funds at risk)
- **Anchor Framework** for program interaction
- **Wallet Adapter** for wallet connections
- **WebSocket Subscriptions** for real-time updates

### Key Components
- **Events List**: Browse and filter fundraising events
- **Event Detail**: In-depth view with betting widget
- **Portfolio**: Track user positions and transaction history
- **Admin Panel**: Create and resolve events (admin only)
- **Trading Widget**: Place bets with real-time pool updates

## 🔐 Security & Admin

### Admin System
- **Admin Wallet**: `78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g`
- **Admin Badge**: Visual indicator for admin users
- **Admin-only Routes**: Protected admin functionality
- **Event Resolution**: Secure admin-only resolution process

### Security Features
- **Input Validation**: Client-side and on-chain validation
- **Transaction Limits**: Minimum bet amounts and maximum checks
- **Error Handling**: Graceful failure with user-friendly messages
- **Rate Limiting**: Protection against rapid transactions

## 📊 Event Categories

Supported fundraising event types:
- **Series A**: Early-stage funding rounds
- **Series B**: Growth-stage funding rounds  
- **Acquisition**: Company acquisition events
- **IPO**: Initial public offering events
- **Other**: Custom fundraising events

## 💰 Betting Mechanics

### Pool System
- **50/50 Split**: Initial liquidity split equally between YES/NO pools
- **Dynamic Odds**: Odds change based on pool ratios
- **Payout Calculation**: Winners share the losing pool
- **One Position**: Maximum one bet per event per user

### Minimum Amounts
- **Minimum Bet**: 0.01 SOL
- **Minimum Initial Liquidity**: 0.5 SOL for event creation
- **Large Bet Confirmation**: Dialog for bets > 1 SOL

## 🌐 Environment Configuration

### Development Environment
```env
VITE_SOLANA_NETWORK=devnet
VITE_SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
VITE_PROGRAM_ID=AkWgeWixTroxjHczNkhRbLmNBFpoP45rP3Zarg25zjg3
VITE_ADMIN_WALLET=78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g
```

### Production Environment
Same variables as development, but ensure:
- Use HTTPS endpoints
- Set up proper monitoring
- Configure error tracking
- Enable analytics

## 📱 Browser Support

- **Chrome** 90+ (recommended)
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check [TESTING.md](./TESTING.md) for testing guidance
2. Review browser console for error messages
3. Verify wallet is connected to Devnet
4. Ensure sufficient SOL balance for transactions