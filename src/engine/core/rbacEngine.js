/**
 * ApexERP Enterprise Core - Fine-Grained RBAC & Security Permission Evaluator
 * Evaluates role permissions across 10 enterprise modules and sub-resource actions.
 */

export const ENTERPRISE_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  CHIEF_OPERATING_OFFICER: 'CHIEF_OPERATING_OFFICER',
  FINANCE_HEAD: 'FINANCE_HEAD',
  FINANCIAL_CONTROLLER: 'FINANCIAL_CONTROLLER',
  LOGISTICS_DIRECTOR: 'LOGISTICS_DIRECTOR',
  WAREHOUSE_MANAGER: 'WAREHOUSE_MANAGER',
  HCM_DIRECTOR: 'HCM_DIRECTOR',
  SALES_EXECUTIVE: 'SALES_EXECUTIVE',
  PRODUCTION_PLANNER: 'PRODUCTION_PLANNER',
  AUDITOR: 'AUDITOR'
};

export const PERMISSIONS = {
  // Financials
  FINANCE_VIEW_GL: 'FINANCE_VIEW_GL',
  FINANCE_POST_JOURNAL: 'FINANCE_POST_JOURNAL',
  FINANCE_APPROVE_PAYOUT: 'FINANCE_APPROVE_PAYOUT',
  FINANCE_CLOSE_PERIOD: 'FINANCE_CLOSE_PERIOD',

  // Inventory & SCM
  INVENTORY_VIEW_CATALOG: 'INVENTORY_VIEW_CATALOG',
  INVENTORY_ADJUST_STOCK: 'INVENTORY_ADJUST_STOCK',
  INVENTORY_TRANSFER_WH: 'INVENTORY_TRANSFER_WH',

  // HCM & Payroll
  HCM_VIEW_EMPLOYEES: 'HCM_VIEW_EMPLOYEES',
  HCM_ONBOARD_EMPLOYEE: 'HCM_ONBOARD_EMPLOYEE',
  HCM_EXECUTE_PAYROLL: 'HCM_EXECUTE_PAYROLL',
  HCM_VIEW_PAYSTUBS: 'HCM_VIEW_PAYSTUBS',

  // Procurement & Vendors
  PROCUREMENT_CREATE_PO: 'PROCUREMENT_CREATE_PO',
  PROCUREMENT_APPROVE_TIER1: 'PROCUREMENT_APPROVE_TIER1',
  PROCUREMENT_APPROVE_TIER2: 'PROCUREMENT_APPROVE_TIER2',

  // Sales & CRM
  SALES_CREATE_LEAD: 'SALES_CREATE_LEAD',
  SALES_UPDATE_STAGE: 'SALES_UPDATE_STAGE',
  SALES_VIEW_PIPELINE: 'SALES_VIEW_PIPELINE',

  // Admin & System
  ADMIN_MANAGE_USERS: 'ADMIN_MANAGE_USERS',
  ADMIN_VIEW_AUDIT: 'ADMIN_VIEW_AUDIT',
  ADMIN_CONFIGURE_NODES: 'ADMIN_CONFIGURE_NODES'
};

export class RBACEngine {
  constructor() {
    this.rolePermissionsMap = new Map();
    this.customUserPermissions = new Map();
    this.initializeDefaultMatrix();
  }

