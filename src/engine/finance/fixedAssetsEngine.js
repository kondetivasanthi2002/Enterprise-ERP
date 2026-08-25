/**
 * ApexERP Enterprise Finance - Fixed Assets & Depreciation Engine
 * Calculates Straight-Line, Double Declining Balance, and Sum-of-Years-Digits depreciation.
 */

import { DEPRECIATION_METHODS } from '../../models/financeSchemas.js';
import { GlobalAuditLogger } from '../core/auditLog.js';
import { GlobalEventBus } from '../core/eventBus.js';

export class FixedAssetsEngine {
  constructor(initialAssets = [], ledgerEngine = null) {
    this.assetsMap = new Map();
    this.ledgerEngine = ledgerEngine;

    initialAssets.forEach(a => {
      this.assetsMap.set(a.assetId, {
        ...a,
        accumulatedDepreciationUSD: a.accumulatedDepreciationUSD || 0,
        bookValueUSD: a.bookValueUSD || (a.acquisitionCostUSD - (a.accumulatedDepreciationUSD || 0))
      });
    });
  }

  getAsset(assetId) {
    const asset = this.assetsMap.get(assetId);
    if (!asset) throw new Error(`Fixed Asset with ID '${assetId}' not found.`);
    return asset;
  }

  getAllAssets() {
    return Array.from(this.assetsMap.values());
  }

  /**
   * Compute Annual Depreciation Amount based on Method
   */
  calculateAnnualDepreciation(assetId, yearIndex = 1) {
    const asset = this.getAsset(assetId);

    const cost = asset.acquisitionCostUSD;
    const salvage = asset.salvageValueUSD || 0;
    const life = asset.usefulLifeYears;
    const depreciableBase = cost - salvage;

    let annualDepreciation = 0;

    switch (asset.depreciationMethod) {
      case DEPRECIATION_METHODS.STRAIGHT_LINE:
        annualDepreciation = depreciableBase / life;
        break;

      case DEPRECIATION_METHODS.DOUBLE_DECLINING_BALANCE: {
        const rate = (2 / life);
        const currentBookValue = asset.bookValueUSD;
        annualDepreciation = Math.min(currentBookValue * rate, currentBookValue - salvage);
        break;
      }

      case DEPRECIATION_METHODS.SUM_OF_YEARS_DIGITS: {
        const sumOfYears = (life * (life + 1)) / 2;
        const remainingLife = life - (yearIndex - 1);
        annualDepreciation = depreciableBase * (remainingLife / sumOfYears);
        break;
      }

      default:
        annualDepreciation = depreciableBase / life;
    }

    return Number(Math.max(0, annualDepreciation).toFixed(2));
  }

  /**
   * Post Annual Depreciation Entry to General Ledger
   */
  postDepreciationForAsset(assetId, user = null) {
    const asset = this.getAsset(assetId);
    if (asset.bookValueUSD <= (asset.salvageValueUSD || 0)) {
      throw new Error(`Asset '${asset.assetName}' (${assetId}) is fully depreciated to salvage value.`);
    }

    const depreciationAmount = this.calculateAnnualDepreciation(assetId);

    asset.accumulatedDepreciationUSD = Number((asset.accumulatedDepreciationUSD + depreciationAmount).toFixed(2));
    asset.bookValueUSD = Number((asset.acquisitionCostUSD - asset.accumulatedDepreciationUSD).toFixed(2));

    if (this.ledgerEngine) {
      this.ledgerEngine.postJournalEntry({
        description: `Annual Depreciation Posting for Asset ${asset.assetName} (${assetId})`,
        lineItems: [
          { accountCode: '66000', description: 'Depreciation Expense', debit: depreciationAmount, credit: 0 },
          { accountCode: '16500', description: 'Accumulated Depreciation - Machinery', debit: 0, credit: depreciationAmount }
        ]
      }, user);
    }

    GlobalAuditLogger.logEvent({ user, action: 'POST_DEPRECIATION', entity: 'FixedAsset', entityId: assetId, newState: asset });
    GlobalEventBus.publish('ASSET_DEPRECIATED', { assetId, depreciationAmount, newBookValue: asset.bookValueUSD });

    return { asset, depreciationAmount };
  }

  /**
   * Generate Multi-Year Schedule Forecast
   */
  generateDepreciationSchedule(assetId) {
    const asset = this.getAsset(assetId);
    const schedule = [];

    let currentBookValue = asset.acquisitionCostUSD;
    let accumulated = 0;

    for (let yr = 1; yr <= asset.usefulLifeYears; yr++) {
      const depreciableBase = asset.acquisitionCostUSD - (asset.salvageValueUSD || 0);
      let expense = 0;

      if (asset.depreciationMethod === DEPRECIATION_METHODS.STRAIGHT_LINE) {
        expense = depreciableBase / asset.usefulLifeYears;
      } else if (asset.depreciationMethod === DEPRECIATION_METHODS.SUM_OF_YEARS_DIGITS) {
        const sumOfYears = (asset.usefulLifeYears * (asset.usefulLifeYears + 1)) / 2;
        const remainingLife = asset.usefulLifeYears - (yr - 1);
        expense = depreciableBase * (remainingLife / sumOfYears);
      } else {
        const rate = (2 / asset.usefulLifeYears);
        expense = Math.min(currentBookValue * rate, currentBookValue - (asset.salvageValueUSD || 0));
      }

      expense = Number(expense.toFixed(2));
      accumulated = Number((accumulated + expense).toFixed(2));
      currentBookValue = Number((asset.acquisitionCostUSD - accumulated).toFixed(2));

      schedule.push({
        year: yr,
        depreciationExpense: expense,
        accumulatedDepreciation: accumulated,
        endingBookValue: currentBookValue
      });
    }

    return schedule;
  }
}
