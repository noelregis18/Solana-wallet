import React from 'react';
import { Transaction } from '../types';
import { format } from 'date-fns';
import './RecentTransactions.css';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  const formatAddress = (address: string | undefined) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatAmount = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return '0';
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
            <div key={tx.id || Math.random()} className={`transaction-item ${tx.type || 'unknown'}`}>
              <div className="transaction-icon">
                {tx.type === 'buy' ? '🟢' : '🔴'}
              </div>
              
              <div className="transaction-details">
                <div className="transaction-header">
                  <span className="transaction-type">
                    {(tx.type || 'unknown').toUpperCase()}
                  </span>
                  <span className="transaction-time">
                    {tx.timestamp ? format(new Date(tx.timestamp), 'MMM dd, HH:mm') : 'Unknown time'}
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
                  <span className="protocol">{tx.protocol || 'Unknown'}</span>
                  {tx.signature && (
                    <a 
                      href={`https://solscan.io/tx/${tx.signature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transaction-link"
                    >
                      View on Solscan
                    </a>
                  )}
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