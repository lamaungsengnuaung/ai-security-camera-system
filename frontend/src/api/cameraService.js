import client, { USE_MOCK } from './axiosClient';
import ENDPOINTS from './endpoints';
import { mockCameras, delay } from './mockData';

// Expected response: array of { id, name, location, status, streamUrl, enabled }
export async function getCameras() {
  if (USE_MOCK) {
    await delay();
    return structuredClone(mockCameras);
  }
  const { data } = await client.get(ENDPOINTS.cameras);
  return data;
}
