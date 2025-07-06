# 🧠 TokenWise — Real-Time Wallet Intelligence on Solana

A comprehensive real-time intelligence tool designed to monitor and analyze wallet behavior for specific tokens on the Solana blockchain. TokenWise tracks the top 60 token holders, captures their transaction activity in real-time, and provides market trend analysis through a beautiful dashboard.

## 🎯 Features

- **🔍 Top Wallet Discovery**: Automatically discovers and tracks the top 60 wallets holding the target token
- **⚡ Real-Time Monitoring**: Live transaction monitoring with WebSocket connections
- **📊 Protocol Identification**: Identifies trading protocols (Jupiter, Raydium, Orca, etc.)
- **📈 Interactive Dashboard**: Beautiful React dashboard with real-time charts and statistics
- **📋 Historical Analysis**: Query past activity with custom time filters
- **📤 Data Export**: Export transaction data as CSV for further analysis
- **🔄 Auto-Refresh**: Automatic data refresh every 30 seconds

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
   git clone <repository-url>
   cd tokenwise
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

### Transaction Feed
- **Live Updates**: Real-time transaction feed with 30-second refresh
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
| `/api/transactions` | GET | Get recent transactions |
| `/api/protocols` | GET | Get protocol statistics |
| `/api/token` | GET | Get token information |
| `/api/export/transactions` | GET | Export transactions as CSV |
| `/api/health` | GET | Health check endpoint |

### Query Parameters

- `limit`: Number of records to return (default: 50 for transactions, 60 for wallets)

### Example Usage

```bash
# Get dashboard data
curl http://localhost:3001/api/dashboard

# Get top 30 wallets
curl http://localhost:3001/api/wallets?limit=30

# Get recent 100 transactions
curl http://localhost:3001/api/transactions?limit=100

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
- `transactions`: Transaction history and details

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

## 🚨 Error Handling

The application includes comprehensive error handling:

- **Network Errors**: Automatic retry with exponential backoff
- **Database Errors**: Graceful degradation with error logging
- **API Errors**: Proper HTTP status codes and error messages
- **Frontend Errors**: User-friendly error messages with retry options

## 🔒 Security

- **CORS Protection**: Configured for secure cross-origin requests
- **Helmet.js**: Security headers for Express server
- **Input Validation**: All API inputs are validated
- **Rate Limiting**: Built-in rate limiting for API endpoints

## 📱 Responsive Design

The dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd dashboard
npm test
```

## 📦 Deployment

### Production Build

```bash
# Build backend
npm run build

# Build frontend
cd dashboard
npm run build
cd ..

# Start production server
npm start
```

### Environment Variables

For production deployment, consider using:
- **Enhanced RPC**: Use a dedicated Solana RPC endpoint for better performance
- **Database**: Consider PostgreSQL for production use
- **Caching**: Implement Redis for better performance
- **Monitoring**: Add application monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔮 Future Enhancements

- **Multi-Token Support**: Monitor multiple tokens simultaneously
- **Advanced Analytics**: Price correlation, volume analysis
- **Alert System**: Custom alerts for specific wallet activities
- **Mobile App**: Native mobile application
- **API Rate Limiting**: Enhanced rate limiting and API keys
- **WebSocket Dashboard**: Real-time dashboard updates via WebSocket

---

**TokenWise** - Your gateway to real-time Solana wallet intelligence! 🚀 