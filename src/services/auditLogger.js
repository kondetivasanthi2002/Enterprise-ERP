/**
 * ApexERP Enterprise Audit & Telemetry Logging Engine
 */
export const auditLogStore = [];

export const logAuditEvent = (action, user, module, details = {}) => {
  const entry = {
    id: `AUD-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    action,
    user: user || 'SYSTEM',
    module,
    details,
    ipAddress: '192.168.1.100'
  };
  auditLogStore.unshift(entry);
  if (auditLogStore.length > 500) {
    auditLogStore.pop();
  }
  return entry;
};

export const getAuditLogsByModule = (moduleName) => {
  return auditLogStore.filter(log => log.module === moduleName);
};
