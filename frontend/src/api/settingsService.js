import client, { USE_MOCK } from './axiosClient';
import ENDPOINTS from './endpoints';
import { mockSettings, mockCameras, delay } from './mockData';

// Expected settings object:
// {
//   nightMode:     { enabled, startTime, endTime },
//   notifications: { email, sound, push },
//   cameras:       [{ id, name, location, streamUrl, enabled }]
// }
export async function getSettings() {
  if (USE_MOCK) {
    await delay();
    return structuredClone({ ...mockSettings, cameras: mockCameras });
  }
  const { data } = await client.get(ENDPOINTS.settings);
  return data;
}

export async function saveSettings(settings) {
  if (USE_MOCK) {
    await delay(500);
    Object.assign(mockSettings, {
      nightMode: settings.nightMode,
      notifications: settings.notifications,
    });
    settings.cameras?.forEach((c) => {
      const target = mockCameras.find((m) => m.id === c.id);
      if (target) Object.assign(target, c);
    });
    return structuredClone(settings);
  }
  const { data } = await client.put(ENDPOINTS.settings, settings);
  return data;
}
