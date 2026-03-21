import { useEffect, useState, useCallback } from 'react';
import { socketApi } from '@/shared/api/socket';
import { PlaybackState } from './types';

export const useSync = () => {
  const [serverTimeOffset, setServerTimeOffset] = useState<number>(0);
  const [globalState, setGlobalState] = useState<PlaybackState | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // NTP-like time synchronization
  const syncTime = useCallback(() => {
    const start = Date.now();
    socketApi.send('sync-time', { clientTime: start });
  }, []);

  const getSynchronizedTime = useCallback(() => {
    return Date.now() + serverTimeOffset;
  }, [serverTimeOffset]);

  useEffect(() => {
    socketApi.connect();

    const checkConnection = setInterval(() => {
      setIsConnected(socketApi.socket?.readyState === WebSocket.OPEN);
    }, 1000);

    const handleSyncTimeResponse = (data: any) => {
      const end = Date.now();
      const roundTrip = end - data.clientTime;
      const estimatedServerTime = data.serverTime + roundTrip / 2;
      setServerTimeOffset(estimatedServerTime - end);
    };

    const handleStateUpdate = (data: any) => {
      if (data.state) {
        setGlobalState(data.state);
      }
    };

    socketApi.on('sync-time-response', handleSyncTimeResponse);
    socketApi.on('state-update', handleStateUpdate);

    // Initial sync
    setTimeout(() => syncTime(), 500);
    // Periodic sync every 10 seconds
    const syncInterval = setInterval(syncTime, 10000);

    return () => {
      clearInterval(checkConnection);
      clearInterval(syncInterval);
      socketApi.off('sync-time-response', handleSyncTimeResponse);
      socketApi.off('state-update', handleStateUpdate);
    };
  }, [syncTime]);

  // Actions
  const sendPlay = (currentTime: number) => socketApi.send('play', { currentTime });
  const sendPause = (currentTime: number) => socketApi.send('pause', { currentTime });
  const sendSeek = (currentTime: number) => socketApi.send('seek', { currentTime });

  return {
    isConnected,
    globalState,
    getSynchronizedTime,
    sendPlay,
    sendPause,
    sendSeek
  };
};