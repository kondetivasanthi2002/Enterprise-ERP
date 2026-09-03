/**
 * ApexERP Enterprise Analytics - Financial Ratios & Health Scoring Engine
 * Computes Liquidity (Current, Quick), Solvency (Debt-to-Equity), Profitability (ROIC, Net Margin), and Altman Z-Score.
 */

export class FinancialRatioEngine {
  calculateRatios({ currentAssetsUSD, currentLiabilitiesUSD, cashUSD, totalDebtUSD, totalEquityUSD, netIncomeUSD, totalRevenueUSD, EBITUSD, totalAssetsUSD, retainedEarningsUSD, marketCapUSD }) {
    const ca = Math.max(0, Number(currentAssetsUSD || 0));
    const cl = Math.max(1, Number(currentLiabilitiesUSD || 1));
    const cash = Math.max(0, Number(cashUSD || 0));

    const currentRatio = Number((ca / cl).toFixed(2));
    const quickRatio = Number(((cash + (ca * 0.4)) / cl).toFixed(2));

    const debt = Math.max(0, Number(totalDebtUSD || 0));
    const equity = Math.max(1, Number(totalEquityUSD || 1));
    const debtToEquity = Number((debt / equity).toFixed(2));

    const netInc = Number(netIncomeUSD || 0);
    const rev = Math.max(1, Number(totalRevenueUSD || 1));
    const netProfitMarginPercent = Number(((netInc / rev) * 100).toFixed(1));

    // Altman Z-Score Financial Distress Predictor
    const assets = Math.max(1, Number(totalAssetsUSD || 1));
    const ebit = Number(EBITUSD || 0);
    const retained = Number(retainedEarningsUSD || 0);
    const mCap = Number(marketCapUSD || 0);

    const X1 = (ca - cl) / assets;
    const X2 = retained / assets;
    const X3 = ebit / assets;
    const X4 = mCap / Math.max(1, debt);
    const X5 = rev / assets;

    const altmanZScore = Number((1.2 * X1 + 1.4 * X2 + 3.3 * X3 + 0.6 * X4 + 0.99 * X5).toFixed(2));

    let distressStatus = 'SAFE_ZONE';
    if (altmanZScore < 1.81) {
      distressStatus = 'DISTRESS_ZONE';
    } else if (altmanZScore < 2.99) {
      distressStatus = 'GREY_ZONE';
    }

    return {
      currentRatio,
      quickRatio,
      debtToEquity,
      netProfitMarginPercent,
      altmanZScore,
      distressStatus
    };
  }

  exportFinancialRatiosText(metrics) {
    const r = this.calculateRatios(metrics);
    const lines = [
      '==================================================',
      'APEX ENTERPRISE BI - FINANCIAL RATIOS & Z-SCORE REPORT',
      '==================================================',
      `Current Liquidity Ratio: ${r.currentRatio} (${r.currentRatio >= 1.5 ? 'Healthy' : 'Low'})`,
      `Quick Ratio (Acid Test): ${r.quickRatio}`,
      `Debt-to-Equity Ratio:   ${r.debtToEquity}`,
      `Net Profit Margin:      ${r.netProfitMarginPercent}%`,
      '--------------------------------------------------',
      `Altman Z-Score:         ${r.altmanZScore}`,
      `Financial Solvency:     ${r.distressStatus === 'SAFE_ZONE' ? '✅ SAFE ZONE (LOW DISTRESS RISK)' : '🚨 ATTENTION REQUIRED'}`
    ];

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalFinancialRatioEngine = new FinancialRatioEngine();
