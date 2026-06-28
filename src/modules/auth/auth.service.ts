import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { User, IUser } from './auth.model';
import { AppError } from '../../shared/utils/AppError';

export class AuthService {
  static generateToken(user: IUser): string {
    return jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expire as any }
    );
  }

  static generateRefreshToken(user: IUser): string {
    return jwt.sign(
      { id: user._id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpire as any }
    );
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return { user, token, refreshToken };
  }

  static async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, config.jwt.refreshSecret) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user || user.refreshToken !== token) {
        throw new AppError('Invalid refresh token', 401);
      }

      const newToken = this.generateToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      user.refreshToken = newRefreshToken;
      await user.save();

      return { token: newToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  static async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { refreshToken: undefined });
  }

  static async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  static async seedAdmin() {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      await User.create({
        name: 'Admin',
        email: 'admin@immigration.com',
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('✅ Default admin created: admin@immigration.com / Admin@123');
    }
  }

  /** Seeds an Owner (full RBAC access) for the Reception Desk system. */
  static async seedOwner() {
    const existingOwner = await User.findOne({ role: 'owner' });
    if (!existingOwner) {
      await User.create({
        name: 'Owner',
        email: 'owner@immigration.com',
        password: 'Owner@123',
        role: 'owner',
      });
      console.log('✅ Default owner created: owner@immigration.com / Owner@123');
    }
  }
}
