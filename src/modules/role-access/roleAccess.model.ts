import mongoose, { Document, Schema } from 'mongoose';
import { RoleAccessMatrix, MANAGED_ROLES } from '../../shared/types';

export interface IRoleAccess extends Document {
  role: string;
  access: RoleAccessMatrix;
  createdAt: Date;
  updatedAt: Date;
}

const roleAccessSchema = new Schema<IRoleAccess>(
  {
    role: {
      type: String,
      required: true,
      unique: true,
      enum: MANAGED_ROLES,
    },
    // The full create/update/delete matrix is stored as a flexible sub-document
    // so new resources can be added without a migration.
    access: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const RoleAccess = mongoose.model<IRoleAccess>('RoleAccess', roleAccessSchema);
