import mongoose, { Document, Schema } from 'mongoose';
import { LeadStatus } from '../../shared/types';

export interface ILead extends Document {
  formData: Record<string, any>;
  status: LeadStatus;
  notes: string;
  ipAddress?: string;
  browser?: string;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    formData: { type: Schema.Types.Mixed, required: true },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.NEW,
    },
    notes: { type: String, default: '' },
    ipAddress: { type: String },
    browser: { type: String },
  },
  { timestamps: true }
);

leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });

export const Lead = mongoose.model<ILead>('Lead', leadSchema);
