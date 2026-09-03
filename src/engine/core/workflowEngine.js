/**
 * ApexERP Enterprise Core - Multi-Stage Workflow & Approval State Machine Engine
 * Handles approval workflows for POs, CapEx requests, and Payroll disbursements with multi-tier routing.
 */

export const WORKFLOW_STATUS = {
  DRAFT: 'DRAFT',
  PENDING_LEVEL1: 'PENDING_LEVEL1',
  PENDING_LEVEL2: 'PENDING_LEVEL2',
  PENDING_LEVEL3: 'PENDING_LEVEL3',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
};

export class WorkflowEngine {
  constructor() {
    this.workflowsMap = new Map();
  }

  /**
   * Determine required approval tiers based on transaction monetary threshold
   */
  determineRequiredTiers(amountUSD) {
    const amt = Number(amountUSD || 0);
    if (amt <= 10000) {
      return ['STAFF_SUPERVISOR'];
    } else if (amt <= 50000) {
      return ['STAFF_SUPERVISOR', 'DEPARTMENT_HEAD'];
    } else if (amt <= 250000) {
      return ['STAFF_SUPERVISOR', 'DEPARTMENT_HEAD', 'FINANCIAL_CONTROLLER'];
    } else {
      return ['STAFF_SUPERVISOR', 'DEPARTMENT_HEAD', 'FINANCIAL_CONTROLLER', 'VP_SUPPLY_CHAIN_OR_CFO'];
    }
  }

  /**
   * Initialize a new approval workflow instance
   */
  createWorkflow({ entityType, entityId, requestedBy, amountUSD, metadata = {} }) {
    const workflowId = `WF-${globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().substring(0, 8).toUpperCase() : Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const tiers = this.determineRequiredTiers(amountUSD);

    const instance = {
      workflowId: workflowId.trim(),
      entityType: String(entityType || 'PURCHASE_ORDER').trim(),
      entityId: String(entityId).trim(),
      requestedBy: String(requestedBy || 'SYSTEM').trim(),
      amountUSD: Number(amountUSD || 0),
      currentStatus: WORKFLOW_STATUS.PENDING_LEVEL1,
      requiredTiers: tiers,
      currentTierIndex: 0,
      approvalHistory: [
        {
          timestamp: new Date().toISOString(),
          action: 'WORKFLOW_INITIALIZED',
          actor: String(requestedBy).trim(),
          notes: `Workflow initialized with ${tiers.length} required approval tier(s)`
        }
      ],
      metadata
    };

    this.workflowsMap.set(workflowId, instance);
    return instance;
  }

  /**
   * Process approval step from an authorized actor
   */
  approveStep({ workflowId, actor, actorRole, notes = '' }) {
    const wf = this.workflowsMap.get(workflowId);
    if (!wf) throw new Error(`Workflow instance '${workflowId}' not found.`);

    if (wf.currentStatus === WORKFLOW_STATUS.APPROVED || wf.currentStatus === WORKFLOW_STATUS.REJECTED) {
      throw new Error(`Workflow '${workflowId}' is already finalized with status: ${wf.currentStatus}`);
    }

    const currentRequiredRole = wf.requiredTiers[wf.currentTierIndex];
    wf.approvalHistory.push({
      timestamp: new Date().toISOString(),
      action: 'TIER_APPROVED',
      actor: String(actor).trim(),
      actorRole: String(actorRole).trim(),
      tierApproved: currentRequiredRole,
      notes: String(notes).trim()
    });

    if (wf.currentTierIndex + 1 < wf.requiredTiers.length) {
      wf.currentTierIndex += 1;
      const nextLevel = `PENDING_LEVEL${wf.currentTierIndex + 1}`;
      wf.currentStatus = WORKFLOW_STATUS[nextLevel] || WORKFLOW_STATUS.PENDING_LEVEL2;
    } else {
      wf.currentStatus = WORKFLOW_STATUS.APPROVED;
      wf.approvalHistory.push({
        timestamp: new Date().toISOString(),
        action: 'WORKFLOW_COMPLETED_APPROVED',
        actor: 'SYSTEM',
        notes: 'All required approval tiers fulfilled.'
      });
    }

    return wf;
  }

  /**
   * Reject workflow step and terminate routing
   */
  rejectWorkflow({ workflowId, actor, rejectionReason = 'Criteria not met' }) {
    const wf = this.workflowsMap.get(workflowId);
    if (!wf) throw new Error(`Workflow instance '${workflowId}' not found.`);

    wf.currentStatus = WORKFLOW_STATUS.REJECTED;
    wf.approvalHistory.push({
      timestamp: new Date().toISOString(),
      action: 'WORKFLOW_REJECTED',
      actor: String(actor).trim(),
      notes: String(rejectionReason).trim()
    });

    return wf;
  }

  /**
   * Get formatted workflow summary string with zero empty whitespace lines
   */
  exportWorkflowSummary(workflowId) {
    const wf = this.workflowsMap.get(workflowId);
    if (!wf) return '';

    const lines = [
      '==================================================',
      `APEX ERP WORKFLOW AUDIT - ID: ${wf.workflowId}`,
      `Entity: ${wf.entityType} | Entity ID: ${wf.entityId}`,
      `Total Value: $${wf.amountUSD.toLocaleString()} USD`,
      `Current Status: ${wf.currentStatus}`,
      '==================================================',
      'APPROVAL TIER PROGRESSION:'
    ];

    wf.requiredTiers.forEach((tier, i) => {
      const isDone = i < wf.currentTierIndex || wf.currentStatus === WORKFLOW_STATUS.APPROVED;
      const isCurrent = i === wf.currentTierIndex && wf.currentStatus !== WORKFLOW_STATUS.APPROVED;
      const statusIcon = isDone ? '✅ [APPROVED]' : isCurrent ? '⏳ [PENDING]' : '⏹️ [WAITING]';
      lines.push(`  Tier ${i + 1}: ${tier} -> ${statusIcon}`);
    });

    lines.push('--------------------------------------------------');
    lines.push('AUDIT TRAIL LOG:');
    wf.approvalHistory.forEach(hist => {
      lines.push(`  • [${hist.timestamp}] ${hist.action} by ${hist.actor}: ${hist.notes}`);
    });

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalWorkflowEngine = new WorkflowEngine();
