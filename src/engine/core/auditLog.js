/**
 * ApexERP Enterprise Core - Audit Logging & Event Tracking Engine
 */

export class AuditLogEngine {
  constructor() {
    this.logs = [];
  }

  logEvent({ user, action, entity, entityId, previousState = null, newState = null, ipAddress = '127.0.0.1' }) {
    const entry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
      userId: user ? user.id : 'system',
      userName: user ? user.name : 'System Engine',
      userRole: user ? user.role : 'SYSTEM',
      action,
      entity,
      entityId,
      changes: this.computeDiff(previousState, newState),
      ipAddress
    };

    this.logs.unshift(entry);
    return entry;
  }

  computeDiff(prev, current) {
    if (!prev || !current) return { previousState: prev, newState: current };
    const diff = {};
    const keys = new Set([...Object.keys(prev), ...Object.keys(current)]);
    for (const key of keys) {
      if (JSON.stringify(prev[key]) !== JSON.stringify(current[key])) {
        diff[key] = { from: prev[key], to: current[key] };
      }
    }
    return diff;
  }

  queryLogs({ entity, userId, action, startDate, endDate, limit = 50 }) {
    return this.logs.filter(log => {
      if (entity && log.entity !== entity) return false;
      if (userId && log.userId !== userId) return false;
      if (action && log.action !== action) return false;
      if (startDate && new Date(log.timestamp) < new Date(startDate)) return false;
      if (endDate && new Date(log.timestamp) > new Date(endDate)) return false;
      return true;
    }).slice(0, limit);
  }
}

export const GlobalAuditLogger = new AuditLogEngine();
