import { WS_BASE_URL } from './axiosClient';

// Opens a WebSocket that reconnects automatically every 3 seconds.
// Messages are expected to be JSON.
export function openSocket(path, { onMessage, onStatus } = {}) {
  let ws;
  let closed = false;
  let timer;

  const connect = () => {
    ws = new WebSocket(`${WS_BASE_URL}${path}`);
    ws.onopen = () => onStatus?.(true);
    ws.onmessage = (event) => {
      try {
        onMessage?.(JSON.parse(event.data));
      } catch {
        /* ignore non-JSON messages */
      }
    };
    ws.onclose = () => {
      onStatus?.(false);
      if (!closed) timer = setTimeout(connect, 3000);
    };
    ws.onerror = () => ws.close();
  };

  connect();

  return {
    close() {
      closed = true;
      clearTimeout(timer);
      if (ws) ws.close();
    },
  };
}
