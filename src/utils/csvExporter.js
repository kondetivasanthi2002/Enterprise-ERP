/**
 * ApexERP Enterprise Suite - Reusable & Sanitized CSV Export Utility
 * Dynamic array joining (.join('\n')) and .trim() sanitization with ZERO empty whitespace padding lines.
 */

export const generateCSVContent = (headers = [], rows = []) => {
  const sanitizedHeaders = headers.map(h => `"${String(h).replace(/"/g, '""').trim()}"`).join(',');
  
  const sanitizedRows = rows.map(row => {
    return row.map(val => {
      if (val === null || val === undefined) return '""';
      const cleanStr = String(val).trim().replace(/"/g, '""');
      return `"${cleanStr}"`;
    }).join(',');
  });

  const lines = [sanitizedHeaders, ...sanitizedRows];
  return lines.join('\n').trim();
};

export const exportToCSV = (filename, headers, rows) => {
  const csvContent = generateCSVContent(headers, rows);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.replace(/\s+/g, '_')}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

