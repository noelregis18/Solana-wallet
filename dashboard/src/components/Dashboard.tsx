import React, { useState, useEffect } from 'react';
import { DashboardStats, TokenInfo } from '../types';
import { apiService } from '../services/api';
import StatsCards from './StatsCards';
import TransactionChart from './TransactionChart';
import ProtocolChart from './ProtocolChart';
import RecentTransactions from './RecentTransactions';
import TokenInfoCard from './TokenInfoCard';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, tokenData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getTokenInfo()
      ]);
      
      setStats(statsData);
      setTokenInfo(tokenData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading TokenWise dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchData}>Retry</button>
      </div>
    );
  }

  if (!stats || !tokenInfo) {
    return <div>No data available</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🧠 TokenWise</h1>
          <p>Real-Time Wallet Intelligence on Solana</p>
          <div className="token-info">
            <span className="token-symbol">{tokenInfo.symbol}</span>
            <span className="token-address">{tokenInfo.address}</span>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="export-btn"
            onClick={apiService.exportTransactions}
          >
            📊 Export Data
          </button>
          <button 
            className="refresh-btn"
            onClick={fetchData}
          >
            🔄 Refresh
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <StatsCards stats={stats} />
        
        <div className="charts-section">
          <div className="chart-container">
            <h3>Transaction Activity</h3>
            <TransactionChart stats={stats} />
          </div>
          
          <div className="chart-container">
            <h3>Protocol Usage</h3>
            <ProtocolChart protocols={stats.topProtocols} />
          </div>
        </div>

        <div className="data-section">
          <div className="transactions-container">
            <h3>Recent Transactions</h3>
            <RecentTransactions transactions={stats.recentTransactions} />
          </div>
          
          <div className="token-container">
            <TokenInfoCard tokenInfo={tokenInfo} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 