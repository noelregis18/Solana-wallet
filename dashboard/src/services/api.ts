import axios from 'axios';
import { DashboardStats, Wallet, Transaction, ProtocolStats, TokenInfo } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const apiService = {
  // Dashboard data
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/api/dashboard');
    return response.data;
  },

  // Wallets
  getTopWallets: async (limit: number = 60): Promise<Wallet[]> => {
    const response = await api.get(`/api/wallets?limit=${limit}`);
    return response.data;
  },

  // Transactions
  getRecentTransactions: async (limit: number = 50, startDate?: string, endDate?: string): Promise<Transaction[]> => {
    let url = `/api/transactions?limit=${limit}`;
    if (startDate) url += `&startDate=${encodeURIComponent(startDate)}`;
    if (endDate) url += `&endDate=${encodeURIComponent(endDate)}`;
    const response = await api.get(url);
    return response.data;
  },

  // Protocol statistics
  getProtocolStats: async (): Promise<ProtocolStats[]> => {
    const response = await api.get('/api/protocols');
    return response.data;
  },

  // Token information
  getTokenInfo: async (): Promise<TokenInfo> => {
    const response = await api.get('/api/token');
    return response.data;
  },

  // Export transactions
  exportTransactions: async (): Promise<void> => {
    const response = await api.get('/api/export/transactions', {
      responseType: 'blob',
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  // Health check
  healthCheck: async (): Promise<boolean> => {
    try {
      await api.get('/api/health');
      return true;
    } catch {
      return false;
    }
  },
}; 