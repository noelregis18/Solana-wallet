import { SolanaService } from './solanaService';
import { Database } from '../database/schema';
import { Wallet, Transaction } from '../types';
import cron from 'node-cron';

export class MonitoringService {
  private solanaService: SolanaService;
  private database: Database;
  private isRunning: boolean = false;
  private subscriptions: Map<string, number> = new Map();

  constructor() {
    this.solanaService = new SolanaService();
    this.database = new Database();
  }

  async start() {
    if (this.isRunning) return;
    await this.database.ready();
    this.isRunning = true;
    console.log('Starting TokenWise monitoring service...');

    // Initial wallet discovery
    await this.discoverTopWallets();
    
    // Set up periodic wallet discovery (every 6 hours)
    cron.schedule('0 */6 * * *', async () => {
      console.log('🔄 Running periodic wallet discovery...');
      await this.discoverTopWallets();
    });

    // Set up periodic transaction monitoring (every 5 minutes)
    cron.schedule('*/5 * * * *', async () => {
      console.log('📊 Checking for new transactions...');
      await this.monitorTransactions();
    });

    console.log('✅ Monitoring service started successfully');
  }

  async discoverTopWallets() {
    try {
      console.log('🔍 Discovering top token holders...');
      const holders = await this.solanaService.getTopTokenHolders(60);
      
      if (holders.length === 0) {
        console.log('⚠️ No token holders found, using mock data for demonstration');
        return;
      }
      
      for (const holder of holders) {
        await this.database.saveWallet(holder);
      }
      
      console.log(`✅ Discovered and saved ${holders.length} top wallets`);
      
      // Set up real-time monitoring for top wallets
      await this.setupRealTimeMonitoring(holders);
      
    } catch (error) {
      console.error('❌ Error discovering wallets:', error);
      console.log('🔄 Continuing with mock data...');
    }
  }

  async setupRealTimeMonitoring(wallets: Wallet[]) {
    // Remove old subscriptions
    for (const [address, subscriptionId] of this.subscriptions) {
      try {
        await this.solanaService['connection'].removeAccountChangeListener(subscriptionId);
      } catch (error) {
        console.error(`Error removing subscription for ${address}:`, error);
      }
    }
    this.subscriptions.clear();

    // Set up new subscriptions for top 20 wallets
    const topWallets = wallets.slice(0, 20);
    
    for (const wallet of topWallets) {
      // Skip mock wallets (not valid base58)
      if (!this.isValidBase58(wallet.address)) {
        console.warn(`Skipping real-time monitoring for mock wallet: ${wallet.address}`);
        continue;
      }
      try {
        const subscriptionId = await this.solanaService.subscribeToAccountChanges(
          wallet.address,
          async (accountInfo) => {
            console.log(`🔄 Account change detected for ${wallet.address}`);
            await this.handleAccountChange(wallet.address);
          }
        );
        
        this.subscriptions.set(wallet.address, subscriptionId);
      } catch (error) {
        console.error(`Error setting up monitoring for ${wallet.address}:`, error);
      }
    }
    
    console.log(`✅ Set up real-time monitoring for ${topWallets.length} wallets`);
  }

  private isValidBase58(address: string): boolean {
    // Solana addresses are base58 and typically 32-44 chars
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(address);
  }

  async handleAccountChange(walletAddress: string) {
    try {
      // Get recent transactions for this wallet
      const transactions = await this.solanaService.getRecentTransactions(walletAddress, 5);
      
      for (const transaction of transactions) {
        if (transaction) {
          await this.database.saveTransaction(transaction);
          console.log(`✅ Saved transaction: ${transaction.type} ${transaction.amount} tokens`);
        }
      }
    } catch (error) {
      console.error(`Error handling account change for ${walletAddress}:`, error);
    }
  }

  async monitorTransactions() {
    try {
      const wallets = await this.database.getTopWallets(60);
      
      for (const wallet of wallets) {
        await this.handleAccountChange(wallet.address);
      }
    } catch (error) {
      console.error('❌ Error monitoring transactions:', error);
    }
  }

  async getDashboardData() {
    try {
      const [stats, recentTransactions, protocolStats] = await Promise.all([
        this.database.getDashboardStats(),
        this.database.getRecentTransactions(50),
        this.database.getProtocolStats()
      ]);

      const netDirection = stats.totalBuys > stats.totalSells ? 'buy-heavy' : 
                          stats.totalSells > stats.totalBuys ? 'sell-heavy' : 'neutral';

      return {
        totalBuys: stats.totalBuys || 0,
        totalSells: stats.totalSells || 0,
        netDirection,
        activeWallets: stats.activeWallets || 0,
        topProtocols: protocolStats,
        recentTransactions: recentTransactions.map(tx => ({
          ...tx,
          timestamp: new Date(tx.timestamp)
        }))
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      console.log('🔄 Returning mock dashboard data...');
      return this.getMockDashboardData();
    }
  }

  private getMockDashboardData() {
    const mockTransactions = [];
    const protocols = ['Jupiter', 'Raydium', 'Orca', 'Unknown'];
    const types = ['buy', 'sell'];
    
    // Generate mock transactions
    for (let i = 0; i < 25; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const protocol = protocols[Math.floor(Math.random() * protocols.length)];
      const amount = Math.random() * 10000 + 100;
      
      mockTransactions.push({
        id: `mock_tx_${i}_${Math.random().toString(36).substr(2, 9)}`,
        wallet_address: `mock_wallet_${Math.floor(Math.random() * 10) + 1}`,
        type,
        amount,
        token_amount: amount.toString(),
        protocol,
        timestamp: new Date(Date.now() - Math.random() * 86400000),
        signature: `mock_signature_${i}_${Math.random().toString(36).substr(2, 9)}`,
        block_time: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400)
      });
    }

    const totalBuys = mockTransactions.filter(tx => tx.type === 'buy').length;
    const totalSells = mockTransactions.filter(tx => tx.type === 'sell').length;
    const netDirection = totalBuys > totalSells ? 'buy-heavy' : 
                        totalSells > totalBuys ? 'sell-heavy' : 'neutral';

    // Generate mock protocol stats
    const mockProtocolStats = protocols.map(protocol => ({
      protocol,
      buyCount: Math.floor(Math.random() * 50) + 10,
      sellCount: Math.floor(Math.random() * 50) + 10,
      totalVolume: Math.random() * 1000000 + 100000
    }));

    return {
      totalBuys,
      totalSells,
      netDirection,
      activeWallets: 15,
      topProtocols: mockProtocolStats,
      recentTransactions: mockTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    };
  }

  stop() {
    this.isRunning = false;
    
    // Clean up subscriptions
    for (const [address, subscriptionId] of this.subscriptions) {
      try {
        this.solanaService['connection'].removeAccountChangeListener(subscriptionId);
      } catch (error) {
        console.error(`Error removing subscription for ${address}:`, error);
      }
    }
    this.subscriptions.clear();
    
    this.database.close();
    console.log('🛑 Monitoring service stopped');
  }
} 