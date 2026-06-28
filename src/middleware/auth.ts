import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthRequest, PermissionKey, UserRole } from '../shared/types';
import { sendError } from '../shared/utils/apiResponse';
import { User } from '../modules/auth/auth.model';

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendError(res, 401, 'Access denied. No token provided.');
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      email: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    sendError(res, 401, 'Invalid or expired token.');
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, 403, 'Access denied. Insufficient permissions.');
      return;
    }
    next();
  };
};

/**
 * Granular RBAC: checks the Owner-toggleable permission flags stored on the
 * user document. Owner & admin bypass the check (they always have full access).
 * Permissions are read live from the DB so the Owner's toggles take effect
 * immediately without forcing the Receptionist to log in again.
 */
export const requirePermission = (permission: PermissionKey) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      sendError(res, 401, 'Access denied. No token provided.');
      return;
    }

    if (req.user.role === UserRole.OWNER || req.user.role === UserRole.ADMIN) {
      next();
      return;
    }

    const user = await User.findById(req.user.id).select('permissions active');
    if (!user || !user.active) {
      sendError(res, 403, 'Account is inactive.');
      return;
    }

    if (!user.permissions?.[permission]) {
      sendError(res, 403, `Access denied. Missing permission: ${permission}`);
      return;
    }

    next();
  };
};
