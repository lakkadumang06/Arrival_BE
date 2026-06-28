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

// ── Reception Desk QR Intake & Lead Management ──────────────────────────

/** Lifecycle of a walk-in student inquiry captured at the reception desk. */
export enum InquiryStatus {
  WAITING = 'waiting',
  IN_CONSULTATION = 'in-consultation',
  RESCHEDULED = 'rescheduled',
  COMPLETED = 'completed',
}

/** RBAC roles. `admin` retained for backward-compat with the existing seed. */
export enum UserRole {
  OWNER = 'owner',
  RECEPTION = 'reception',
  ADMIN = 'admin',
  MANAGER = 'manager',
}

/** Which surface a dynamic FormField belongs to. */
export enum FormScope {
  WEBSITE = 'website',
  RECEPTION = 'reception',
}

/**
 * Granular capabilities the Owner can toggle for Reception accounts.
 * The Owner implicitly has all permissions regardless of these flags.
 */
export interface UserPermissions {
  viewQueue: boolean;
  updateStatus: boolean;
  viewStudentDetails: boolean;
  editStudentDetails: boolean;
  manageFormFields: boolean;
  manageTemplates: boolean;
  viewAnalytics: boolean;
  manageUsers: boolean;
}

export const DEFAULT_RECEPTION_PERMISSIONS: UserPermissions = {
  viewQueue: true,
  updateStatus: true,
  viewStudentDetails: true,
  editStudentDetails: false,
  manageFormFields: false,
  manageTemplates: false,
  viewAnalytics: false,
  manageUsers: false,
};

export const DEFAULT_OWNER_PERMISSIONS: UserPermissions = {
  viewQueue: true,
  updateStatus: true,
  viewStudentDetails: true,
  editStudentDetails: true,
  manageFormFields: true,
  manageTemplates: true,
  viewAnalytics: true,
  manageUsers: true,
};

export type PermissionKey = keyof UserPermissions;
