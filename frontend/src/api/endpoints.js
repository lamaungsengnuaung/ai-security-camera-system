// ---------------------------------------------------------------------------
// SINGLE PLACE for every backend path.
//
// These paths are PLACEHOLDERS. Replace them with the endpoints you agreed
// with the Python/FastAPI developer. Nothing else in the app needs to change.
// ---------------------------------------------------------------------------
const ENDPOINTS = {
  cameras: '/cameras', // GET  -> array of cameras
  alarms: '/alarms', // GET  -> array of alarms
  acknowledgeAlarm: (id) => `/alarms/${id}/acknowledge`, // POST -> updated alarm
  events: '/events', // GET  -> array of human detection events
  settings: '/settings', // GET / PUT -> settings object
  wsAlarms: '/ws/alarms', // WebSocket -> live alarm messages
};

export default ENDPOINTS;
