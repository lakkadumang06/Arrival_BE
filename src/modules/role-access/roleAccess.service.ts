import { RoleAccess, IRoleAccess } from './roleAccess.model';
import { AppError } from '../../shared/utils/AppError';
import {
  RoleAccessMatrix,
  MANAGED_ROLES,
  DEFAULT_ROLE_ACCESS,
  ACCESS_RESOURCES,
  AccessResource,
  AccessAction,
} from '../../shared/types';

export class RoleAccessService {
  static async getAll(): Promise<IRoleAccess[]> {
    return RoleAccess.find().sort({ role: 1 });
  }

  static async getByRole(role: string): Promise<IRoleAccess | null> {
    return RoleAccess.findOne({ role });
  }

  /** Owner updates the create/update/delete matrix for a managed role. */
  static async update(role: string, access: RoleAccessMatrix): Promise<IRoleAccess> {
    if (!MANAGED_ROLES.includes(role)) {
      throw new AppError('This role cannot be configured', 400);
    }

    // Normalise: only keep known resources/actions so the client can't inject
    // arbitrary keys into the Mixed field.
    const clean: RoleAccessMatrix = {} as RoleAccessMatrix;
    for (const resource of ACCESS_RESOURCES) {
      const incoming = (access?.[resource] ?? {}) as Partial<Record<AccessAction, boolean>>;
      clean[resource] = {
        create: Boolean(incoming.create),
        update: Boolean(incoming.update),
        delete: Boolean(incoming.delete),
      };
    }

    const doc = await RoleAccess.findOneAndUpdate(
      { role },
      { role, access: clean },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return doc;
  }

  /** True if the role is allowed to perform `action` on `resource`. */
  static async isAllowed(
    role: string,
    resource: AccessResource,
    action: AccessAction
  ): Promise<boolean> {
    const doc = await RoleAccess.findOne({ role });
    if (doc) return Boolean(doc.access?.[resource]?.[action]);
    // No matrix stored yet → fall back to the role defaults.
    return Boolean(DEFAULT_ROLE_ACCESS[role]?.[resource]?.[action]);
  }

  /** Creates the default matrix for each managed role once. */
  static async seedDefaults(): Promise<void> {
    for (const role of MANAGED_ROLES) {
      const existing = await RoleAccess.findOne({ role });
      if (!existing) {
        await RoleAccess.create({ role, access: DEFAULT_ROLE_ACCESS[role] });
        console.log(`✅ Default role-access seeded for: ${role}`);
      }
    }
  }
}
