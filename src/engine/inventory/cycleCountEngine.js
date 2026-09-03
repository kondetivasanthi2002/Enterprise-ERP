/**
 * ApexERP Enterprise SCM - ABC Inventory Categorization & Perpetual Cycle Count Engine
 * Classifies inventory items by annual dollar usage (Class A: 80% value, Class B: 15%, Class C: 5%).
 * Reconciles inventory count discrepancies and generates adjustment journal entries.
 */

export class CycleCountEngine {
  constructor() {
    this.catalogItems = [];
  }

  registerItem({ skuId, name, annualUnitUsage, unitCostUSD, physicalCount = 0, systemQtyOnRecord = 0 }) {
    const item = {
      skuId: String(skuId).trim().toUpperCase(),
      name: String(name).trim(),
      annualUnitUsage: Math.max(0, parseInt(annualUnitUsage || 0, 10)),
      unitCostUSD: Number(unitCostUSD || 0),
      physicalCount: parseInt(physicalCount || 0, 10),
      systemQtyOnRecord: parseInt(systemQtyOnRecord || 0, 10),
      annualDollarUsageUSD: 0,
      abcClass: 'C'
    };

    item.annualDollarUsageUSD = item.annualUnitUsage * item.unitCostUSD;
    this.catalogItems.push(item);
    return item;
  }

  performABCAnalysis() {
    if (this.catalogItems.length === 0) return [];

    // Sort descending by annual dollar usage
    this.catalogItems.sort((a, b) => b.annualDollarUsageUSD - a.annualDollarUsageUSD);
    const totalUsageUSD = this.catalogItems.reduce((sum, item) => sum + item.annualDollarUsageUSD, 0);

    let cumulativeUSD = 0;
    this.catalogItems.forEach(item => {
      const prevPercent = totalUsageUSD > 0 ? (cumulativeUSD / totalUsageUSD) * 100 : 0;
      cumulativeUSD += item.annualDollarUsageUSD;

      if (prevPercent < 80) {
        item.abcClass = 'A';
      } else if (prevPercent < 95) {
        item.abcClass = 'B';
      } else {
        item.abcClass = 'C';
      }
    });

    return this.catalogItems;
  }

  reconcileCycleCountDiscrepancy(skuId) {
    const item = this.catalogItems.find(i => i.skuId === String(skuId).trim().toUpperCase());
    if (!item) throw new Error(`Item '${skuId}' not found in catalog.`);

    const varianceUnits = item.physicalCount - item.systemQtyOnRecord;
    const varianceValueUSD = Number((varianceUnits * item.unitCostUSD).toFixed(2));

    return {
      skuId: item.skuId,
      name: item.name,
      abcClass: item.abcClass,
      systemQtyOnRecord: item.systemQtyOnRecord,
      physicalCount: item.physicalCount,
      varianceUnits,
      varianceValueUSD,
      requiresAdjustment: varianceUnits !== 0
    };
  }

  exportCycleCountReportText() {
    this.performABCAnalysis();
    const lines = [
      '==================================================',
      'APEX ENTERPRISE SCM - ABC INVENTORY CYCLE COUNT REPORT',
      '==================================================',
      'SKU ID | NAME | CLASS | PHYSICAL | RECORD | VARIANCE VALUE'
    ];

    this.catalogItems.forEach(item => {
      const recon = this.reconcileCycleCountDiscrepancy(item.skuId);
      lines.push(`${item.skuId.padEnd(8, ' ')} | ${item.name.padEnd(20, ' ')} | [${item.abcClass}] | ${item.physicalCount.toString().padStart(6, ' ')} | ${item.systemQtyOnRecord.toString().padStart(6, ' ')} | $${recon.varianceValueUSD.toLocaleString()}`);
    });

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalCycleCountEngine = new CycleCountEngine();
