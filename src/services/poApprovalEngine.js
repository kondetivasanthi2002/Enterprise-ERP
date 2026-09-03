/**
 * ApexERP Purchase Order Approval Workflow Engine
 */
export const APPROVAL_TIERS = {
  STAFF: { maxAmount: 1000, role: 'Staff Buyer', requiredApprover: 'BUYER' },
  MANAGER: { maxAmount: 5000, role: 'Procurement Manager', requiredApprover: 'PROCUREMENT_MANAGER' },
  VP: { maxAmount: 25000, role: 'VP of Supply Chain', requiredApprover: 'VP_SUPPLY_CHAIN' },
  CFO: { maxAmount: Infinity, role: 'Chief Financial Officer', requiredApprover: 'CFO' }
};

export const evaluatePOApproval = (poAmount) => {
  let requiredTier = APPROVAL_TIERS.STAFF;
  if (poAmount > 25000) {
    requiredTier = APPROVAL_TIERS.CFO;
  } else if (poAmount > 5000) {
    requiredTier = APPROVAL_TIERS.VP;
  } else if (poAmount > 1000) {
    requiredTier = APPROVAL_TIERS.MANAGER;
  }

  const isAutoApproved = poAmount <= 1000;
  return {
    poAmount,
    requiredTier: requiredTier.role,
    requiredApproverRole: requiredTier.requiredApprover,
    status: isAutoApproved ? 'APPROVED' : 'PENDING_APPROVAL',
    requiresCFO: poAmount > 25000
  };
};
