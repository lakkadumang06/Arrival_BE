import mongoose, { Document, Schema } from 'mongoose';

export interface ICMS extends Document {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
    ctaText: string;
  };
  about: {
    title: string;
    description: string;
    image: string;
  };
  whyChooseUs: {
    title: string;
    points: Array<{ icon: string; title: string; description: string }>;
  };
  testimonials: Array<{
    name: string;
    country: string;
    message: string;
    rating: number;
    image: string;
  }>;
  contact: {
    address: string;
    phone: string;
    email: string;
    mapUrl: string;
  };
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
    whatsapp: string;
  };
  footer: {
    text: string;
    copyright: string;
  };
  logo: string;
  createdAt: Date;
  updatedAt: Date;
}

const cmsSchema = new Schema<ICMS>(
  {
    hero: {
      title: { type: String, default: 'Your Immigration Journey Starts Here' },
      subtitle: { type: String, default: 'Expert immigration consultancy services' },
      backgroundImage: { type: String, default: '' },
      ctaText: { type: String, default: 'Apply Now' },
    },
    about: {
      title: { type: String, default: 'About Us' },
      description: { type: String, default: '' },
      image: { type: String, default: '' },
    },
    whyChooseUs: {
      title: { type: String, default: 'Why Choose Us' },
      points: [
        {
          icon: { type: String, default: '' },
          title: { type: String, default: '' },
          description: { type: String, default: '' },
        },
      ],
    },
    testimonials: [
      {
        name: { type: String },
        country: { type: String },
        message: { type: String },
        rating: { type: Number, min: 1, max: 5 },
        image: { type: String },
      },
    ],
    contact: {
      address: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      mapUrl: { type: String, default: '' },
    },
    socialMedia: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      youtube: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
    },
    footer: {
      text: { type: String, default: '' },
      copyright: { type: String, default: '' },
    },
    logo: { type: String, default: '' },
  },
  { timestamps: true }
);

export const CMS = mongoose.model<ICMS>('CMS', cmsSchema);
