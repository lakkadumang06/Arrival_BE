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

// ── Dynamic CRUD access matrix (Owner-configurable, per role) ───────────
//
// The Owner is the super-admin: always unrestricted and the only role that can
// open the "Assign Role" screen. Every OTHER managed role (Co-owner/admin and
// Reception) gets a per-resource create/update/delete matrix the Owner can
// toggle live. `requireAccess()` enforces it on the write routes.

export type AccessAction = 'create' | 'update' | 'delete';

export interface ResourceAccess {
  create: boolean;
  update: boolean;
  delete: boolean;
}

export const ACCESS_RESOURCES = [
  'leads',
  'services',
  'successStories',
  'faq',
  'cms',
] as const;

export type AccessResource = (typeof ACCESS_RESOURCES)[number];

export type RoleAccessMatrix = Record<AccessResource, ResourceAccess>;

/** Roles whose access the Owner can configure (Owner itself is unrestricted). */
export const MANAGED_ROLES: string[] = [UserRole.ADMIN, UserRole.RECEPTION];

const everything = (): ResourceAccess => ({ create: true, update: true, delete: true });
const nothing = (): ResourceAccess => ({ create: false, update: false, delete: false });

export const buildMatrix = (factory: () => ResourceAccess): RoleAccessMatrix =>
  ACCESS_RESOURCES.reduce((acc, resource) => {
    acc[resource] = factory();
    return acc;
  }, {} as RoleAccessMatrix);

/** Co-owner (admin) starts with full CRUD on everything. */
export const DEFAULT_ADMIN_ACCESS: RoleAccessMatrix = buildMatrix(everything);

/** Reception starts locked down — the Owner opens up what they need. */
export const DEFAULT_RECEPTION_ACCESS: RoleAccessMatrix = {
  ...buildMatrix(nothing),
  leads: { create: false, update: true, delete: false },
};

export const DEFAULT_ROLE_ACCESS: Record<string, RoleAccessMatrix> = {
  [UserRole.ADMIN]: DEFAULT_ADMIN_ACCESS,
  [UserRole.RECEPTION]: DEFAULT_RECEPTION_ACCESS,
};
