import client, { USE_MOCK } from './axiosClient';
import ENDPOINTS from './endpoints';
import { mockEvents, delay } from './mockData';

// Expected response: array of
// { id, type, cameraId, cameraName, timestamp, confidence }
// Search / filtering is done in the Events page, so no query params are needed.
export async function getEvents() {
  if (USE_MOCK) {
    await delay();
    return structuredClone(mockEvents);
  }
  const { data } = await client.get(ENDPOINTS.events);
  return data;
}
