import React from 'react';
import { TokenInfo } from '../types';
import './TokenInfoCard.css';

interface TokenInfoCardProps {
  tokenInfo: TokenInfo;
}

const TokenInfoCard: React.FC<TokenInfoCardProps> = ({ tokenInfo }) => {
  const formatSupply = (supply: string) => {
    const num = parseFloat(supply);
    if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <div className="token-info-card">
      <h3>Token Information</h3>
      
      <div className="token-details">
        <div className="token-detail">
          <span className="detail-label">Symbol:</span>
          <span className="detail-value">{tokenInfo.symbol}</span>
        </div>
        
        <div className="token-detail">
          <span className="detail-label">Name:</span>
          <span className="detail-value">{tokenInfo.name}</span>
        </div>
        
        <div className="token-detail">
          <span className="detail-label">Decimals:</span>
          <span className="detail-value">{tokenInfo.decimals}</span>
        </div>
        
        <div className="token-detail">
          <span className="detail-label">Total Supply:</span>
          <span className="detail-value">{formatSupply(tokenInfo.totalSupply)}</span>
        </div>
        
        <div className="token-detail">
          <span className="detail-label">Contract:</span>
          <span className="detail-value address">
            <a 
              href={`https://solscan.io/token/${tokenInfo.address}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {tokenInfo.address.slice(0, 8)}...{tokenInfo.address.slice(-8)}
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TokenInfoCard; 