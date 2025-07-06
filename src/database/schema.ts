import sqlite3 from 'sqlite3';
import path from 'path';

const DB_PATH = process.env.DB_PATH || './data/tokenwise.db';

export class Database {
  private db: sqlite3.Database;
  private _ready: Promise<void>;

  constructor() {
    this.db = new sqlite3.Database(DB_PATH);
    this._ready = this.init();
  }

  private init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run(`
          CREATE TABLE IF NOT EXISTS wallets (
            address TEXT PRIMARY KEY,
            balance REAL,
            token_quantity TEXT,
            rank INTEGER,
            last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) { console.error('Error creating wallets table:', err); return reject(err); }
          console.log('✅ Wallets table ready');
          this.db.run(`
            CREATE TABLE IF NOT EXISTS transactions (
              id TEXT PRIMARY KEY,
              wallet_address TEXT,
              type TEXT CHECK(type IN ('buy', 'sell')),
              amount REAL,
              token_amount TEXT,
              protocol TEXT,
              timestamp DATETIME,
              signature TEXT,
              block_time INTEGER,
              FOREIGN KEY (wallet_address) REFERENCES wallets (address)
            )
          `, (err) => {
            if (err) { console.error('Error creating transactions table:', err); return reject(err); }
            console.log('✅ Transactions table ready');
            this.db.run(`CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON transactions(wallet_address)`, (err) => {
              if (err) { console.error('Error creating idx_transactions_wallet:', err); return reject(err); }
              this.db.run(`CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(timestamp)`, (err) => {
                if (err) { console.error('Error creating idx_transactions_timestamp:', err); return reject(err); }
                this.db.run(`CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type)`, (err) => {
                  if (err) { console.error('Error creating idx_transactions_type:', err); return reject(err); }
                  this.db.run(`CREATE INDEX IF NOT EXISTS idx_wallets_rank ON wallets(rank)`, (err) => {
                    if (err) { console.error('Error creating idx_wallets_rank:', err); return reject(err); }
                    console.log('✅ All tables and indexes ready');
                    resolve();
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  async ready() {
    return this._ready;
  }

  async getTopWallets(limit: number = 60): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM wallets ORDER BY rank ASC LIMIT ?`,
        [limit],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  async saveWallet(wallet: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO wallets (address, balance, token_quantity, rank, last_updated)
         VALUES (?, ?, ?, ?, ?)`,
        [wallet.address, wallet.balance, wallet.tokenQuantity, wallet.rank, new Date()],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async saveTransaction(transaction: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO transactions 
         (id, wallet_address, type, amount, token_amount, protocol, timestamp, signature, block_time)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          transaction.id,
          transaction.walletAddress,
          transaction.type,
          transaction.amount,
          transaction.tokenAmount,
          transaction.protocol,
          transaction.timestamp,
          transaction.signature,
          transaction.blockTime
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async getDashboardStats(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT 
          COUNT(CASE WHEN type = 'buy' THEN 1 END) as totalBuys,
          COUNT(CASE WHEN type = 'sell' THEN 1 END) as totalSells,
          COUNT(DISTINCT wallet_address) as activeWallets
         FROM transactions`,
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }

  async getRecentTransactions(limit: number = 50, startDate?: string, endDate?: string): Promise<any[]> {
    let query = `SELECT 
      id,
      wallet_address as walletAddress,
      type,
      amount,
      token_amount as tokenAmount,
      protocol,
      timestamp,
      signature,
      block_time as blockTime
    FROM transactions`;
    const params: any[] = [];
    const conditions: string[] = [];
    if (startDate) {
      conditions.push('timestamp >= ?');
      params.push(startDate);
    }
    if (endDate) {
      conditions.push('timestamp <= ?');
      params.push(endDate);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY timestamp DESC LIMIT ?';
    params.push(limit);
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getProtocolStats(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT 
          protocol,
          COUNT(CASE WHEN type = 'buy' THEN 1 END) as buyCount,
          COUNT(CASE WHEN type = 'sell' THEN 1 END) as sellCount,
          SUM(amount) as totalVolume
         FROM transactions 
         WHERE protocol IS NOT NULL
         GROUP BY protocol
         ORDER BY totalVolume DESC`,
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  }

  close() {
    this.db.close();
  }
} 