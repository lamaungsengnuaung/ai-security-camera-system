import { useEffect, useState } from 'react';
import StatusBadge from '../common/StatusBadge';

// Live video display area.
// ASSUMPTION: the backend exposes the stream as an image-style stream URL
// (e.g. MJPEG), which an <img> tag can display. If the backend uses another
// format (HLS, WebRTC...), only this component needs to change.
export default function VideoPlayer({ camera }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [camera?.id, camera?.streamUrl]);

  if (!camera) {
    return <div className="video video--empty">Select a camera to start viewing</div>;
  }

  const online = camera.status === 'online';
  let content;

  if (!online) {
    content = <div className="video__message">📴 Camera is offline</div>;
  } else if (!camera.streamUrl) {
    content = <div className="video__message">🎥 No stream URL configured</div>;
  } else if (failed) {
    content = <div className="video__message">⚠️ Unable to load stream</div>;
  } else {
    content = (
      <img
        className="video__stream"
        src={camera.streamUrl}
        alt={`Live view: ${camera.name}`}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="video">
      <div className="video__screen">{content}</div>
      <div className="video__bar">
        <div>
          <strong>{camera.name}</strong>
          <small className="muted"> · 📍 {camera.location}</small>
        </div>
        <StatusBadge variant={online ? 'online' : 'offline'}>{online ? 'Online' : 'Offline'}</StatusBadge>
      </div>
    </div>
  );
}
