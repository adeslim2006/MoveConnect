# MoveConnect
The Frictionless Web3 Networking Layer on Sui.
MoveConnect is a decentralized networking dApp for builders on the sui network. It replaces physical business cards with "Crypto-Style" digital identities. By leveraging the Sui blockchain, we allow users to instantly connect, verify attendance at events via NFT badges, and manage their professional Web3 network through simple QR code interactions.

---

## 🚀 Key Features

### 1. Instant QR Connectivity
* **Scan-to-Connect:** Users can scan a personalized QR code to instantly fetch another user's on-chain profile.
* **Wallet-Native:** No database login required; the connection is established directly between Sui wallet addresses.

### 2. "Crypto-Style" Digital Business Cards
* **Dynamic Identity:** A sleek, dark-mode digital card displaying:
    * Profile Picture (NFT or Standard)
    * "About Me" Bio
    * Copyable Wallet Address (Truncated for UI, full copy on tap)
    * 4 Custom Social Links (Twitter/X, Telegram, Discord, LinkedIn)
* **Preconnections List:** When you scan a user, they are automatically added to your local "Preconnections" history, ensuring you never lose a contact even if you don't fully "friend" them on-chain immediately.

### 3. NFT Proof-of-Attendance (POAP) Badges
* **Event Verification:** Profiles proudly display NFT badges collected from various events (Hackathons, Workshops, Meetups).
* **Social Proof:** Badges act as on-chain verification of a user's activity and involvement in the ecosystem.
* **View Full Profile:** A detailed view allows users to inspect the full gallery of a contact's badges.

---

## 🛠 Tech Stack

* **Blockchain:** Sui Network (Testnet)
* **Smart Contracts:** Sui Move
* **Frontend:** Next.js / React
* **Wallet Integration:** @mysten/dapp-kit
* **Styling:** Tailwind CSS

---

## 📦 Smart Contract Architecture

The project relies on a minimal but efficient Object-Centric architecture:

* **`Profile` Object:** Stores the user's metadata (Bio, Links) and owns the `Badge` objects.
* **`Badge` Object:** A standard NFT struct representing event attendance.
* **`Connection` Logic:** Uses shared objects or on-chain event emission to log interactions between addresses

## Features

- **Onboarding Page** - Connect wallet and explore demo
- **Profile Setup** - Initialize your decentralized identity
- **Business Card** - View and share your Web3 business card
- **Full Profile** - Complete profile with NFT badges and stats
- **Network** - Manage your Web3 connections
- **Scanner** - QR code scanner for connecting with others

## License

MIT

