import { describe, it, expect } from 'vitest';
import { MAX_BATCH_SIZE, generateInvoices, generateInventorySKUs, generateUUID } from '../src/services/mockDataGenerator.js';
import { generateDocumentTemplate } from '../src/services/pdfExporterService.js';
import { evaluatePOApproval } from '../src/services/poApprovalEngine.js';
import { generateCSVContent } from '../src/utils/csvExporter.js';

describe('Audit & Safety Verification Suite', () => {

  it('should enforce MAX_BATCH_SIZE safety limit on batch generation', () => {
    const hugeInvoiceRequest = generateInvoices(50000);
    expect(hugeInvoiceRequest.length).toBeLessThanOrEqual(MAX_BATCH_SIZE);
    expect(hugeInvoiceRequest.length).toBe(1000);

    const hugeSKURequest = generateInventorySKUs(10000);
    expect(hugeSKURequest.length).toBeLessThanOrEqual(MAX_BATCH_SIZE);
    expect(hugeSKURequest.length).toBe(1000);
  });

  it('should sanitize generated text strings and remove leading/trailing whitespace', () => {
    const invoices = generateInvoices(10);
    invoices.forEach(inv => {
      expect(inv.client).toBe(inv.client.trim());
      expect(inv.id).toBe(inv.id.trim());
      expect(inv.client.length).toBeGreaterThan(0);
    });

    const skus = generateInventorySKUs(10);
    skus.forEach(sku => {
      expect(sku.name).toBe(sku.name.trim());
      expect(sku.category).toBe(sku.category.trim());
      expect(sku.warehouse).toBe(sku.warehouse.trim());
    });
  });

  it('should generate document templates without excessive whitespace padding', () => {
    const doc = generateDocumentTemplate('INVOICE', {
      id: 'INV-100',
      entityName: 'Acme Global',
      totalAmount: 45000,
      status: 'APPROVED'
    });

    expect(doc).toContain('APEX ENTERPRISE ERP - INVOICE');
    expect(doc).not.toContain('\n\n\n\n');
    expect(doc.trim()).toBe(doc);
  });

  it('should process PO approvals deterministically without duplicate state mutation', () => {
    const evalResult1 = evaluatePOApproval(15000);
    const evalResult2 = evaluatePOApproval(15000);

    expect(evalResult1).toEqual(evalResult2);
    expect(evalResult1.requiredTier).toBe('VP of Supply Chain');
    expect(evalResult1.status).toBe('PENDING_APPROVAL');
  });

  it('should generate 100% unique UUID keys with zero duplicate collisions', () => {
    const uuids = new Set();
    for (let i = 0; i < 1000; i++) {
      const id = generateUUID();
      expect(uuids.has(id)).toBe(false);
      uuids.add(id);
    }
    expect(uuids.size).toBe(1000);
  });

  it('should generate CSV output using dynamic array joining with zero empty whitespace lines', () => {
    const headers = ['ID', 'Client Name', 'Amount'];
    const rows = [
      ['INV-1', '  Acme Corp  ', 5000],
      ['INV-2', 'Beta Logistics ', 8000]
    ];
    const csv = generateCSVContent(headers, rows);
    expect(csv).toContain('"ID","Client Name","Amount"');
    expect(csv).toContain('"INV-1","Acme Corp","5000"');
    expect(csv.trim()).toBe(csv);
    expect(csv).not.toContain('\n\n');
  });

});
