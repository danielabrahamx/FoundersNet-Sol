# Testing Guide

This document outlines the critical testing flows and edge cases for the FoundersNet prediction market platform.

## Critical Testing Flows

### Flow 1: Admin Creates Event
1. **Setup**: Connect with admin wallet (`78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g`)
2. **Navigate**: Click "Admin" in header (should show admin badge)
3. **Create Event**: 
   - Fill in event title, description, event type, startup name
   - Set resolution date (must be in future)
   - Add initial liquidity (minimum 0.5 SOL)
   - Submit transaction
4. **Verify**: Event appears in main events list with correct details

### Flow 2: User Places Bet (Duplicate Prevention)
1. **Setup**: Connect with regular user wallet (not admin)
2. **Select Event**: Click on any active event
3. **Place Bet**:
   - Select YES or NO outcome
   - Enter amount (minimum 0.01 SOL)
   - Click "Place Bet"
   - Confirm transaction in wallet
4. **Verify**: 
   - Bet appears in portfolio
   - Event shows updated pool ratios
5. **Duplicate Test**:
   - Try to place another bet on same event
   - Should see "Already Placed Bet" message
   - Button should navigate to portfolio

### Flow 3: Admin Resolves Event & User Claims Winnings
1. **Admin Resolution**:
   - Admin navigates to resolved event
   - Uses admin panel to resolve event (YES/NO/INVALID)
   - Submits resolution transaction
2. **User Claims**:
   - User navigates to their portfolio
   - Finds resolved event with winning position
   - Clicks "Claim Winnings"
   - Confirms transaction
3. **Verify**: SOL transferred to user wallet, position marked as claimed

### Flow 4: Real-time Updates (WebSocket Testing)
1. **Setup**: Open application in two separate browser tabs
2. **Tab A**: Navigate to events list, stay on page
3. **Tab B**: Navigate to same event, place a bet
4. **Verify**: 
   - Tab A automatically updates pool ratios within 30 seconds
   - No page refresh required
   - Live indicator shows connection status

## Edge Cases to Test

### 1. Network Issues
- Disconnect internet connection
- Try to place bet → Should show network error
- Reconnect → Should automatically resume

### 2. Wallet Scenarios
- Connect/disconnect wallet multiple times
- Switch between different wallets
- Reject transaction in wallet
- Lock wallet during transaction

### 3. Invalid Inputs
- Bet amount below minimum (0.01 SOL)
- Bet amount exceeding wallet balance
- Negative numbers in bet amount
- Very large bet amounts (> 1 SOL should show confirmation)

### 4. Event State Changes
- Try to bet on resolved events
- Try to bet after resolution date passed
- Admin tries to resolve already resolved event

### 5. Browser Compatibility
- Test in Chrome, Firefox, Safari, Edge
- Test mobile browsers (iOS Safari, Android Chrome)
- Verify responsive design at 375px width

### 6. Accessibility Testing
- Navigate with keyboard only (Tab, Enter, Space, Arrow keys)
- Test screen reader compatibility
- Verify all interactive elements have aria-labels
- Check color contrast ratios

### 7. Performance Testing
- Load events list with 100+ events
- Test with slow network connection
- Memory usage over extended sessions

## Browser Testing Matrix

| Browser | Version | Desktop | Mobile | Notes |
|---------|---------|---------|--------|-------|
| Chrome | Latest+ | ✅ | ✅ | Primary development browser |
| Firefox | Latest+ | ✅ | ✅ | Check wallet adapter compatibility |
| Safari | Latest+ | ✅ | ✅ | Test iOS wallet connections |
| Edge | Latest+ | ✅ | ❌ | Windows-only testing |

## Mobile Testing Requirements

- **Touch Targets**: All buttons ≥ 44px
- **Responsive Layout**: Works at 375px width
- **Mobile Wallet**: Test Phantom mobile app integration
- **Orientation**: Test portrait and landscape
- **Scroll Behavior**: Smooth scrolling on long lists

## Keyboard Navigation Checklist

- [ ] Tab order follows logical flow
- [ ] All interactive elements reachable
- [ ] Focus indicators clearly visible
- [ ] Enter/Space activates buttons
- [ ] Escape closes dialogs/modals
- [ ] Arrow keys work in dropdowns

## Automated Testing Commands

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build

# Preview production build
npm run preview
```

## Test Data

### Admin Wallet
- Address: `78BDAjB4oTdjS4S734Ge2sRWWnHGDDJmPigbp27bSQ7g`
- Used for creating and resolving events

### Test Event Data
- Title: "Test Series A Funding"
- Description: "Will TechCorp raise Series A by Q3 2024?"
- Event Type: Series A
- Startup Name: TechCorp
- Initial Liquidity: 0.5 SOL
- Resolution Date: 30 days from creation

### Minimum Amounts
- Minimum Bet: 0.01 SOL
- Minimum Liquidity: 0.5 SOL
- Large Bet Confirmation: > 1.0 SOL