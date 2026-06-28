import mongoose, { Document, Schema } from 'mongoose';
import { InquiryStatus } from '../../shared/types';

export interface IInquiry extends Document {
  name: string;
  mobile: string;
  address: string;
  goalCountry: string;
  targetIntake: string;
  joiningDate?: Date;
  status: InquiryStatus;
  notes: string;
  /** Any extra fields the Owner added through the reception form builder. */
  extraData: Record<string, any>;
  ipAddress?: string;
  browser?: string;
  /** Set when status transitions to `completed` — drives analytics & templates. */
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const inquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    address: { type: String, default: '', trim: true },
    goalCountry: { type: String, default: '', trim: true },
    targetIntake: { type: String, default: '', trim: true },
    joiningDate: { type: Date },
    status: {
      type: String,
      enum: Object.values(InquiryStatus),
      default: InquiryStatus.WAITING,
    },
    notes: { type: String, default: '' },
    extraData: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String },
    browser: { type: String },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

inquirySchema.index({ status: 1 });
inquirySchema.index({ createdAt: -1 });

export const Inquiry = mongoose.model<IInquiry>('Inquiry', inquirySchema);
