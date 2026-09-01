/**
 * ApexERP Enterprise Sales & CRM Schemas
 * Comprehensive definitions for CRM pipeline, Lead Scoring, Quotations, Territory Maps, and Pricing Matrices.
 */

export const CRM_LEAD_SOURCES = {
  WEBSITE_INBOUND: 'WEBSITE_INBOUND',
  GLOBAL_TRADE_SHOW: 'GLOBAL_TRADE_SHOW',
  PARTNER_REFERRAL: 'PARTNER_REFERRAL',
  OUTBOUND_SALES_PROSPECTING: 'OUTBOUND_SALES_PROSPECTING',
  WEBINAR_CAMPAIGN: 'WEBINAR_CAMPAIGN'
};

export const OPPORTUNITY_STAGE_DEFINITIONS = [
  { stageId: 'STG-01', name: 'Prospecting & Lead Qualification', probabilityPercent: 10 },
  { stageId: 'STG-02', name: 'Needs Analysis & Discovery Call', probabilityPercent: 25 },
  { stageId: 'STG-03', name: 'RFP Response & Solution Proposal', probabilityPercent: 50 },
  { stageId: 'STG-04', name: 'Executive Demo & Proof-of-Concept', probabilityPercent: 70 },
  { stageId: 'STG-05', name: 'Contract Negotiation & Legal Review', probabilityPercent: 90 },
  { stageId: 'STG-06', name: 'Closed Won - Executed Contract', probabilityPercent: 100 },
  { stageId: 'STG-07', name: 'Closed Lost', probabilityPercent: 0 }
];

export const CUSTOMER_CREDIT_RATINGS = {
  AAA_PRIME: { rating: 'AAA', maxCreditLimit: 1000000.00, allowedPaymentTermsDays: 90 },
  AA_VERY_STRONG: { rating: 'AA', maxCreditLimit: 500000.00, allowedPaymentTermsDays: 60 },
  A_STRONG: { rating: 'A', maxCreditLimit: 250000.00, allowedPaymentTermsDays: 45 },
  BBB_ADEQUATE: { rating: 'BBB', maxCreditLimit: 100000.00, allowedPaymentTermsDays: 30 },
  BB_SPECULATIVE: { rating: 'BB', maxCreditLimit: 25000.00, allowedPaymentTermsDays: 15 },
  C_HIGH_RISK: { rating: 'C', maxCreditLimit: 0.00, allowedPaymentTermsDays: 0 }
};

export const SalesSchemaDefinitions = {
  LeadSchema: {
    leadId: { type: 'string', primaryKey: true },
    companyName: { type: 'string', required: true },
    contactFirstName: { type: 'string', required: true },
    contactLastName: { type: 'string', required: true },
    contactEmail: { type: 'string', required: true },
    contactPhone: { type: 'string' },
    source: { type: 'enum', values: Object.values(CRM_LEAD_SOURCES), default: CRM_LEAD_SOURCES.WEBSITE_INBOUND },
    estimatedAnnualBudgetUSD: { type: 'number', default: 0 },
    leadScore: { type: 'number', default: 50 }
  },

  OpportunitySchema: {
    opportunityId: { type: 'string', primaryKey: true },
    leadId: { type: 'string', required: true },
    assignedSalesRepId: { type: 'string', required: true },
    stageId: { type: 'string', required: true },
    projectedDealValueUSD: { type: 'number', required: true },
    weightedPipelineValueUSD: { type: 'number', required: true },
    targetCloseDate: { type: 'date', required: true }
  }
};
