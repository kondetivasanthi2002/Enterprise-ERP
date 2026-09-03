/**
 * ApexERP Document Template & Exporter Service
 */
export const generateDocumentTemplate = (docType, data = {}) => {
  const title = String(docType || 'DOCUMENT').toUpperCase().trim();
  const dateStr = new Date().toLocaleDateString();
  const entityName = String(data.entityName || 'N/A').trim();
  const docId = String(data.id || 'DOC-1001').trim();
  const totalAmount = Number(data.totalAmount || 0).toLocaleString();
  const status = String(data.status || 'DRAFT').trim();

  const lines = [
    '==================================================',
    `APEX ENTERPRISE ERP - ${title}`,
    `Document ID: ${docId} | Date: ${dateStr}`,
    '==================================================',
    `Customer / Vendor: ${entityName}`,
    `Total Amount: $${totalAmount}`,
    `Status: ${status}`,
    '=================================================='
  ];

  return lines.join('\n').trim();
};
