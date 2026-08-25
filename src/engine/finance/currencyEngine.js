/**
 * ApexERP Enterprise Finance - Multi-Currency & Foreign Exchange Translation Engine
 */

import { CURRENCY_CODES } from '../../models/financeSchemas.js';

export class CurrencyEngine {
  constructor(baseCurrency = 'USD', initialRates = []) {
    this.baseCurrency = baseCurrency;
    this.ratesMap = new Map();

    // Default Exchange Rates relative to base currency (USD)
    const defaults = [
      { pair: 'USD_USD', rate: 1.0 },
      { pair: 'USD_EUR', rate: 0.92 },
      { pair: 'USD_GBP', rate: 0.78 },
      { pair: 'USD_JPY', rate: 155.40 },
      { pair: 'USD_CAD', rate: 1.36 },
      { pair: 'USD_AUD', rate: 1.52 },
      { pair: 'USD_CHF', rate: 0.89 },
      { pair: 'USD_CNY', rate: 7.23 },
      { pair: 'USD_INR', rate: 83.45 }
    ];

    [...defaults, ...initialRates].forEach(r => this.ratesMap.set(r.pair, r.rate));
  }

  setExchangeRate(fromCurrency, toCurrency, rate) {
    if (rate <= 0) throw new Error('Exchange rate must be greater than zero.');
    const pair = `${fromCurrency}_${toCurrency}`;
    this.ratesMap.set(pair, rate);

    // Inverse pair
    const inversePair = `${toCurrency}_${fromCurrency}`;
    this.ratesMap.set(inversePair, Number((1 / rate).toFixed(6)));
  }

  getExchangeRate(fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return 1.0;
    const pair = `${fromCurrency}_${toCurrency}`;

    if (this.ratesMap.has(pair)) {
      return this.ratesMap.get(pair);
    }

    // Triangular arbitrage via USD base
    const fromToUSD = this.ratesMap.get(`${fromCurrency}_USD`) || (1 / (this.ratesMap.get(`USD_${fromCurrency}`) || 1));
    const usdToTarget = this.ratesMap.get(`USD_${toCurrency}`) || (1 / (this.ratesMap.get(`${toCurrency}_USD`) || 1));

    return Number((fromToUSD * usdToTarget).toFixed(6));
  }

  convertAmount(amount, fromCurrency, toCurrency) {
    const rate = this.getExchangeRate(fromCurrency, toCurrency);
    const converted = amount * rate;
    const decimals = CURRENCY_CODES[toCurrency] ? CURRENCY_CODES[toCurrency].decimalDigits : 2;
    return Number(converted.toFixed(decimals));
  }

  formatCurrency(amount, currencyCode = 'USD') {
    const meta = CURRENCY_CODES[currencyCode] || { symbol: '$', decimalDigits: 2 };
    return `${meta.symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: meta.decimalDigits, maximumFractionDigits: meta.decimalDigits })}`;
  }
}
