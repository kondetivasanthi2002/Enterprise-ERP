/**
 * Test Case 5: Role-Based Access Control (RBAC) Permission Guard Tests
 */
import { describe, it, expect } from 'vitest';
import { RBACEngine, PERMISSIONS } from '../src/engine/core/auth.js';
import { USER_ROLES } from '../src/models/schemas.js';

describe('RBAC Permission Guard System', () => {
  it('should allow Finance Manager to post journal entries', () => {
    const user = { id: 'usr_fin', name: 'Finance Manager', role: USER_ROLES.FINANCE_MANAGER };
    const rbac = new RBACEngine(user);

    expect(rbac.hasPermission(PERMISSIONS.FINANCE_POST_JOURNAL)).toBe(true);
    expect(rbac.guardPermission(PERMISSIONS.FINANCE_POST_JOURNAL)).toBe(true);
  });

  it('should block Sales Executive from posting financial journal entries', () => {
    const user = { id: 'usr_sales', name: 'Sales Agent', role: USER_ROLES.SALES_EXECUTIVE };
    const rbac = new RBACEngine(user);

    expect(rbac.hasPermission(PERMISSIONS.FINANCE_POST_JOURNAL)).toBe(false);
    expect(() => rbac.guardPermission(PERMISSIONS.FINANCE_POST_JOURNAL)).toThrow(/Access Denied/i);
  });

  it('should grant Super Admin all system permissions', () => {
    const admin = { id: 'usr_admin', name: 'Super Admin', role: USER_ROLES.SUPER_ADMIN };
    const rbac = new RBACEngine(admin);

    Object.values(PERMISSIONS).forEach(perm => {
      expect(rbac.hasPermission(perm)).toBe(true);
    });
  });
});
