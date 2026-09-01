/**
 * ApexERP Enterprise Core - Event Bus & System Dispatcher
 */

export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  subscribe(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);

    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        this.listeners.set(eventType, callbacks.filter(cb => cb !== callback));
      }
    };
  }

  publish(eventType, payload) {
    const callbacks = this.listeners.get(eventType);
    if (callbacks && callbacks.length > 0) {
      callbacks.forEach(cb => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`[EVENT BUS ERROR] Failure executing listener for '${eventType}':`, err);
        }
      });
    }
  }

  clearAll() {
    this.listeners.clear();
  }
}

export const GlobalEventBus = new EventBus();
