import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';
import { initSocket } from './socket';

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
import enquiryRoutes from './modules/enquiries/enquiry.routes';
import inquiryRoutes from './modules/reception/inquiry.routes';
import messageTemplateRoutes from './modules/reception/messageTemplate.routes';
import userRoutes from './modules/users/user.routes';
import roleAccessRoutes from './modules/role-access/roleAccess.routes';

// Seeders
import { AuthService } from './modules/auth/auth.service';
import { FormService } from './modules/forms/form.service';
import { RoleAccessService } from './modules/role-access/roleAccess.service';

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
      await AuthService.seedOwner();
      await AuthService.seedRoleUsers();
      await RoleAccessService.seedDefaults();
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
app.use('/api/enquiries', enquiryRoutes);

// Reception Desk QR Intake & Lead Management
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/message-templates', messageTemplateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/role-access', roleAccessRoutes);

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

// ── HTTP server + Socket.io ─────────────────────────────────────────────
// Socket.io requires a long-lived process, so we wrap Express in an
// http.Server and listen in EVERY environment (including production).
// This backend must be deployed to a persistent host (Render/Railway/Fly/VM),
// NOT Vercel serverless — serverless cannot hold WebSocket connections.
const httpServer = http.createServer(app);
initSocket(httpServer);

const startServer = async () => {
  try {
    await connectDatabase();
    await AuthService.seedAdmin();
    await AuthService.seedOwner();
    await FormService.seedDefaultFields();
    isConnected = true;
  } catch (error) {
    console.error('Startup DB error:', error);
  }

  httpServer.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
    console.log(`📍 Environment: ${config.nodeEnv}`);
  });
};

startServer();

// Export the Express app for backward compatibility (e.g. tests / serverless
// fallback). NOTE: real-time sockets are only available via httpServer above.
export default app;
