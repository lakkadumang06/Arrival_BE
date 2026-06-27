import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    companyName: { type: String, default: 'Immigration Consultancy' },
    tagline: { type: String, default: 'Your Trusted Immigration Partner' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    theme: {
      primaryColor: { type: String, default: '#1e40af' },
      secondaryColor: { type: String, default: '#1e293b' },
      accentColor: { type: String, default: '#f59e0b' },
    },
  },
  { timestamps: true }
);

export const Settings = mongoose.model<ISettings>('Settings', settingsSchema);
