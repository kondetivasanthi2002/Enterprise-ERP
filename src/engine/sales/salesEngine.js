/**
 * ApexERP Enterprise Sales & CRM - Pipeline, Quotations, Invoicing, AR Engine
 */

import { INVOICE_STATUS } from '../../models/schemas.js';
import { GlobalTaxEngine } from '../finance/taxEngine.js';
import { GlobalAuditLogger } from '../core/auditLog.js';
import { GlobalEventBus } from '../core/eventBus.js';

export class SalesEngine {
  constructor(initialCustomers = [], initialInvoices = [], inventoryEngine = null, ledgerEngine = null) {
    this.customersMap = new Map();
    this.invoices = [];
    this.quotations = [];
    this.inventoryEngine = inventoryEngine;
    this.ledgerEngine = ledgerEngine;

    initialCustomers.forEach(c => this.customersMap.set(c.customerId, { ...c }));
    initialInvoices.forEach(inv => this.invoices.push({ ...inv }));
  }

  getCustomer(customerId) {
    const cust = this.customersMap.get(customerId);
    if (!cust) throw new Error(`Customer '${customerId}' not found in Customer Master.`);
    return cust;
  }

  getAllCustomers() {
    return Array.from(this.customersMap.values());
  }

  /**
   * Create Quotation
   */
  createQuotation({ customerId, lineItems = [], taxCode = 'VAT_STANDARD', validDays = 30, user = null }) {
    const customer = this.getCustomer(customerId);

    let subTotal = 0;
    const itemsProcessed = lineItems.map(item => {
      const lineNet = item.quantity * item.unitPrice;
      subTotal += lineNet;
      return {
        sku: item.sku,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalNet: Number(lineNet.toFixed(2))
      };
    });

    const taxCalculation = GlobalTaxEngine.calculateTax({
      netAmount: subTotal,
      taxCode,
      isCustomerExempt: customer.isTaxExempt
    });

    const quote = {
      quotationNumber: `QT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      customerId,
      customerName: customer.companyName,
      createdDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + validDays * 86400000).toISOString(),
      status: 'OPEN',
      lineItems: itemsProcessed,
      subTotal: Number(subTotal.toFixed(2)),
      taxAmount: taxCalculation.taxAmount,
      totalAmount: taxCalculation.grossAmount
    };

    this.quotations.unshift(quote);
    GlobalAuditLogger.logEvent({ user, action: 'CREATE_QUOTATION', entity: 'SalesQuotation', entityId: quote.quotationNumber, newState: quote });
    return quote;
  }

  /**
   * Post Sales Invoice -> Deducts Stock via InventoryEngine & Posts AR Ledger Entries via LedgerEngine
   */
  createInvoice({ customerId, lineItems = [], taxCode = 'VAT_STANDARD', paymentTermsDays = 30, user = null }) {
    const customer = this.getCustomer(customerId);

    let subTotal = 0;
    let totalCOGS = 0;
    const processedItems = [];

    // Deduct stock for each line item using InventoryEngine if available
    lineItems.forEach(line => {
      const lineNet = line.quantity * line.unitPrice;
      subTotal += lineNet;

      let lineCOGS = 0;
      if (this.inventoryEngine) {
        const issueResult = this.inventoryEngine.issueStock({
          sku: line.sku,
          quantity: line.quantity,
          movementType: 'OUTBOUND_SALES',
          reference: `Invoice for ${customer.companyName}`,
          user
        });
        lineCOGS = issueResult.totalCostOfGoodsSold;
      } else {
        lineCOGS = (line.quantity * (line.unitCost || line.unitPrice * 0.6));
      }

      totalCOGS += lineCOGS;

      processedItems.push({
        sku: line.sku,
        name: line.name,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        unitCost: Number((lineCOGS / line.quantity).toFixed(2)),
        totalNet: Number(lineNet.toFixed(2)),
        totalCOGS: Number(lineCOGS.toFixed(2))
      });
    });

    const taxCalculation = GlobalTaxEngine.calculateTax({
      netAmount: subTotal,
      taxCode,
      isCustomerExempt: customer.isTaxExempt
    });

    const invoice = {
      invoiceNumber: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      customerId,
      customerName: customer.companyName,
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + paymentTermsDays * 86400000).toISOString(),
      status: INVOICE_STATUS.SENT,
      lineItems: processedItems,
      subTotal: Number(subTotal.toFixed(2)),
      taxAmount: taxCalculation.taxAmount,
      totalAmount: taxCalculation.grossAmount,
      totalCOGS: Number(totalCOGS.toFixed(2)),
      paidAmount: 0,
      outstandingAmount: taxCalculation.grossAmount
    };

    customer.currentBalance = Number((customer.currentBalance + invoice.outstandingAmount).toFixed(2));
    this.invoices.unshift(invoice);

    // General Ledger Posting (Accounts Receivable, Revenue, Tax Payable, COGS, Stock)
    if (this.ledgerEngine) {
      this.ledgerEngine.postJournalEntry({
        description: `Sales Invoice ${invoice.invoiceNumber} - ${customer.companyName}`,
        lineItems: [
          { accountCode: '11000', description: 'Accounts Receivable', debit: invoice.totalAmount, credit: 0 },
          { accountCode: '40000', description: 'Sales Revenue', debit: 0, credit: invoice.subTotal },
          { accountCode: '22000', description: 'Sales Tax / VAT Payable', debit: 0, credit: invoice.taxAmount },
          { accountCode: '50000', description: 'Cost of Goods Sold', debit: invoice.totalCOGS, credit: 0 },
          { accountCode: '12000', description: 'Inventory Control', debit: 0, credit: invoice.totalCOGS }
        ]
      }, user);
    }

    GlobalAuditLogger.logEvent({ user, action: 'CREATE_SALES_INVOICE', entity: 'SalesInvoice', entityId: invoice.invoiceNumber, newState: invoice });
    GlobalEventBus.publish('SALES_INVOICE_CREATED', invoice);

    return invoice;
  }

  /**
   * Receive Payment for Customer Invoice
   */
  recordPayment({ invoiceNumber, paymentAmount, paymentMethod = 'BANK_TRANSFER', user = null }) {
    const inv = this.invoices.find(i => i.invoiceNumber === invoiceNumber);
    if (!inv) throw new Error(`Invoice '${invoiceNumber}' not found.`);

    if (paymentAmount <= 0) throw new Error('Payment amount must be greater than zero.');
    if (paymentAmount > inv.outstandingAmount) {
      throw new Error(`Payment amount ($${paymentAmount}) exceeds outstanding balance ($${inv.outstandingAmount}).`);
    }

    inv.paidAmount = Number((inv.paidAmount + paymentAmount).toFixed(2));
    inv.outstandingAmount = Number((inv.totalAmount - inv.paidAmount).toFixed(2));

    if (inv.outstandingAmount === 0) {
      inv.status = INVOICE_STATUS.PAID;
    } else {
      inv.status = INVOICE_STATUS.PARTIALLY_PAID;
    }

    const customer = this.getCustomer(inv.customerId);
    customer.currentBalance = Number((customer.currentBalance - paymentAmount).toFixed(2));

    if (this.ledgerEngine) {
      this.ledgerEngine.postJournalEntry({
        description: `Payment received for ${invoiceNumber} (${paymentMethod})`,
        lineItems: [
          { accountCode: '10000', description: 'Operating Cash & Bank', debit: paymentAmount, credit: 0 },
          { accountCode: '11000', description: 'Accounts Receivable', debit: 0, credit: paymentAmount }
        ]
      }, user);
    }

    GlobalAuditLogger.logEvent({ user, action: 'RECORD_CUSTOMER_PAYMENT', entity: 'SalesInvoice', entityId: invoiceNumber, newState: inv });
    return inv;
  }
}
