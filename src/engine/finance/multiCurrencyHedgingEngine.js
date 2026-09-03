/**
 * ApexERP Enterprise Finance - Foreign Exchange Forward & Hedging Valuation Engine
 * Evaluates foreign exchange risk exposure, Mark-to-Market (MTM) valuations, and forward contract hedges.
 */

export class MultiCurrencyHedgingEngine {
  constructor() {
    this.forwardContractsMap = new Map();
  }

  createForwardContract({ contractId, pair = 'EUR/USD', notionalAmountForeign, agreedForwardRate, spotRateAtInception, expiryDate }) {
    const id = String(contractId || `HEDGE-${globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().substring(0, 8) : Math.random().toString(36).substring(2, 8)}`).trim();
    const notional = Math.max(0, Number(notionalAmountForeign || 0));

    const contract = {
      contractId: id,
      pair: String(pair).trim().toUpperCase(),
      notionalAmountForeign: notional,
      agreedForwardRate: Number(agreedForwardRate || 1.10),
      spotRateAtInception: Number(spotRateAtInception || 1.08),
      expiryDate: String(expiryDate || '2026-12-31').trim(),
      status: 'ACTIVE'
    };

    this.forwardContractsMap.set(id, contract);
    return contract;
  }

  evaluateMarkToMarket(contractId, currentSpotRate) {
    const contract = this.forwardContractsMap.get(contractId);
    if (!contract) throw new Error(`Forward contract '${contractId}' not found.`);

    const currSpot = Number(currentSpotRate || 0);
    const rateDiff = currSpot - contract.agreedForwardRate;
    const mtmGainLossUSD = Number((contract.notionalAmountForeign * rateDiff).toFixed(2));

    return {
      contractId: contract.contractId,
      pair: contract.pair,
      notionalForeign: contract.notionalAmountForeign,
      agreedForwardRate: contract.agreedForwardRate,
      currentSpotRate: currSpot,
      rateDifference: Number(rateDiff.toFixed(4)),
      mtmGainLossUSD,
      isGain: mtmGainLossUSD >= 0
    };
  }

  exportHedgingReportText(contractId, currentSpotRate) {
    const evalRes = this.evaluateMarkToMarket(contractId, currentSpotRate);
    const lines = [
      '==================================================',
      'APEX ENTERPRISE FINANCE - FX HEDGE MTM AUDIT REPORT',
      `Contract ID: ${evalRes.contractId} | Pair: ${evalRes.pair}`,
      '==================================================',
      `Notional Foreign Amount: ${evalRes.notionalForeign.toLocaleString()}`,
      `Agreed Forward Rate:   ${evalRes.agreedForwardRate}`,
      `Current Market Spot:    ${evalRes.currentSpotRate}`,
      '--------------------------------------------------',
      `UNREALIZED MTM POSITION: $${evalRes.mtmGainLossUSD.toLocaleString()} USD (${evalRes.isGain ? 'GAIN' : 'LOSS'})`
    ];

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalHedgingEngine = new MultiCurrencyHedgingEngine();
