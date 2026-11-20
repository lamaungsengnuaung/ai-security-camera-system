import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import DataState, { EmptyState } from '../components/common/DataState';
import CameraCard from '../components/camera/CameraCard';
import VideoPlayer from '../components/camera/VideoPlayer';
import useFetch from '../hooks/useFetch';
import { getCameras } from '../api/cameraService';

export default function Cameras() {
  const { data, loading, error, reload } = useFetch(getCameras);
  const [selectedId, setSelectedId] = useState(null);

  const cameras = data || [];
  const selected = cameras.find((c) => c.id === selectedId) || cameras[0] || null;

  return (
    <>
      <PageHeader
        title="Camera Monitoring"
        subtitle="Live view, status and location of every camera"
        actions={
          <button className="btn" onClick={reload}>
            ↻ Refresh
          </button>
        }
      />
      <DataState loading={loading} error={error} onRetry={reload}>
        {cameras.length === 0 ? (
          <EmptyState message="No cameras found" />
        ) : (
          <div className="monitor">
            <VideoPlayer camera={selected} />
            <section className="card camera-list">
              <div className="card__head">
                <h2>Cameras ({cameras.length})</h2>
              </div>
              {cameras.map((cam) => (
                <CameraCard
                  key={cam.id}
                  camera={cam}
                  selected={selected?.id === cam.id}
                  onSelect={(c) => setSelectedId(c.id)}
                />
              ))}
            </section>
          </div>
        )}
      </DataState>
    </>
  );
}
