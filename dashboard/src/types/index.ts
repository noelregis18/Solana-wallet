export interface Wallet {
  address: string;
  balance: number;
  tokenQuantity: string;
  rank: number;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  walletAddress: string;
  type: 'buy' | 'sell';
  amount: number;
  tokenAmount: string;
  protocol: string;
  timestamp: string;
  signature: string;
  blockTime: number;
}

export interface ProtocolStats {
  protocol: string;
  buyCount: number;
  sellCount: number;
  totalVolume: number;
}

export interface DashboardStats {
  totalBuys: number;
  totalSells: number;
  netDirection: 'buy-heavy' | 'sell-heavy' | 'neutral';
  activeWallets: number;
  topProtocols: ProtocolStats[];
  recentTransactions: Transaction[];
}

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: string;
} 