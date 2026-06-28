import { User, IUser } from '../auth/auth.model';
import { AppError } from '../../shared/utils/AppError';
import {
  UserRole,
  UserPermissions,
  DEFAULT_RECEPTION_PERMISSIONS,
} from '../../shared/types';

export class UserService {
  static async getAll(): Promise<IUser[]> {
    return User.find().sort({ createdAt: -1 });
  }

  static async create(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
    permissions?: Partial<UserPermissions>;
  }): Promise<IUser> {
    const existing = await User.findOne({ email: data.email.toLowerCase() });
    if (existing) throw new AppError('A user with this email already exists', 409);

    const role = data.role || UserRole.RECEPTION;
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: data.password,
      role,
      permissions: { ...DEFAULT_RECEPTION_PERMISSIONS, ...data.permissions },
    });
    return user;
  }

  /** Owner toggles which capabilities a Receptionist has. */
  static async updatePermissions(
    id: string,
    permissions: Partial<UserPermissions>
  ): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) throw new AppError('User not found', 404);
    if (user.role === UserRole.OWNER || user.role === UserRole.ADMIN) {
      throw new AppError('Cannot restrict an owner/admin account', 400);
    }

    user.permissions = { ...user.permissions, ...permissions } as UserPermissions;
    await user.save();
    return user;
  }

  static async update(
    id: string,
    data: Partial<Pick<IUser, 'name' | 'role' | 'active'>>
  ): Promise<IUser> {
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  static async delete(id: string, requesterId: string): Promise<void> {
    if (id === requesterId) throw new AppError('You cannot delete your own account', 400);
    const user = await User.findById(id);
    if (!user) throw new AppError('User not found', 404);
    if (user.role === UserRole.OWNER || user.role === UserRole.ADMIN) {
      throw new AppError('Cannot delete an owner/admin account', 400);
    }
    await user.deleteOne();
  }
}
