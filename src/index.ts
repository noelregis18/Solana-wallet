import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { MonitoringService } from './services/monitoringService';
import routes from './api/routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Mount routes at root
app.use('/', routes);

// Serve static files for dashboard
app.use(express.static('dashboard/build'));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'TokenWise API is running!',
    version: '1.0.0',
    endpoints: {
      dashboard: '/api/dashboard',
      wallets: '/api/wallets',
      transactions: '/api/transactions',
      protocols: '/api/protocols',
      token: '/api/token',
      export: '/api/export/transactions'
    }
  });
});

// Start monitoring service
const monitoringService = new MonitoringService();

async function startServer() {
  try {
    // Start the monitoring service
    await monitoringService.start();
    
    // Start the Express server
    const server = app.listen(PORT, () => {
      console.log(`🚀 TokenWise server running on port ${PORT}`);
      console.log(`📊 Dashboard available at http://localhost:${PORT}`);
      console.log(`🔗 API available at http://localhost:${PORT}/api`);
    });
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please stop the other process or use a different port.`);
        process.exit(1);
      } else {
        throw err;
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down TokenWise...');
  monitoringService.stop();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down TokenWise...');
  monitoringService.stop();
  process.exit(0);
});

startServer(); 