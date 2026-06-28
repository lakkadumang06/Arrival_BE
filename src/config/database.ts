import mongoose from 'mongoose';
import dns from 'dns';
import { config } from './index';

// Force Node's DNS resolver to use Google/Cloudflare DNS so the SRV
// lookup (mongodb+srv://) works even when the system DNS refuses SRV queries.
dns.setServers(['8.8.8.8', '1.1.1.1']);

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};
