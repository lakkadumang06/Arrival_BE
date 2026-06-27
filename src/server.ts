import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import leadRoutes from './modules/leads/lead.routes';
import cmsRoutes from './modules/cms/cms.routes';
import formRoutes from './modules/forms/form.routes';
import serviceRoutes from './modules/services/service.routes';
import faqRoutes from './modules/faq/faq.routes';
import settingsRoutes from './modules/settings/settings.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import successStoryRoutes from './modules/success-stories/successStory.routes';

// Seeders
import { AuthService } from './modules/auth/auth.service';
import { FormService } from './modules/forms/form.service';

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS — allow multiple origins (local + production)
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin) return callback(null, true);

    if (config.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // In development, allow all origins
    if (config.nodeEnv === 'development') {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting — only apply to public submission routes
app.use('/api/auth/login', generalLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure DB connection middleware (for serverless cold starts)
let isConnected = false;
app.use(async (_req, _res, next) => {
  if (!isConnected) {
    try {
      await connectDatabase();
      await AuthService.seedAdmin();
      await FormService.seedDefaultFields();
      isConnected = true;
    } catch (error) {
      console.error('DB connection error:', error);
    }
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/success-stories', successStoryRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running', environment: config.nodeEnv });
});

// Root route
app.get('/', (_req, res) => {
  res.json({ success: true, message: 'Immigration CRM API' });
});

// Error handler
app.use(errorHandler);

// For local development — start server with listen()
if (config.nodeEnv !== 'production') {
  app.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
    console.log(`📍 Environment: ${config.nodeEnv}`);
  });
}

// Export for Vercel serverless
export default app;
