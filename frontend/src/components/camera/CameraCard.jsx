import StatusBadge from '../common/StatusBadge';

export default function CameraCard({ camera, selected, onSelect }) {
  const online = camera.status === 'online';

  return (
    <button
      className={`camera-item ${selected ? 'camera-item--selected' : ''}`}
      onClick={() => onSelect(camera)}
    >
      <div className="camera-item__info">
        <strong>{camera.name}</strong>
        <small className="muted">📍 {camera.location}</small>
      </div>
      <StatusBadge variant={online ? 'online' : 'offline'}>{online ? 'Online' : 'Offline'}</StatusBadge>
    </button>
  );
}
