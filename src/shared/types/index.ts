import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  FOLLOW_UP = 'follow_up',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CLOSED = 'closed',
}

export enum FormFieldType {
  TEXT = 'text',
  EMAIL = 'email',
  PHONE = 'phone',
  NUMBER = 'number',
  TEXTAREA = 'textarea',
  DATE = 'date',
  DROPDOWN = 'dropdown',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  COUNTRY_SELECTOR = 'country_selector',
  VISA_TYPE_SELECTOR = 'visa_type_selector',
}

export interface FormFieldOption {
  label: string;
  value: string;
}
