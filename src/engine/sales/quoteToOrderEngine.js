/**
 * ApexERP Enterprise Sales - Quote-to-Order Conversion & Margin Guard Engine
 * Generates enterprise customer quotations, enforces minimum gross margin thresholds, and converts quotes to Sales Orders.
 */

export class QuoteToOrderEngine {
  constructor() {
    this.quotationsMap = new Map();
  }

  createQuotation({ quoteId, clientName, lineItems = [], minMarginPercentThreshold = 20.0 }) {
    const id = String(quoteId || `QUO-${globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().substring(0, 8).toUpperCase() : Math.random().toString(36).substring(2, 8).toUpperCase()}`).trim();

    let totalCostUSD = 0;
    let totalSellingPriceUSD = 0;

    const items = lineItems.map(item => {
      const qty = Math.max(1, parseInt(item.qty || 1, 10));
      const cost = Number(item.unitCostUSD || 0);
      const price = Number(item.unitPriceUSD || 0);

      totalCostUSD += cost * qty;
      totalSellingPriceUSD += price * qty;

      return {
        itemSku: String(item.sku || 'SKU-GENERIC').trim().toUpperCase(),
        description: String(item.description).trim(),
        qty,
        unitCostUSD: cost,
        unitPriceUSD: price,
        lineTotalUSD: Number((qty * price).toFixed(2))
      };
    });

    const grossProfitUSD = totalSellingPriceUSD - totalCostUSD;
    const grossMarginPercent = totalSellingPriceUSD > 0 ? Number(((grossProfitUSD / totalSellingPriceUSD) * 100).toFixed(1)) : 0;
    const isMarginApproved = grossMarginPercent >= minMarginPercentThreshold;

    const quote = {
      quoteId: id,
      clientName: String(clientName).trim(),
      createdDate: new Date().toISOString().split('T')[0],
      lineItems: items,
      totalCostUSD: Number(totalCostUSD.toFixed(2)),
      totalSellingPriceUSD: Number(totalSellingPriceUSD.toFixed(2)),
      grossProfitUSD: Number(grossProfitUSD.toFixed(2)),
      grossMarginPercent,
      isMarginApproved,
      status: isMarginApproved ? 'QUOTE_APPROVED' : 'MARGIN_APPROVAL_REQUIRED'
    };

    this.quotationsMap.set(id, quote);
    return quote;
  }

  convertQuoteToSalesOrder(quoteId) {
    const quote = this.quotationsMap.get(String(quoteId).trim().toUpperCase());
    if (!quote) throw new Error(`Quotation '${quoteId}' not found.`);

    if (!quote.isMarginApproved) {
      throw new Error(`Quotation '${quoteId}' cannot be converted: Gross Margin ${quote.grossMarginPercent}% is below minimum threshold.`);
    }

    quote.status = 'CONVERTED_TO_SALES_ORDER';

    const orderId = `SO-${globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID().substring(0, 8).toUpperCase() : Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return {
      salesOrderId: orderId,
      originalQuoteId: quote.quoteId,
      clientName: quote.clientName,
      totalOrderValueUSD: quote.totalSellingPriceUSD,
      orderStatus: 'BOOKED_TO_FULFILLMENT'
    };
  }

  exportQuotationSummaryText(quoteId) {
    const quote = this.quotationsMap.get(String(quoteId).trim().toUpperCase());
    if (!quote) return '';

    const lines = [
      '==================================================',
      'APEX ENTERPRISE SALES - QUOTATION AUDIT SLIP',
      `Quote ID: ${quote.quoteId} | Client: ${quote.clientName}`,
      '==================================================',
      'LINE ITEMS:'
    ];

    quote.lineItems.forEach(item => {
      lines.push(`  • [${item.itemSku}] ${item.description} - ${item.qty} units @ $${item.unitPriceUSD} = $${item.lineTotalUSD.toLocaleString()}`);
    });

    lines.push('--------------------------------------------------');
    lines.push(`Total Quotation Price: $${quote.totalSellingPriceUSD.toLocaleString()} USD`);
    lines.push(`Estimated Cost Basis:  $${quote.totalCostUSD.toLocaleString()} USD`);
    lines.push(`Gross Profit Margin:   ${quote.grossMarginPercent}% (${quote.isMarginApproved ? '✅ APPROVED' : '🚨 MARGIN WARNING'})`);
    lines.push(`Quotation Status:      ${quote.status}`);

    return lines.filter(line => line && line.trim().length > 0).join('\n').trim();
  }
}

export const GlobalQuoteToOrderEngine = new QuoteToOrderEngine();
