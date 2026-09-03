/**
 * ApexERP Enterprise Procurement - Vendor Performance & OTIF Scorecard Engine
 * Evaluates Vendor On-Time In-Full (OTIF) delivery, defect rate, and price competitiveness.
 */

export class VendorRatingEngine {
  constructor() {
    this.vendorRecordsMap = new Map();
  }

  recordVendorDelivery({ vendorId, vendorName, totalOrders, onTimeOrders, inFullOrders, defectiveUnits = 0, totalUnitsDelivered = 1 }) {
    const id = String(vendorId).trim().toUpperCase();
    const name = String(vendorName).trim();
    const orders = Math.max(1, parseInt(totalOrders || 1, 10));
    const onTime = Math.min(orders, Math.max(0, parseInt(onTimeOrders || 0, 10)));
    const inFull = Math.min(orders, Math.max(0, parseInt(inFullOrders || 0, 10)));

    const onTimeRate = (onTime / orders) * 100;
    const inFullRate = (inFull / orders) * 100;
    const otifScore = Number(((onTimeRate * 0.5) + (inFullRate * 0.5)).toFixed(1));

    const totalDelivered = Math.max(1, parseInt(totalUnitsDelivered || 1, 10));
    const defectRatePercent = Number(((defectiveUnits / totalDelivered) * 100).toFixed(2));

    let tier = 'PREFERRED_TIER1';
    if (otifScore < 75 || defectRatePercent > 5.0) {
      tier = 'PROBATIONARY_TIER3';
    } else if (otifScore < 90 || defectRatePercent > 2.0) {
      tier = 'STANDARD_TIER2';
    }

    const rating = {
      vendorId: id,
      vendorName: name,
      totalOrders: orders,
      otifScorePercent: otifScore,
      defectRatePercent,
      vendorTier: tier,
      isApprovedForCapEx: tier === 'PREFERRED_TIER1'
    };

    this.vendorRecordsMap.set(id, rating);
    return rating;
  }

  exportVendorScorecardText(vendorId) {
    const rating = this.vendorRecordsMap.get(String(vendorId).trim().toUpperCase());
    if (!rating) return '';

    const lines = [
      '==================================================',
      'APEX ENTERPRISE PROCUREMENT - VENDOR OTIF SCORECARD',
      `Vendor ID: ${rating.vendorId} | Name: ${rating.vendorName}`,
      '==================================================',
      `Evaluated Orders: ${rating.totalOrders}`,
      `OTIF Delivery Rate: ${rating.otifScorePercent}%`,
      `Quality Defect Rate: ${rating.defectRatePercent}%`,
      `Assigned Vendor Tier: ${rating.vendorTier}`,
      `CapEx Approval Status: ${rating.isApprovedForCapEx ? 'APPROVED' : 'RESTRICTED'}`
    ];

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalVendorRatingEngine = new VendorRatingEngine();