  initializeDefaultMatrix() {
    // Super Admin: All permissions
    this.rolePermissionsMap.set(ENTERPRISE_ROLES.SUPER_ADMIN, new Set(Object.values(PERMISSIONS)));

    // Chief Operating Officer: Financials, Inventory, HCM, Sales, Procurement, Audit
    this.rolePermissionsMap.set(ENTERPRISE_ROLES.CHIEF_OPERATING_OFFICER, new Set([
      PERMISSIONS.FINANCE_VIEW_GL, PERMISSIONS.FINANCE_POST_JOURNAL, PERMISSIONS.FINANCE_APPROVE_PAYOUT,
      PERMISSIONS.INVENTORY_VIEW_CATALOG, PERMISSIONS.INVENTORY_ADJUST_STOCK, PERMISSIONS.INVENTORY_TRANSFER_WH,
      PERMISSIONS.HCM_VIEW_EMPLOYEES, PERMISSIONS.HCM_EXECUTE_PAYROLL,
      PERMISSIONS.PROCUREMENT_CREATE_PO, PERMISSIONS.PROCUREMENT_APPROVE_TIER1, PERMISSIONS.PROCUREMENT_APPROVE_TIER2,
      PERMISSIONS.SALES_VIEW_PIPELINE, PERMISSIONS.ADMIN_VIEW_AUDIT
    ]));

    // Finance Head
    this.rolePermissionsMap.set(ENTERPRISE_ROLES.FINANCE_HEAD, new Set([
      PERMISSIONS.FINANCE_VIEW_GL, PERMISSIONS.FINANCE_POST_JOURNAL, PERMISSIONS.FINANCE_APPROVE_PAYOUT, PERMISSIONS.FINANCE_CLOSE_PERIOD,
      PERMISSIONS.PROCUREMENT_APPROVE_TIER1, PERMISSIONS.PROCUREMENT_APPROVE_TIER2, PERMISSIONS.HCM_EXECUTE_PAYROLL, PERMISSIONS.ADMIN_VIEW_AUDIT
    ]));

    // Financial Controller
    this.rolePermissionsMap.set(ENTERPRISE_ROLES.FINANCIAL_CONTROLLER, new Set([
      PERMISSIONS.FINANCE_VIEW_GL, PERMISSIONS.FINANCE_POST_JOURNAL, PERMISSIONS.PROCUREMENT_APPROVE_TIER1
    ]));

    // Warehouse Manager
    this.rolePermissionsMap.set(ENTERPRISE_ROLES.WAREHOUSE_MANAGER, new Set([
      PERMISSIONS.INVENTORY_VIEW_CATALOG, PERMISSIONS.INVENTORY_ADJUST_STOCK, PERMISSIONS.INVENTORY_TRANSFER_WH
    ]));

    // HCM Director
    this.rolePermissionsMap.set(ENTERPRISE_ROLES.HCM_DIRECTOR, new Set([
      PERMISSIONS.HCM_VIEW_EMPLOYEES, PERMISSIONS.HCM_ONBOARD_EMPLOYEE, PERMISSIONS.HCM_EXECUTE_PAYROLL, PERMISSIONS.HCM_VIEW_PAYSTUBS
    ]));

    // Sales Executive
    this.rolePermissionsMap.set(ENTERPRISE_ROLES.SALES_EXECUTIVE, new Set([
      PERMISSIONS.SALES_CREATE_LEAD, PERMISSIONS.SALES_UPDATE_STAGE, PERMISSIONS.SALES_VIEW_PIPELINE
    ]));

    // Auditor
    this.rolePermissionsMap.set(ENTERPRISE_ROLES.AUDITOR, new Set([
      PERMISSIONS.FINANCE_VIEW_GL, PERMISSIONS.INVENTORY_VIEW_CATALOG, PERMISSIONS.HCM_VIEW_EMPLOYEES, PERMISSIONS.ADMIN_VIEW_AUDIT
    ]));
  }

  /**
   * Check if a user role or user object has permission to execute an action
   */
  hasPermission(user, requiredPermission) {
    if (!user) return false;

    // Direct custom permission overrides
    if (user.id && this.customUserPermissions.has(user.id)) {
      const userCustomSet = this.customUserPermissions.get(user.id);
      if (userCustomSet.has(requiredPermission)) return true;
    }

    const userRole = String(user.role || user).trim().toUpperCase();
    const rolePermissions = this.rolePermissionsMap.get(userRole);

    if (!rolePermissions) return false;
    return rolePermissions.has(requiredPermission);
  }

  /**
   * Grant custom permission to specific user ID
   */
  grantCustomPermission(userId, permission) {
    const cleanId = String(userId).trim();
    if (!this.customUserPermissions.has(cleanId)) {
      this.customUserPermissions.set(cleanId, new Set());
    }
    this.customUserPermissions.get(cleanId).add(permission);
  }

  /**
   * Evaluate module accessibility for given user role
   */
  canAccessModule(user, moduleId) {
    const cleanModule = String(moduleId).trim().toLowerCase();
    const role = String(user?.role || user).trim().toUpperCase();

    if (role === ENTERPRISE_ROLES.SUPER_ADMIN || role === ENTERPRISE_ROLES.CHIEF_OPERATING_OFFICER) {
      return true;
    }

    switch (cleanModule) {
      case 'finance':
        return this.hasPermission(user, PERMISSIONS.FINANCE_VIEW_GL);
      case 'inventory':
        return this.hasPermission(user, PERMISSIONS.INVENTORY_VIEW_CATALOG);
      case 'hcm':
        return this.hasPermission(user, PERMISSIONS.HCM_VIEW_EMPLOYEES);
      case 'sales':
        return this.hasPermission(user, PERMISSIONS.SALES_VIEW_PIPELINE);
      case 'procurement':
        return this.hasPermission(user, PERMISSIONS.PROCUREMENT_CREATE_PO);
      case 'admin':
        return this.hasPermission(user, PERMISSIONS.ADMIN_VIEW_AUDIT);
      default:
        return true;
    }
  }

  /**
   * Export human-readable security policy breakdown with zero blank lines
   */
  exportSecurityMatrixReport() {
    const lines = [
      '==================================================',
      'APEX ENTERPRISE ERP - SECURITY POLICY MATRIX',
      '=================================================='
    ];

    this.rolePermissionsMap.forEach((permSet, role) => {
      lines.push(`ROLE: ${role}`);
      lines.push(`PERMISSIONS ASSIGNED (${permSet.size}):`);
      Array.from(permSet).sort().forEach(p => {
        lines.push(`  • ${p}`);
      });
      lines.push('--------------------------------------------------');
    });

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalRBACEngine = new RBACEngine();
