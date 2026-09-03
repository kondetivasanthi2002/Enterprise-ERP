/**
 * ApexERP Enterprise MRP II - Statistical Process Control (SPC) Quality Inspection Engine
 * Evaluates upper/lower control limits (UCL/LCL), sample variance, and pass/fail QA routing.
 */

export class QualityInspectionEngine {
  constructor() {
    this.inspectionsMap = new Map();
  }

  evaluateQualitySampleBatch({ lotId, productName, sampleMeasurements = [], targetNominal = 100.0, toleranceAllowed = 2.0 }) {
    const cleanLot = String(lotId).trim().toUpperCase();
    const nominal = Number(targetNominal || 100.0);
    const tol = Number(toleranceAllowed || 2.0);

    const ucl = nominal + tol;
    const lcl = nominal - tol;

    if (sampleMeasurements.length === 0) throw new Error('Inspection sample list cannot be empty.');

    const sampleCount = sampleMeasurements.length;
    const sum = sampleMeasurements.reduce((a, b) => a + Number(b), 0);
    const mean = Number((sum / sampleCount).toFixed(4));

    let outOfControlCount = 0;
    sampleMeasurements.forEach(val => {
      if (val > ucl || val < lcl) outOfControlCount++;
    });

    const isBatchPassed = outOfControlCount === 0;

    const result = {
      lotId: cleanLot,
      productName: String(productName).trim(),
      sampleCount,
      targetNominal: nominal,
      ucl,
      lcl,
      sampleMean: mean,
      outOfControlCount,
      isBatchPassed,
      actionStatus: isBatchPassed ? 'RELEASED_TO_FINISHED_GOODS' : 'QUARANTINED_FOR_REWORK'
    };

    this.inspectionsMap.set(cleanLot, result);
    return result;
  }

  exportQualityReportText(lotId) {
    const res = this.inspectionsMap.get(String(lotId).trim().toUpperCase());
    if (!res) return '';

    const lines = [
      '==================================================',
      'APEX ENTERPRISE MRP II - SPC QUALITY CONTROL SLIP',
      `Lot ID: ${res.lotId} | Product: ${res.productName}`,
      '==================================================',
      `Target Nominal Value: ${res.targetNominal} (UCL: ${res.ucl} | LCL: ${res.lcl})`,
      `Sample Mean Measured: ${res.sampleMean} (${res.sampleCount} Samples)`,
      `Out-of-Limit Defects: ${res.outOfControlCount}`,
      `Inspection Verdict:   ${res.isBatchPassed ? '✅ PASSED QUALITY CONTROL' : '❌ FAILED - QUARANTINED'}`,
      `Routing Action:      ${res.actionStatus}`
    ];

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalQualityInspectionEngine = new QualityInspectionEngine();
