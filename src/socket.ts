import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from './config';

/**
 * Real-time layer for the Reception Desk.
 *
 * NOTE: Socket.io needs a long-lived process holding persistent connections,
 * so the backend must run on a persistent host (Render / Railway / Fly / a VM)
 * — it will NOT work on Vercel serverless functions.
 *
 * Rooms:
 *   - `reception`  → reception desk PCs (live queue notifications)
 *   - `owner`      → owner dashboards (queue + analytics-affecting events)
 */

export enum SocketEvent {
  INQUIRY_NEW = 'inquiry:new',
  INQUIRY_UPDATED = 'inquiry:updated',
  INQUIRY_DELETED = 'inquiry:deleted',
}

let io: SocketServer | null = null;

export const initSocket = (httpServer: HttpServer): SocketServer => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: config.allowedOrigins,
      credentials: true,
    },
  });

  // Authenticate the socket handshake with the same JWT used by the REST API.
  io.use((socket: Socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers.authorization || '').replace('Bearer ', '');

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as {
        id: string;
        email: string;
        role: string;
      };
      socket.data.user = decoded;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const role = socket.data.user?.role;

    // Anyone authenticated joins the reception room (live queue).
    socket.join('reception');
    if (role === 'owner' || role === 'admin') {
      socket.join('owner');
    }

    socket.on('disconnect', () => {
      // no-op; rooms are cleaned up automatically
    });
  });

  console.log('🔌 Socket.io initialized');
  return io;
};

export const getIO = (): SocketServer | null => io;

/** Broadcast an event to the reception desk + owner dashboards. */
export const emitToDashboards = (event: SocketEvent, payload: unknown): void => {
  if (!io) return;
  io.to('reception').to('owner').emit(event, payload);
};
