# 🧠 TokenWise — Real-Time Wallet Intelligence on Solana

A comprehensive real-time intelligence tool designed to monitor and analyze wallet behavior for specific tokens on the Solana blockchain. TokenWise tracks the top 60 token holders, captures their transaction activity in real-time, and provides market trend analysis through a beautiful dashboard with advanced filtering capabilities.

## 🎯 Features

- **🔍 Top Wallet Discovery**: Automatically discovers and tracks the top 60 wallets holding the target token
- **⚡ Real-Time Monitoring**: Live transaction monitoring with WebSocket connections
- **📊 Protocol Identification**: Identifies trading protocols (Jupiter, Raydium, Orca, etc.)
- **📈 Interactive Dashboard**: Beautiful React dashboard with real-time charts and statistics
- **📅 Historical Analysis**: Query past activity with custom time filters and date range selection
- **📤 Data Export**: Export transaction data as CSV for further analysis
- **🔄 Auto-Refresh**: Automatic data refresh every 30 seconds
- **🎨 Modern UI**: Responsive design with professional styling and intuitive user experience

## 🏗️ Architecture

```
TokenWise/
├── src/                    # Backend TypeScript source
│   ├── api/               # Express API routes
│   ├── database/          # SQLite database schema
│   ├── services/          # Core business logic
│   │   ├── solanaService.ts    # Solana blockchain integration
│   │   └── monitoringService.ts # Real-time monitoring
│   └── types/             # TypeScript type definitions
├── dashboard/             # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API service layer
│   │   └── types/         # Frontend type definitions
│   └── public/            # Static assets
├── data/                  # SQLite database files
└── dist/                  # Compiled backend code
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/noelregis18/Solana-wallet.git
   cd Solana-wallet
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd dashboard
   npm install
   cd ..
   ```

4. **Create environment file**
   ```bash
   # Create .env file in the root directory
   SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   SOLANA_WS_URL=wss://api.mainnet-beta.solana.com
   TARGET_TOKEN_ADDRESS=9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump
   PORT=3001
   DASHBOARD_PORT=3000
   DB_PATH=./data/tokenwise.db
   ```

5. **Build the project**
   ```bash
   npm run build
   ```

6. **Start the application**
   ```bash
   # Start backend server
   npm start
   
   # In another terminal, start the dashboard
   cd dashboard
   npm start
   ```

7. **Access the application**
   - Dashboard: http://localhost:3000
   - API: http://localhost:3001/api

## 📊 Dashboard Features

### Real-Time Statistics
- **Total Buys/Sells**: Live count of buy and sell transactions
- **Net Direction**: Market sentiment indicator (buy-heavy, sell-heavy, neutral)
- **Active Wallets**: Number of wallets with recent activity
- **Protocol Usage**: Breakdown of trading protocols used

### Interactive Charts
- **Transaction Activity**: Bar chart showing buy vs sell volume
- **Protocol Distribution**: Doughnut chart of protocol usage

### Transaction Feed with Date Filtering
- **Live Updates**: Real-time transaction feed with 30-second refresh
- **Date Range Filter**: Select custom start and end dates to filter transactions
- **Transaction Details**: Amount, wallet address, protocol, timestamp
- **External Links**: Direct links to Solscan for transaction verification

### Token Information
- **Token Metadata**: Symbol, name, decimals, total supply
- **Contract Details**: Direct link to token contract on Solscan

## 🔧 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dashboard` | GET | Get dashboard statistics |
| `/api/wallets` | GET | Get top wallet holders |
| `/api/transactions` | GET | Get recent transactions with date filtering |
| `/api/protocols` | GET | Get protocol statistics |
| `/api/token` | GET | Get token information |
| `/api/export/transactions` | GET | Export transactions as CSV |
| `/api/health` | GET | Health check endpoint |

### Query Parameters

