import React, { createContext, useContext, useState, useEffect } from 'react';

export type ConnectivityStatus = 'ONLINE' | 'OFFLINE' | 'SYNCING' | 'SYNC_FAILED';

export interface SyncItem {
  id: string;
  type: 'SELF_ASSESSMENT' | 'WELLNESS_JOURNAL' | 'ALERT_ACK' | 'LAB_RECORD' | 'EXERCISE_LOG';
  payload: Record<string, unknown>;
  timestamp: string;
  retryCount: number;
}

interface OfflineSyncContextType {
  status: ConnectivityStatus;
  isOffline: boolean;
  lastSyncTime: string;
  pendingQueue: SyncItem[];
  enqueueSyncItem: (type: SyncItem['type'], payload: Record<string, unknown>) => void;
  triggerManualSync: () => Promise<void>;
  toggleOfflineSimulation: () => void;
  clearPendingQueue: () => void;
}

const OfflineSyncContext = createContext<OfflineSyncContextType | undefined>(undefined);

export const OfflineSyncProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<ConnectivityStatus>('ONLINE');
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return localStorage.getItem('astrocare_last_sync_time') || new Date().toISOString();
  });

  const [pendingQueue, setPendingQueue] = useState<SyncItem[]>(() => {
    try {
      const saved = localStorage.getItem('astrocare_pending_sync_queue');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('astrocare_pending_sync_queue', JSON.stringify(pendingQueue));
  }, [pendingQueue]);

  useEffect(() => {
    localStorage.setItem('astrocare_last_sync_time', lastSyncTime);
  }, [lastSyncTime]);

  const enqueueSyncItem = (type: SyncItem['type'], payload: Record<string, unknown>) => {
    const newItem: SyncItem = {
      id: `sync-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      payload,
      timestamp: new Date().toISOString(),
      retryCount: 0,
    };
    setPendingQueue((prev) => [newItem, ...prev]);
  };

  const triggerManualSync = async () => {
    if (status === 'OFFLINE') return;
    setStatus('SYNCING');

    // Simulate Deep Space Ka-band uplink negotiation
    await new Promise((resolve) => setTimeout(resolve, 1400));

    setPendingQueue([]);
    const now = new Date().toISOString();
    setLastSyncTime(now);
    setStatus('ONLINE');
  };

  const toggleOfflineSimulation = () => {
    setStatus((prev) => (prev === 'ONLINE' ? 'OFFLINE' : 'ONLINE'));
  };

  const clearPendingQueue = () => {
    setPendingQueue([]);
  };

  return (
    <OfflineSyncContext.Provider
      value={{
        status,
        isOffline: status === 'OFFLINE',
        lastSyncTime,
        pendingQueue,
        enqueueSyncItem,
        triggerManualSync,
        toggleOfflineSimulation,
        clearPendingQueue,
      }}
    >
      {children}
    </OfflineSyncContext.Provider>
  );
};

export const useOfflineSync = (): OfflineSyncContextType => {
  const ctx = useContext(OfflineSyncContext);
  if (!ctx) {
    throw new Error('useOfflineSync must be used within an OfflineSyncProvider');
  }
  return ctx;
};
