/**
 * ApexERP Enterprise Sales CRM - Predictive Lead Scoring & Qualification Engine
 * Evaluates company revenue, headcount, tech stack, budget, and engagement signals.
 */

export const LEAD_TIERS = {
  HOT: 'HOT_ENTERPRISE_QUALIFIED',
  WARM: 'WARM_MID_MARKET',
  COLD: 'COLD_NURTURE'
};

export class LeadScoringEngine {
  constructor() {
    this.scoringRules = [
      { name: 'Revenue > $50M', condition: (l) => l.annualRevenueUSD >= 50000000, points: 25 },
      { name: 'Revenue > $10M', condition: (l) => l.annualRevenueUSD >= 10000000 && l.annualRevenueUSD < 50000000, points: 15 },
      { name: 'Headcount > 500 Staff', condition: (l) => l.employeeCount >= 500, points: 20 },
      { name: 'Headcount > 100 Staff', condition: (l) => l.employeeCount >= 100 && l.employeeCount < 500, points: 10 },
      { name: 'Budget Approved', condition: (l) => Boolean(l.isBudgetApproved), points: 20 },
      { name: 'Immediate Implementation (< 90 days)', condition: (l) => l.timeframeMonths <= 3, points: 15 },
      { name: 'C-Level Executive Contact', condition: (l) => String(l.contactTitle || '').toUpperCase().includes('CHIEF') || String(l.contactTitle || '').toUpperCase().includes('VP'), points: 10 },
      { name: 'Legacy ERP Replacement Signal', condition: (l) => Boolean(l.hasLegacyERP), points: 10 }
    ];
  }

  /**
   * Score a lead record and compute qualification score out of 100
   */
  evaluateLead({ companyName, contactName, contactTitle, annualRevenueUSD, employeeCount, isBudgetApproved, timeframeMonths, hasLegacyERP }) {
    const lead = {
      companyName: String(companyName).trim(),
      contactName: String(contactName).trim(),
      contactTitle: String(contactTitle || 'Decision Maker').trim(),
      annualRevenueUSD: Number(annualRevenueUSD || 0),
      employeeCount: parseInt(employeeCount || 0, 10),
      isBudgetApproved: Boolean(isBudgetApproved),
      timeframeMonths: parseInt(timeframeMonths || 6, 10),
      hasLegacyERP: Boolean(hasLegacyERP)
    };

    let score = 0;
    const triggeredRules = [];

    this.scoringRules.forEach(rule => {
      if (rule.condition(lead)) {
        score += rule.points;
        triggeredRules.push({ ruleName: rule.name, points: rule.points });
      }
    });

    const finalScore = Math.min(score, 100);
    let leadTier = LEAD_TIERS.COLD;
    let recommendedAction = 'Assign to Automated Marketing Nurture Sequence';

    if (finalScore >= 70) {
      leadTier = LEAD_TIERS.HOT;
      recommendedAction = 'Urgent: Assign to Strategic Enterprise Account Executive within 2 hours';
    } else if (finalScore >= 40) {
      leadTier = LEAD_TIERS.WARM;
      recommendedAction = 'Schedule SDR Discovery Call within 24 hours';
    }

    return {
      lead,
      qualificationScore: finalScore,
      leadTier,
      recommendedAction,
      triggeredRules
    };
  }

  /**
   * Export lead qualification audit summary text with zero trailing whitespace
   */
  exportLeadQualificationText(evaluationResult) {
    const res = evaluationResult;
    const lines = [
      '==================================================',
      'APEX ENTERPRISE CRM - LEAD QUALIFICATION SCORECARD',
      `Company: ${res.lead.companyName} | Contact: ${res.lead.contactName} (${res.lead.contactTitle})`,
      '==================================================',
      `Qualification Score: ${res.qualificationScore} / 100`,
      `Assigned Lead Tier:  ${res.leadTier}`,
      `Recommended Action:  ${res.recommendedAction}`,
      '--------------------------------------------------',
      'TRIGGERED SCORING CRITERIA:'
    ];

    res.triggeredRules.forEach(r => {
      lines.push(`  • [+$${r.points.toString().padStart(2, ' ')} pts] ${r.ruleName}`);
    });

    lines.push('--------------------------------------------------');
    lines.push('Status: Qualification evaluation locked and recorded');

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalLeadScorer = new LeadScoringEngine();