#### `/api/transactions` Endpoint
- `limit`: Number of records to return (default: 50)
- `startDate`: Filter transactions from this date (ISO format: YYYY-MM-DD)
- `endDate`: Filter transactions until this date (ISO format: YYYY-MM-DD)

#### `/api/wallets` Endpoint
- `limit`: Number of wallets to return (default: 60)

### Example Usage

```bash
# Get dashboard data
curl http://localhost:3001/api/dashboard

# Get top 30 wallets
curl http://localhost:3001/api/wallets?limit=30

# Get recent 100 transactions
curl http://localhost:3001/api/transactions?limit=100

# Get transactions from last 7 days
curl "http://localhost:3001/api/transactions?startDate=2024-01-01&endDate=2024-01-07"

# Get transactions with custom date range
curl "http://localhost:3001/api/transactions?startDate=2024-01-01T00:00:00&endDate=2024-01-31T23:59:59&limit=200"

# Export transactions
curl http://localhost:3001/api/export/transactions -o transactions.csv
```

## 🛠️ Development

### Backend Development

```bash
# Run in development mode with auto-reload
npm run dev

# Run with watch mode
npm run dev:watch
```

### Frontend Development

```bash
cd dashboard
npm start
```

### Database

The application uses SQLite for data storage. The database file is automatically created at `./data/tokenwise.db`.

**Tables:**
- `wallets`: Top token holder information
- `transactions`: Transaction history and details with timestamp indexing

**Database Features:**
- Automatic table creation and indexing
- Optimized queries for date range filtering
- Foreign key relationships between wallets and transactions

## 🔍 Monitoring Features

### Real-Time Monitoring
- **WebSocket Connections**: Real-time account change monitoring for top 20 wallets
- **Periodic Discovery**: Top wallet discovery every 6 hours
- **Transaction Monitoring**: Transaction checking every 5 minutes

### Protocol Detection
The system automatically identifies trading protocols:
- **Jupiter**: `JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB`
- **Raydium**: `675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8`
- **Orca**: `9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM`

### Date Range Filtering
- **Custom Date Selection**: Users can select start and end dates via the dashboard UI
- **API Integration**: Backend supports ISO date format filtering
- **Database Optimization**: Indexed timestamp queries for fast filtering
- **Real-time Updates**: Filtered results update automatically when date range changes

## 📈 Data Export

The application supports data export in CSV format:

```bash
# Export all transactions
curl http://localhost:3001/api/export/transactions -o transactions.csv
```

**CSV Format:**
```csv
ID,Wallet Address,Type,Amount,Token Amount,Protocol,Timestamp,Signature
```

## 🎨 User Interface

### Dashboard Components
- **StatsCards**: Real-time statistics display
- **TransactionChart**: Interactive transaction volume charts
- **ProtocolChart**: Protocol usage visualization
- **RecentTransactions**: Transaction feed with date filtering
- **TokenInfoCard**: Token metadata display

### Responsive Design
- Mobile-friendly interface
- Professional styling with CSS
- Intuitive date picker controls
- Loading states and error handling

## 🔧 Technical Stack

### Backend
- **Node.js** with TypeScript
- **Express.js** for API routing
- **SQLite** for data persistence
- **@solana/web3.js** for blockchain integration
- **WebSocket** for real-time monitoring

### Frontend
- **React** with TypeScript
- **Chart.js** for data visualization
- **Axios** for API communication
- **date-fns** for date manipulation
- **CSS** for styling

## 🚀 Deployment

### Environment Variables
```bash
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_WS_URL=wss://api.mainnet-beta.solana.com
TARGET_TOKEN_ADDRESS=your_token_address_here
PORT=3001
DASHBOARD_PORT=3000
DB_PATH=./data/tokenwise.db
```

### Production Build
```bash
# Build backend
npm run build

# Build frontend
cd dashboard
npm run build
cd ..
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**TokenWise** - Empowering traders with real-time Solana wallet intelligence 🧠⚡ 
