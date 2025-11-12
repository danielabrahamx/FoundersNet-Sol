#!/bin/bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$HOME/.cargo/bin:$PATH"
cd /mnt/c/Users/danie/FoundersNet-Sol-1

echo "Checking devnet configuration..."
solana config get

echo ""
echo "Getting current balance..."
solana balance

echo ""
echo "Getting airdrop..."
solana airdrop 2

echo ""
echo "Deploying program to devnet..."
solana program deploy target/deploy/foundersnet.so

echo ""
echo "Deployment complete!"
solana address
