import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  UserRole,
  UserPermissions,
  DEFAULT_RECEPTION_PERMISSIONS,
  DEFAULT_OWNER_PERMISSIONS,
} from '../../shared/types';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  permissions: UserPermissions;
  active: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const permissionsSchema = new Schema<UserPermissions>(
  {
    viewQueue: { type: Boolean, default: true },
    updateStatus: { type: Boolean, default: true },
    viewStudentDetails: { type: Boolean, default: true },
    editStudentDetails: { type: Boolean, default: false },
    manageFormFields: { type: Boolean, default: false },
    manageTemplates: { type: Boolean, default: false },
    viewAnalytics: { type: Boolean, default: false },
    manageUsers: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    // `admin`/`manager` kept so the existing seeded admin keeps working.
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.ADMIN,
    },
    permissions: { type: permissionsSchema, default: () => ({ ...DEFAULT_RECEPTION_PERMISSIONS }) },
    active: { type: Boolean, default: true },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

/** Owner & admin always operate with the full permission set. */
userSchema.pre('save', function (next) {
  if (this.role === UserRole.OWNER || this.role === UserRole.ADMIN) {
    this.permissions = { ...DEFAULT_OWNER_PERMISSIONS };
  }
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const { password, refreshToken, ...rest } = ret;
    return rest;
  },
});

export const User = mongoose.model<IUser>('User', userSchema);
