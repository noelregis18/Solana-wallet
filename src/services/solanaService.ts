import { Connection, PublicKey, ParsedAccountData } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import axios from 'axios';

export class SolanaService {
  private connection: Connection;
  private tokenAddress: PublicKey;

  constructor() {
    const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    this.connection = new Connection(rpcUrl, 'confirmed');
    this.tokenAddress = new PublicKey(process.env.TARGET_TOKEN_ADDRESS || '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump');
  }

  async getTopTokenHolders(limit: number = 60): Promise<any[]> {
    try {
      console.log('🔍 Attempting to fetch top token holders from Solana...');
      
      // Get all token accounts for the target token
      const accounts = await this.connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,
        {
          filters: [
            {
              dataSize: 165, // Size of token account
            },
            {
              memcmp: {
                offset: 0,
                bytes: this.tokenAddress.toBase58(),
              },
            },
          ],
        }
      );

      // Parse and sort by balance
      const holders = accounts
        .map((account) => {
          const parsedData = account.account.data as ParsedAccountData;
          const balance = parsedData.parsed.info.tokenAmount.uiAmount;
          const address = parsedData.parsed.info.owner;
          
          return {
            address,
            balance: balance || 0,
            tokenQuantity: parsedData.parsed.info.tokenAmount.amount,
            rank: 0
          };
        })
        .filter(holder => holder.balance > 0)
        .sort((a, b) => b.balance - a.balance)
        .slice(0, limit)
        .map((holder, index) => ({
          ...holder,
          rank: index + 1
        }));

      console.log(`✅ Successfully fetched ${holders.length} token holders`);
      return holders;
    } catch (error) {
      console.error('❌ Error fetching top token holders:', error);
      console.log('🔄 Using mock data for demonstration...');
      
      // Return mock data for demonstration purposes
      return this.getMockTokenHolders(limit);
    }
  }

  private getMockTokenHolders(limit: number): any[] {
    const mockHolders = [];
    for (let i = 1; i <= Math.min(limit, 20); i++) {
      mockHolders.push({
        address: `mock_wallet_${i}_${Math.random().toString(36).substr(2, 9)}`,
        balance: Math.random() * 1000000 + 1000,
        tokenQuantity: (Math.random() * 1000000 + 1000).toString(),
        rank: i
      });
    }
    return mockHolders.sort((a, b) => b.balance - a.balance);
  }

  async getTokenInfo(): Promise<any> {
    try {
      console.log('🔍 Fetching token information...');
      const accountInfo = await this.connection.getParsedAccountInfo(this.tokenAddress);
      const data = accountInfo.value?.data as ParsedAccountData;
      
      const tokenInfo = {
        address: this.tokenAddress.toBase58(),
        symbol: data?.parsed?.info?.symbol || 'PUMP',
        name: data?.parsed?.info?.name || 'Pump Token',
        decimals: data?.parsed?.info?.decimals || 9,
        totalSupply: data?.parsed?.info?.supply || '1000000000000000000'
      };
      
      console.log('✅ Token info fetched successfully');
      return tokenInfo;
    } catch (error) {
      console.error('❌ Error fetching token info:', error);
      console.log('🔄 Using mock token info...');
      
      // Return mock token info
      return {
        address: this.tokenAddress.toBase58(),
        symbol: 'PUMP',
        name: 'Pump Token',
        decimals: 9,
        totalSupply: '1000000000000000000'
      };
    }
  }

  async getRecentTransactions(walletAddress: string, limit: number = 20): Promise<any[]> {
    try {
      console.log(`🔍 Fetching recent transactions for ${walletAddress}...`);
      const pubKey = new PublicKey(walletAddress);
      const signatures = await this.connection.getSignaturesForAddress(pubKey, { limit });
      
      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          try {
            const tx = await this.connection.getParsedTransaction(sig.signature, 'confirmed');
            return this.parseTransaction(tx, sig.signature, walletAddress);
          } catch (error) {
            return null;
          }
        })
      );

      const validTransactions = transactions.filter(tx => tx !== null);
      console.log(`✅ Found ${validTransactions.length} valid transactions`);
      return validTransactions;
    } catch (error) {
      console.error('❌ Error fetching recent transactions:', error);
      console.log('🔄 Using mock transactions...');
      
      // Return mock transactions for demonstration
      return this.getMockTransactions(walletAddress, limit);
    }
  }

  private getMockTransactions(walletAddress: string, limit: number): any[] {
    const mockTransactions = [];
    const protocols = ['Jupiter', 'Raydium', 'Orca', 'Unknown'];
    const types = ['buy', 'sell'];
    
    for (let i = 0; i < limit; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const protocol = protocols[Math.floor(Math.random() * protocols.length)];
      const amount = Math.random() * 10000 + 100;
      
      mockTransactions.push({
        id: `mock_tx_${i}_${Math.random().toString(36).substr(2, 9)}`,
        walletAddress,
        type,
        amount,
        tokenAmount: amount.toString(),
        protocol,
        timestamp: new Date(Date.now() - Math.random() * 86400000), // Random time in last 24 hours
        signature: `mock_signature_${i}_${Math.random().toString(36).substr(2, 9)}`,
        blockTime: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 86400)
      });
    }
    
    return mockTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  private parseTransaction(tx: any, signature: string, walletAddress: string): any {
    if (!tx?.meta || !tx.transaction) return null;

    // Look for token transfers involving our target token
    const preBalances = tx.meta.preTokenBalances || [];
    const postBalances = tx.meta.postTokenBalances || [];

    const preBalance = preBalances.find((b: any) => 
      b.owner === walletAddress && b.mint === this.tokenAddress.toBase58()
    );
    const postBalance = postBalances.find((b: any) => 
      b.owner === walletAddress && b.mint === this.tokenAddress.toBase58()
    );

    if (!preBalance || !postBalance) return null;

    const preAmount = parseFloat(preBalance.uiTokenAmount.uiAmount || '0');
    const postAmount = parseFloat(postBalance.uiTokenAmount.uiAmount || '0');
    const difference = postAmount - preAmount;

    if (Math.abs(difference) < 0.000001) return null; // No significant change

    const type = difference > 0 ? 'buy' : 'sell';
    const amount = Math.abs(difference);

    // Try to identify the protocol
    const protocol = this.identifyProtocol(tx);

    return {
      id: signature,
      walletAddress,
      type,
      amount,
      tokenAmount: Math.abs(difference).toString(),
      protocol,
      timestamp: new Date(tx.blockTime * 1000),
      signature,
      blockTime: tx.blockTime
    };
  }

  private identifyProtocol(tx: any): string {
    const instructions = tx.transaction.message.instructions || [];
    
    for (const instruction of instructions) {
      const programId = instruction.programId;
      
      // Known protocol program IDs
      if (programId === 'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB') {
        return 'Jupiter';
      } else if (programId === '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8') {
        return 'Raydium';
      } else if (programId === '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM') {
        return 'Orca';
      }
    }
    
    return 'Unknown';
  }

  async subscribeToAccountChanges(walletAddress: string, callback: (data: any) => void): Promise<number> {
    const pubKey = new PublicKey(walletAddress);
    return this.connection.onAccountChange(pubKey, callback, 'confirmed');
  }
} 