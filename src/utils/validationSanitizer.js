/**
 * ApexERP Enterprise Suite - Reusable Data Validation & Input Sanitization Utility
 * Enforces zero empty/padded whitespace strings, strict email regex, currency formatting, and numeric bounds.
 */

export const sanitizeString = (input = '') => {
  if (input === null || input === undefined) return '';
  return String(input).replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
};

export const isValidEmail = (email = '') => {
  const cleanEmail = sanitizeString(email);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(cleanEmail);
};

export const parseStrictNumber = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback;
  const num = Number(value);
  return isNaN(num) ? fallback : num;
};

export const formatCurrencyUSD = (amount = 0) => {
  const cleanAmt = parseStrictNumber(amount, 0);
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cleanAmt);
};

export const stripEmptyLinesFromText = (text = '') => {
  const cleanText = String(text || '');
  return cleanText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
    .trim();
};
