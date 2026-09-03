/**
 * ApexERP Multi-Currency FX Engine & Conversion Matrix
 */
export const EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.25,
  JPY: 154.60,
  CAD: 1.36
};

export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  const fromRate = EXCHANGE_RATES[fromCurrency] || 1.0;
  const toRate = EXCHANGE_RATES[toCurrency] || 1.0;
  const inUSD = amount / fromRate;
  const converted = inUSD * toRate;
  return Number(converted.toFixed(2));
};

export const calculateFXGainLoss = (bookAmount, settlementAmount, bookRate, settlementRate) => {
  const originalUSD = bookAmount / bookRate;
  const settledUSD = settlementAmount / settlementRate;
  const differenceUSD = settledUSD - originalUSD;
  return {
    gainLossUSD: Number(differenceUSD.toFixed(2)),
    isGain: differenceUSD >= 0
  };
};
