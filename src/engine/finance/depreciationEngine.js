/**
 * ApexERP Enterprise Finance - Advanced Fixed Assets Depreciation & Amortization Engine
 * Supports Straight-Line, Double Declining Balance (DDB), and Sum-of-Years'-Digits (SYD).
 */

export const DEPRECIATION_METHOD = {
  STRAIGHT_LINE: 'STRAIGHT_LINE',
  DOUBLE_DECLINING: 'DOUBLE_DECLINING',
  SUM_OF_YEARS_DIGITS: 'SUM_OF_YEARS_DIGITS'
};

export class DepreciationEngine {
  constructor(ledgerEngine = null) {
    this.assetsMap = new Map();
    this.ledgerEngine = ledgerEngine;
  }

  /**
   * Register a new fixed asset item
   */
  registerAsset({ assetId, assetName, category, costUSD, salvageValueUSD, usefulLifeYears, acquisitionDate, depreciationMethod = DEPRECIATION_METHOD.STRAIGHT_LINE }) {
    const id = String(assetId || `AST-${globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().substring(0, 8).toUpperCase() : Math.random().toString(36).substring(2, 8).toUpperCase()}`).trim();
    const cost = Number(costUSD || 0);
    const salvage = Number(salvageValueUSD || 0);
    const life = Math.max(1, parseInt(usefulLifeYears || 5, 10));

    const asset = {
      assetId: id,
      assetName: String(assetName).trim(),
      category: String(category || 'GENERAL_EQUIPMENT').trim(),
      costUSD: cost,
      salvageValueUSD: salvage,
      usefulLifeYears: life,
      acquisitionDate: String(acquisitionDate || new Date().toISOString().split('T')[0]).trim(),
      depreciationMethod: String(depreciationMethod).toUpperCase(),
      accumulatedDepreciationUSD: 0,
      bookValueUSD: cost,
      isFullyDepreciated: false,
      schedule: []
    };

    asset.schedule = this.generateDepreciationSchedule(asset);
    this.assetsMap.set(id, asset);
    return asset;
  }

  /**
   * Calculate multi-year depreciation schedule table
   */
  generateDepreciationSchedule(asset) {
    const { costUSD, salvageValueUSD, usefulLifeYears, depreciationMethod } = asset;
    const schedule = [];
    let currentBookValue = costUSD;
    let totalDepreciated = 0;

    if (depreciationMethod === DEPRECIATION_METHOD.STRAIGHT_LINE) {
      const annualDepreciation = Number(((costUSD - salvageValueUSD) / usefulLifeYears).toFixed(2));
      for (let year = 1; year <= usefulLifeYears; year++) {
        const dep = year === usefulLifeYears ? Number((costUSD - salvageValueUSD - totalDepreciated).toFixed(2)) : annualDepreciation;
        totalDepreciated += dep;
        currentBookValue = Number((costUSD - totalDepreciated).toFixed(2));

        schedule.push({
          year,
          depreciationExpense: dep,
          accumulatedDepreciation: Number(totalDepreciated.toFixed(2)),
          endingBookValue: currentBookValue
        });
      }
    } else if (depreciationMethod === DEPRECIATION_METHOD.DOUBLE_DECLINING) {
      const rate = 2 / usefulLifeYears;
      for (let year = 1; year <= usefulLifeYears; year++) {
        let dep = Number((currentBookValue * rate).toFixed(2));
        if (currentBookValue - dep < salvageValueUSD || year === usefulLifeYears) {
          dep = Math.max(0, Number((currentBookValue - salvageValueUSD).toFixed(2)));
        }
        totalDepreciated += dep;
        currentBookValue = Number((costUSD - totalDepreciated).toFixed(2));

        schedule.push({
          year,
          depreciationExpense: dep,
          accumulatedDepreciation: Number(totalDepreciated.toFixed(2)),
          endingBookValue: currentBookValue
        });
      }
    } else if (depreciationMethod === DEPRECIATION_METHOD.SUM_OF_YEARS_DIGITS) {
      const sumOfYears = (usefulLifeYears * (usefulLifeYears + 1)) / 2;
      const depreciableBase = costUSD - salvageValueUSD;

      for (let year = 1; year <= usefulLifeYears; year++) {
        const remainingYears = usefulLifeYears - year + 1;
        const dep = Number(((remainingYears / sumOfYears) * depreciableBase).toFixed(2));
        totalDepreciated += dep;
        currentBookValue = Number((costUSD - totalDepreciated).toFixed(2));

        schedule.push({
          year,
          depreciationExpense: dep,
          accumulatedDepreciation: Number(totalDepreciated.toFixed(2)),
          endingBookValue: currentBookValue
        });
      }
    }

    return schedule;
  }

  /**
   * Post annual depreciation for a registered asset
   */
  postAnnualDepreciation(assetId, yearIndex = 1, user = null) {
    const asset = this.assetsMap.get(assetId);
    if (!asset) throw new Error(`Asset '${assetId}' not found in Fixed Assets Master.`);

    const periodEntry = asset.schedule.find(s => s.year === yearIndex);
    if (!periodEntry) throw new Error(`Year ${yearIndex} schedule not available for asset '${assetId}'.`);

    asset.accumulatedDepreciationUSD = periodEntry.accumulatedDepreciation;
    asset.bookValueUSD = periodEntry.endingBookValue;
    if (asset.bookValueUSD <= asset.salvageValueUSD) {
      asset.isFullyDepreciated = true;
    }

    if (this.ledgerEngine) {
      this.ledgerEngine.postJournalEntry({
        description: `Depreciation Expense - ${asset.assetName} (Year ${yearIndex})`,
        lineItems: [
          { accountCode: '65000', description: 'Depreciation Expense - Plant & Equipment', debit: periodEntry.depreciationExpense, credit: 0 },
          { accountCode: '15900', description: 'Accumulated Depreciation Liability', debit: 0, credit: periodEntry.depreciationExpense }
        ]
      }, user);
    }

    return { asset, postedYear: yearIndex, depreciationExpense: periodEntry.depreciationExpense };
  }

  /**
   * Export asset depreciation table text with zero empty padding lines
   */
  exportDepreciationScheduleText(assetId) {
    const asset = this.assetsMap.get(assetId);
    if (!asset) return '';

    const lines = [
      '==================================================',
      `APEX ENTERPRISE ERP - FIXED ASSET DEPRECIATION TABLE`,
      `Asset ID: ${asset.assetId} | Name: ${asset.assetName}`,
      `Cost: $${asset.costUSD.toLocaleString()} | Salvage: $${asset.salvageValueUSD.toLocaleString()}`,
      `Method: ${asset.depreciationMethod} | Useful Life: ${asset.usefulLifeYears} Years`,
      '==================================================',
      'YEAR | DEP EXPENSE | ACCUMULATED DEP | ENDING BOOK VALUE'
    ];

    asset.schedule.forEach(row => {
      lines.push(`Year ${row.year.toString().padStart(2, ' ')} | $${row.depreciationExpense.toLocaleString().padStart(11, ' ')} | $${row.accumulatedDepreciation.toLocaleString().padStart(15, ' ')} | $${row.endingBookValue.toLocaleString().padStart(17, ' ')}`);
    });

    lines.push('--------------------------------------------------');
    lines.push(`Current Book Value: $${asset.bookValueUSD.toLocaleString()} USD`);

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalDepreciationEngine = new DepreciationEngine();
