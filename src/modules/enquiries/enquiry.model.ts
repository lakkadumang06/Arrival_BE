import mongoose, { Document, Schema } from 'mongoose';

export const VISA_TYPES = [
  'Student',
  'PR',
  'Tourist',
  'Work',
  'Business',
  'Family',
  'Other',
] as const;

export type VisaType = (typeof VISA_TYPES)[number];

export enum EnquiryStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  CLOSED = 'closed',
}

export interface IEnquiry extends Document {
  fullName: string;
  email: string;
  phone: string;
  visaType: VisaType;
  message?: string;
  status: EnquiryStatus;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const enquirySchema = new Schema<IEnquiry>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    visaType: { type: String, required: true, enum: VISA_TYPES },
    message: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: Object.values(EnquiryStatus),
      default: EnquiryStatus.NEW,
    },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ status: 1 });

export const Enquiry = mongoose.model<IEnquiry>('Enquiry', enquirySchema);
