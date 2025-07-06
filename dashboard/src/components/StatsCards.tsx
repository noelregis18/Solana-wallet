import React from 'react';
import { DashboardStats } from '../types';
import './StatsCards.css';

interface StatsCardsProps {
  stats: DashboardStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const getNetDirectionColor = (direction: string) => {
    switch (direction) {
      case 'buy-heavy':
        return '#10b981';
      case 'sell-heavy':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getNetDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'buy-heavy':
        return '📈';
      case 'sell-heavy':
        return '📉';
      default:
        return '➡️';
    }
  };

  return (
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-icon">🟢</div>
        <div className="stat-content">
          <h3>Total Buys</h3>
          <p className="stat-value">{stats.totalBuys.toLocaleString()}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🔴</div>
        <div className="stat-content">
          <h3>Total Sells</h3>
          <p className="stat-value">{stats.totalSells.toLocaleString()}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">{getNetDirectionIcon(stats.netDirection)}</div>
        <div className="stat-content">
          <h3>Net Direction</h3>
          <p 
            className="stat-value"
            style={{ color: getNetDirectionColor(stats.netDirection) }}
          >
            {stats.netDirection.replace('-', ' ').toUpperCase()}
          </p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">👥</div>
        <div className="stat-content">
          <h3>Active Wallets</h3>
          <p className="stat-value">{stats.activeWallets.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCards; 