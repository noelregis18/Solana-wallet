import { Router } from 'express';
import { MonitoringService } from '../services/monitoringService';
import { SolanaService } from '../services/solanaService';

const router = Router();
const monitoringService = new MonitoringService();
const solanaService = new SolanaService();

// Get dashboard statistics
router.get('/api/dashboard', async (req, res) => {
  try {
    const data = await monitoringService.getDashboardData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get top wallets
router.get('/api/wallets', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 60;
    const wallets = await monitoringService['database'].getTopWallets(limit);
    res.json(wallets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wallets' });
  }
});

// Get recent transactions
router.get('/api/transactions', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const transactions = await monitoringService['database'].getRecentTransactions(limit, startDate, endDate);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get protocol statistics
router.get('/api/protocols', async (req, res) => {
  try {
    const stats = await monitoringService['database'].getProtocolStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch protocol statistics' });
  }
});

// Get token information
router.get('/api/token', async (req, res) => {
  try {
    const tokenInfo = await solanaService.getTokenInfo();
    res.json(tokenInfo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch token information' });
  }
});

// Export data as CSV
router.get('/api/export/transactions', async (req, res) => {
  try {
    const transactions = await monitoringService['database'].getRecentTransactions(1000);
    
    const csv = [
      'ID,Wallet Address,Type,Amount,Token Amount,Protocol,Timestamp,Signature',
      ...transactions.map(tx => 
        `${tx.id},${tx.wallet_address},${tx.type},${tx.amount},${tx.token_amount},${tx.protocol},${tx.timestamp},${tx.signature}`
      )
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export transactions' });
  }
});

// Health check
router.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API index route
router.get('/api', (req, res) => {
  res.json({
    message: 'TokenWise API Root',
    endpoints: {
      dashboard: '/api/dashboard',
      wallets: '/api/wallets',
      transactions: '/api/transactions',
      protocols: '/api/protocols',
      token: '/api/token',
      export: '/api/export/transactions',
      health: '/api/health'
    }
  });
});

export default router; 
