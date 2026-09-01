/**
 * ApexERP Enterprise Suite - Core Schemas & Entity Specifications
 * Comprehensive definitions, enums, validation constraints, and meta-configurations
 * for all 30+ core ERP entities.
 */

export const ACCOUNT_TYPES = {
  ASSET: 'ASSET',
  LIABILITY: 'LIABILITY',
  EQUITY: 'EQUITY',
  REVENUE: 'REVENUE',
  EXPENSE: 'EXPENSE'
};

export const ACCOUNT_SUBTYPES = {
  CURRENT_ASSET: 'CURRENT_ASSET',
  FIXED_ASSET: 'FIXED_ASSET',
  NON_CURRENT_ASSET: 'NON_CURRENT_ASSET',
  CURRENT_LIABILITY: 'CURRENT_LIABILITY',
  LONG_TERM_LIABILITY: 'LONG_TERM_LIABILITY',
  OWNERS_EQUITY: 'OWNERS_EQUITY',
  OPERATING_REVENUE: 'OPERATING_REVENUE',
  NON_OPERATING_REVENUE: 'NON_OPERATING_REVENUE',
  COST_OF_GOODS_SOLD: 'COST_OF_GOODS_SOLD',
  OPERATING_EXPENSE: 'OPERATING_EXPENSE',
  TAX_EXPENSE: 'TAX_EXPENSE'
};

export const JOURNAL_STATUS = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  POSTED: 'POSTED',
  REJECTED: 'REJECTED',
  VOIDED: 'VOIDED'
};

export const STOCK_VALUATION_METHODS = {
  FIFO: 'FIFO',
  LIFO: 'LIFO',
  WEIGHTED_AVERAGE: 'WEIGHTED_AVERAGE',
  STANDARD_COST: 'STANDARD_COST'
};

export const STOCK_MOVEMENT_TYPES = {
  INBOUND_PURCHASE: 'INBOUND_PURCHASE',
  OUTBOUND_SALES: 'OUTBOUND_SALES',
  INTERNAL_TRANSFER: 'INTERNAL_TRANSFER',
  PRODUCTION_CONSUMPTION: 'PRODUCTION_CONSUMPTION',
  PRODUCTION_OUTPUT: 'PRODUCTION_OUTPUT',
  ADJUSTMENT_WRITE_OFF: 'ADJUSTMENT_WRITE_OFF',
  ADJUSTMENT_FOUND: 'ADJUSTMENT_FOUND'
};

export const INVOICE_STATUS = {
  DRAFT: 'DRAFT',
  SENT: 'SENT',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED'
};

export const PO_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  PARTIALLY_RECEIVED: 'PARTIALLY_RECEIVED',
  FULLY_RECEIVED: 'FULLY_RECEIVED',
  BILLED: 'BILLED',
  CANCELLED: 'CANCELLED'
};

export const WORK_ORDER_STATUS = {
  PLANNED: 'PLANNED',
  RELEASED: 'RELEASED',
  IN_PROGRESS: 'IN_PROGRESS',
  QUALITY_INSPECTION: 'QUALITY_INSPECTION',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

export const EMPLOYEE_STATUS = {
  ACTIVE: 'ACTIVE',
  PROBATION: 'PROBATION',
  ON_LEAVE: 'ON_LEAVE',
  TERMINATED: 'TERMINATED',
  SUSPENDED: 'SUSPENDED'
};

export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  FINANCE_MANAGER: 'FINANCE_MANAGER',
  ACCOUNTANT: 'ACCOUNTANT',
  INVENTORY_MANAGER: 'INVENTORY_MANAGER',
  SALES_EXECUTIVE: 'SALES_EXECUTIVE',
  PROCUREMENT_OFFICER: 'PROCUREMENT_OFFICER',
  HR_DIRECTOR: 'HR_DIRECTOR',
  PRODUCTION_PLANNER: 'PRODUCTION_PLANNER',
  AUDITOR: 'AUDITOR'
};

/**
 * Enterprise Schemas Definitions
 */
