# contract-integrated

┌─────────────────────────────┐
│      React Dashboard        │
│  Web3Modal / WalletConnect  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│     BushidoProtocol.sol     │
├─────────────────────────────┤
│ Identity & Reputation       │
│ Honor Score                 │
│ Virtue System               │
│ Achievement Engine          │
│ Clan Management             │
│ DAO Governance              │
│ Trade Journal               │
│ Notion Registry             │
│ Treasury Accounting         │
│ Rewards Engine              │
└──────────────┬──────────────┘
               │
     ┌─────────┼─────────┐
     ▼         ▼         ▼
  ERC20     ERC721    ERC1155
 Rewards    Titles     Badges

               │

               ▼

      Off-Chain Services

   MCP / CDP / Notion APIs
Frontend
├─ React Dashboard
├─ Web3Modal/Reown
├─ Portfolio UI
├─ Swap UI
└─ Notion Dashboard

       │

       ▼

BushidoProtocol.sol
├─ Honor Scores
├─ Reputation
├─ Trade Journal
├─ Notion Page Registry
└─ User Statistics

       │

       ▼

MCP / CDP Services
├─ Portfolio API
├─ Swap API
├─ Transaction API
└─ Token Search API

