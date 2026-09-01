/**
 * ApexERP Enterprise Core - Authentication & Role-Based Access Control (RBAC) Engine
 */

import { USER_ROLES } from '../../models/schemas.js';

export const PERMISSIONS = {
  // Finance
  FINANCE_VIEW: 'FINANCE_VIEW',
  FINANCE_POST_JOURNAL: 'FINANCE_POST_JOURNAL',
  FINANCE_RECONCILE: 'FINANCE_RECONCILE',
  FINANCE_CLOSE_PERIOD: 'FINANCE_CLOSE_PERIOD',

  // Inventory
  INVENTORY_VIEW: 'INVENTORY_VIEW',
  INVENTORY_RECEIVE: 'INVENTORY_RECEIVE',
  INVENTORY_TRANSFER: 'INVENTORY_TRANSFER',
  INVENTORY_ADJUST: 'INVENTORY_ADJUST',

  // Sales
  SALES_VIEW: 'SALES_VIEW',
  SALES_CREATE_QUOTE: 'SALES_CREATE_QUOTE',
  SALES_CREATE_INVOICE: 'SALES_CREATE_INVOICE',
  SALES_OVERRIDE_CREDIT: 'SALES_OVERRIDE_CREDIT',

  // Procurement
  PROCUREMENT_VIEW: 'PROCUREMENT_VIEW',
  PROCUREMENT_CREATE_PO: 'PROCUREMENT_CREATE_PO',
  PROCUREMENT_APPROVE_PO: 'PROCUREMENT_APPROVE_PO',

  // HR & Payroll
  HR_VIEW: 'HR_VIEW',
  HR_MANAGE_EMPLOYEES: 'HR_MANAGE_EMPLOYEES',
  PAYROLL_PROCESS: 'PAYROLL_PROCESS',
  PAYROLL_APPROVE: 'PAYROLL_APPROVE',

  // Manufacturing
  MRP_VIEW: 'MRP_VIEW',
  MRP_CREATE_BOM: 'MRP_CREATE_BOM',
  MRP_RELEASE_WORK_ORDER: 'MRP_RELEASE_WORK_ORDER',

  // Admin
  SYSTEM_CONFIG: 'SYSTEM_CONFIG',
  AUDIT_VIEW: 'AUDIT_VIEW'
};

const ROLE_PERMISSIONS_MATRIX = {
  [USER_ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  
  [USER_ROLES.FINANCE_MANAGER]: [
    PERMISSIONS.FINANCE_VIEW,
    PERMISSIONS.FINANCE_POST_JOURNAL,
    PERMISSIONS.FINANCE_RECONCILE,
    PERMISSIONS.FINANCE_CLOSE_PERIOD,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.PROCUREMENT_VIEW,
    PERMISSIONS.PAYROLL_APPROVE,
    PERMISSIONS.AUDIT_VIEW
  ],

  [USER_ROLES.ACCOUNTANT]: [
    PERMISSIONS.FINANCE_VIEW,
    PERMISSIONS.FINANCE_POST_JOURNAL,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.PROCUREMENT_VIEW
  ],

  [USER_ROLES.INVENTORY_MANAGER]: [
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_RECEIVE,
    PERMISSIONS.INVENTORY_TRANSFER,
    PERMISSIONS.INVENTORY_ADJUST,
    PERMISSIONS.MRP_VIEW
  ],

  [USER_ROLES.SALES_EXECUTIVE]: [
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.SALES_CREATE_QUOTE,
    PERMISSIONS.SALES_CREATE_INVOICE,
    PERMISSIONS.INVENTORY_VIEW
  ],

  [USER_ROLES.PROCUREMENT_OFFICER]: [
    PERMISSIONS.PROCUREMENT_VIEW,
    PERMISSIONS.PROCUREMENT_CREATE_PO,
    PERMISSIONS.INVENTORY_VIEW
  ],

  [USER_ROLES.HR_DIRECTOR]: [
    PERMISSIONS.HR_VIEW,
    PERMISSIONS.HR_MANAGE_EMPLOYEES,
    PERMISSIONS.PAYROLL_PROCESS,
    PERMISSIONS.PAYROLL_APPROVE
  ],

  [USER_ROLES.PRODUCTION_PLANNER]: [
    PERMISSIONS.MRP_VIEW,
    PERMISSIONS.MRP_CREATE_BOM,
    PERMISSIONS.MRP_RELEASE_WORK_ORDER,
    PERMISSIONS.INVENTORY_VIEW
  ],

  [USER_ROLES.AUDITOR]: [
    PERMISSIONS.FINANCE_VIEW,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.SALES_VIEW,
    PERMISSIONS.PROCUREMENT_VIEW,
    PERMISSIONS.HR_VIEW,
    PERMISSIONS.MRP_VIEW,
    PERMISSIONS.AUDIT_VIEW
  ]
};

export class RBACEngine {
  constructor(user) {
    this.user = user || { id: 'usr_guest', role: 'GUEST', name: 'Guest User' };
  }

  hasPermission(permission) {
    if (!this.user || !this.user.role) return false;
    const permissions = ROLE_PERMISSIONS_MATRIX[this.user.role] || [];
    return permissions.includes(permission);
  }

  hasAnyPermission(permissionsList) {
    return permissionsList.some(p => this.hasPermission(p));
  }

  hasAllPermissions(permissionsList) {
    return permissionsList.every(p => this.hasPermission(p));
  }

  getEffectivePermissions() {
    if (!this.user || !this.user.role) return [];
    return ROLE_PERMISSIONS_MATRIX[this.user.role] || [];
  }

  guardPermission(permission, actionDescription = 'execute action') {
    if (!this.hasPermission(permission)) {
      const errorMsg = `Access Denied: User '${this.user.name}' (${this.user.role}) lacks permission '${permission}' to ${actionDescription}.`;
      console.warn(`[RBAC GUARD] ${errorMsg}`);
      throw new Error(errorMsg);
    }
    return true;
  }
}