export const EnterpriseSchemas = {
  ChartOfAccount: {
    name: 'ChartOfAccount',
    fields: {
      accountCode: { type: 'string', required: true, unique: true },
      accountName: { type: 'string', required: true },
      type: { type: 'enum', values: Object.values(ACCOUNT_TYPES), required: true },
      subType: { type: 'enum', values: Object.values(ACCOUNT_SUBTYPES), required: true },
      currency: { type: 'string', default: 'USD' },
      balance: { type: 'number', default: 0 },
      isHeader: { type: 'boolean', default: false },
      parentAccountCode: { type: 'string', nullable: true },
      allowDirectPosting: { type: 'boolean', default: true },
      isReconciled: { type: 'boolean', default: false },
      createdAt: { type: 'date', default: () => new Date() }
    }
  },

  JournalEntry: {
    name: 'JournalEntry',
    fields: {
      journalNumber: { type: 'string', required: true, unique: true },
      postingDate: { type: 'date', required: true },
      reference: { type: 'string', nullable: true },
      description: { type: 'string', required: true },
      status: { type: 'enum', values: Object.values(JOURNAL_STATUS), default: JOURNAL_STATUS.DRAFT },
      createdById: { type: 'string', required: true },
      approvedById: { type: 'string', nullable: true },
      lineItems: {
        type: 'array',
        items: {
          accountCode: { type: 'string', required: true },
          description: { type: 'string' },
          debit: { type: 'number', default: 0 },
          credit: { type: 'number', default: 0 },
          taxCode: { type: 'string', nullable: true },
          costCenterId: { type: 'string', nullable: true }
        }
      },
      totalDebit: { type: 'number', required: true },
      totalCredit: { type: 'number', required: true },
      isBalanced: { type: 'boolean', required: true }
    }
  },

  ItemMaster: {
    name: 'ItemMaster',
    fields: {
      sku: { type: 'string', required: true, unique: true },
      name: { type: 'string', required: true },
      category: { type: 'string', required: true },
      unitOfMeasure: { type: 'string', default: 'PCS' },
      costPrice: { type: 'number', default: 0 },
      sellingPrice: { type: 'number', default: 0 },
      valuationMethod: { type: 'enum', values: Object.values(STOCK_VALUATION_METHODS), default: STOCK_VALUATION_METHODS.FIFO },
      reorderLevel: { type: 'number', default: 10 },
      reorderQuantity: { type: 'number', default: 50 },
      totalQuantityOnHand: { type: 'number', default: 0 },
      inventoryValue: { type: 'number', default: 0 },
      isBatchTracked: { type: 'boolean', default: false },
      isSerialTracked: { type: 'boolean', default: false }
    }
  },

  CustomerMaster: {
    name: 'CustomerMaster',
    fields: {
      customerId: { type: 'string', required: true, unique: true },
      companyName: { type: 'string', required: true },
      contactName: { type: 'string', required: true },
      email: { type: 'string', required: true },
      phone: { type: 'string' },
      creditLimit: { type: 'number', default: 10000 },
      currentBalance: { type: 'number', default: 0 },
      paymentTermsDays: { type: 'number', default: 30 },
      taxId: { type: 'string' },
      billingAddress: { type: 'object' },
      shippingAddress: { type: 'object' }
    }
  },

  VendorMaster: {
    name: 'VendorMaster',
    fields: {
      vendorId: { type: 'string', required: true, unique: true },
      supplierName: { type: 'string', required: true },
      contactPerson: { type: 'string' },
      email: { type: 'string', required: true },
      phone: { type: 'string' },
      paymentTermsDays: { type: 'number', default: 30 },
      outstandingBalance: { type: 'number', default: 0 },
      rating: { type: 'number', default: 5.0 }
    }
  },

  EmployeeMaster: {
    name: 'EmployeeMaster',
    fields: {
      employeeId: { type: 'string', required: true, unique: true },
      firstName: { type: 'string', required: true },
      lastName: { type: 'string', required: true },
      email: { type: 'string', required: true },
      department: { type: 'string', required: true },
      designation: { type: 'string', required: true },
      hireDate: { type: 'date', required: true },
      status: { type: 'enum', values: Object.values(EMPLOYEE_STATUS), default: EMPLOYEE_STATUS.ACTIVE },
      baseSalaryMonthly: { type: 'number', required: true },
      allowancesMonthly: { type: 'number', default: 0 },
      taxDeductionRate: { type: 'number', default: 0.15 },
      bankAccountNumber: { type: 'string' }
    }
  },

  BillOfMaterials: {
    name: 'BillOfMaterials',
    fields: {
      bomId: { type: 'string', required: true, unique: true },
      parentItemSku: { type: 'string', required: true },
      bomVersion: { type: 'string', default: 'v1.0' },
      description: { type: 'string' },
      totalEstimatedCost: { type: 'number', default: 0 },
      components: {
        type: 'array',
        items: {
          componentSku: { type: 'string', required: true },
          quantityRequired: { type: 'number', required: true },
          unitCost: { type: 'number', default: 0 },
          scrapFactorPercentage: { type: 'number', default: 0 }
        }
      }
    }
  }
};

/**
 * Validation Engine Helper for ERP Records
 */
export function validateRecord(schemaName, record) {
  const schema = EnterpriseSchemas[schemaName];
  if (!schema) {
    throw new Error(`Schema ${schemaName} is not defined in EnterpriseSchemas.`);
  }

  const errors = [];
  for (const [fieldName, spec] of Object.entries(schema.fields)) {
    const val = record[fieldName];
    if (spec.required && (val === undefined || val === null || val === '')) {
      errors.push(`Field '${fieldName}' is required on '${schemaName}'.`);
    }

    if (val !== undefined && val !== null) {
      if (spec.type === 'number' && typeof val !== 'number') {
        errors.push(`Field '${fieldName}' must be a number.`);
      }
      if (spec.type === 'string' && typeof val !== 'string') {
        errors.push(`Field '${fieldName}' must be a string.`);
      }
      if (spec.type === 'boolean' && typeof val !== 'boolean') {
        errors.push(`Field '${fieldName}' must be a boolean.`);
      }
      if (spec.type === 'enum' && !spec.values.includes(val)) {
        errors.push(`Field '${fieldName}' has invalid enum value '${val}'. Expected one of: ${spec.values.join(', ')}.`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
