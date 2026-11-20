import client, { USE_MOCK } from './axiosClient';
import ENDPOINTS from './endpoints';
import { mockAlarms, delay } from './mockData';

// Expected response: array of
// { id, cameraId, cameraName, message, severity, timestamp, acknowledged, acknowledgedAt }
export async function getAlarms() {
  if (USE_MOCK) {
    await delay();
    return structuredClone(mockAlarms);
  }
  const { data } = await client.get(ENDPOINTS.alarms);
  return data;
}

// Expected response: the updated alarm object
export async function acknowledgeAlarm(id) {
  if (USE_MOCK) {
    await delay(250);
    const alarm = mockAlarms.find((a) => a.id === id);
    if (alarm) {
      alarm.acknowledged = true;
      alarm.acknowledgedAt = new Date().toISOString();
    }
    return structuredClone(alarm);
  }
  const { data } = await client.post(ENDPOINTS.acknowledgeAlarm(id));
  return data;
}
