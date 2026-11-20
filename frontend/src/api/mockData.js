// Mock JSON used when VITE_USE_MOCK=true.
// The shapes here are the JSON formats the UI expects from the backend.
// If the real backend uses different field names, adapt them in the
// service files (cameraService.js etc.), not in the UI components.

export const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const minutesAgo = (m) => new Date(Date.now() - m * 60000).toISOString();

export const mockCameras = [
  { id: 1, name: 'Front Gate', location: 'Main entrance', status: 'online', streamUrl: '', enabled: true },
  { id: 2, name: 'Parking Lot A', location: 'North parking', status: 'online', streamUrl: '', enabled: true },
  { id: 3, name: 'Lobby', location: 'Ground floor', status: 'online', streamUrl: '', enabled: true },
  { id: 4, name: 'Warehouse Door', location: 'Rear building', status: 'offline', streamUrl: '', enabled: true },
  { id: 5, name: 'Server Room', location: '2nd floor', status: 'online', streamUrl: '', enabled: true },
  { id: 6, name: 'Back Fence', location: 'East perimeter', status: 'offline', streamUrl: '', enabled: false },
];

export const mockAlarms = [
  { id: 101, cameraId: 1, cameraName: 'Front Gate', message: 'Human detected (night mode)', severity: 'high', timestamp: minutesAgo(4), acknowledged: false, acknowledgedAt: null },
  { id: 102, cameraId: 5, cameraName: 'Server Room', message: 'Human detected outside working hours', severity: 'high', timestamp: minutesAgo(22), acknowledged: false, acknowledgedAt: null },
  { id: 103, cameraId: 2, cameraName: 'Parking Lot A', message: 'Human detected', severity: 'medium', timestamp: minutesAgo(65), acknowledged: false, acknowledgedAt: null },
  { id: 104, cameraId: 3, cameraName: 'Lobby', message: 'Human detected', severity: 'low', timestamp: minutesAgo(300), acknowledged: true, acknowledgedAt: minutesAgo(290) },
  { id: 105, cameraId: 4, cameraName: 'Warehouse Door', message: 'Camera went offline', severity: 'medium', timestamp: minutesAgo(900), acknowledged: true, acknowledgedAt: minutesAgo(880) },
];

export const mockEvents = [
  { id: 1, type: 'human_detected', cameraId: 1, cameraName: 'Front Gate', timestamp: minutesAgo(4), confidence: 0.96 },
  { id: 2, type: 'human_detected', cameraId: 5, cameraName: 'Server Room', timestamp: minutesAgo(22), confidence: 0.91 },
  { id: 3, type: 'human_detected', cameraId: 2, cameraName: 'Parking Lot A', timestamp: minutesAgo(65), confidence: 0.88 },
  { id: 4, type: 'human_detected', cameraId: 3, cameraName: 'Lobby', timestamp: minutesAgo(120), confidence: 0.93 },
  { id: 5, type: 'human_detected', cameraId: 3, cameraName: 'Lobby', timestamp: minutesAgo(300), confidence: 0.85 },
  { id: 6, type: 'human_detected', cameraId: 1, cameraName: 'Front Gate', timestamp: minutesAgo(700), confidence: 0.79 },
  { id: 7, type: 'human_detected', cameraId: 2, cameraName: 'Parking Lot A', timestamp: minutesAgo(1500), confidence: 0.9 },
  { id: 8, type: 'human_detected', cameraId: 5, cameraName: 'Server Room', timestamp: minutesAgo(2900), confidence: 0.94 },
];

export const mockSettings = {
  nightMode: { enabled: true, startTime: '20:00', endTime: '06:00' },
  notifications: { email: true, sound: true, push: false },
};
