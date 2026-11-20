import { useEffect, useRef, useState } from 'react';
import { USE_MOCK } from '../api/axiosClient';
import ENDPOINTS from '../api/endpoints';
import { openSocket } from '../api/websocket';

// Listens for live alarms.
// ASSUMED message format (adjust to match the backend):
//   { "type": "alarm", "data": { ...alarm object... } }
export default function useAlarmSocket(onAlarm) {
  const [connected, setConnected] = useState(false);
  const handler = useRef(onAlarm);
  handler.current = onAlarm;

  useEffect(() => {
    if (USE_MOCK) return undefined;
    const socket = openSocket(ENDPOINTS.wsAlarms, {
      onMessage: (msg) => {
        if (msg?.type === 'alarm' && msg.data) handler.current?.(msg.data);
      },
      onStatus: setConnected,
    });
    return () => socket.close();
  }, []);

  return { connected };
}
