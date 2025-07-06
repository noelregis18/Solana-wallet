import React from 'react';
import { Transaction } from '../types';
import { format } from 'date-fns';
import './RecentTransactions.css';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  return (
    <div className="recent-transactions">
      <div className="transactions-header">
        <h3>Recent Transactions</h3>
        <span className="transaction-count">{transactions.length} transactions</span>
      </div>
      
      <div className="transactions-list">
        {transactions.length === 0 ? (
          <div className="no-transactions">
            <p>No transactions found</p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className={`transaction-item ${tx.type}`}>
              <div className="transaction-icon">
                {tx.type === 'buy' ? '🟢' : '🔴'}
              </div>
              
              <div className="transaction-details">
                <div className="transaction-header">
                  <span className="transaction-type">
                    {tx.type.toUpperCase()}
                  </span>
                  <span className="transaction-time">
                    {format(new Date(tx.timestamp), 'MMM dd, HH:mm')}
                  </span>
                </div>
                
                <div className="transaction-info">
                  <span className="wallet-address">
                    {formatAddress(tx.walletAddress)}
                  </span>
                  <span className="transaction-amount">
                    {formatAmount(tx.amount)} tokens
                  </span>
                </div>
                
                <div className="transaction-meta">
                  <span className="protocol">{tx.protocol}</span>
                  <a 
                    href={`https://solscan.io/tx/${tx.signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transaction-link"
                  >
                    View on Solscan
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTransactions; 