## Helios Testnet App

This app guides users into the Helios ecosystem via wallet connection, XP-based progression, faucet claiming, NFT rewards, and leaderboard tracking — all with the help of Phaeton, our official mascot.

---

## Features

- Wallet Connection (EVM-compatible)
- Guided Onboarding Flow with Mascot Dialog
- Network Setup (Auto-add Helios Testnet to MetaMask)
- Faucet Claim Integration
- XP System & Progress Tracker
- NFT Badge Minting
- Leaderboard & Rank Display
- Contributor Role Application

---

## Tech Stack

- React 18
- Vite
- TypeScript
- wagmi v1 + viem
- ethers.js
- Zustand (state)
- Framer Motion (animations)
- tsparticles / react-particles (visual effects)
- TanStack React Query (data fetching)

---

## Installation

```bash
git clone https://github.com/helios-network/helios-testnet-app.git
cd helios-testnet-app
npm run install  # or yarn / npm install
npm run dev      # start local dev server
```

---

## Environment Setup

Create a `.env` file based on `.env.example` and set your environment variables:

```env
VITE_HELIOS_CHAIN_ID=0xA11
VITE_HELIOS_RPC_URL=https://rpc.testnet.helios.xyz
VITE_FAUCET_API_URL=https://api.testnet.helios.xyz/faucet
```

---

## Development Notes

- XP, badge, and step progress are tracked in frontend state and sync to backend via REST API.
- All wallet interactions are via wagmi + viem or `ethers.js` where needed.

---

## Contributing

Pull requests are welcome!  
To apply as a community contributor, you can also submit your GitHub or social links directly in the dashboard via the "Apply as Contributor" form.

---

## License

MIT — Helios Foundation 2025
