import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import DataState, { EmptyState } from '../components/common/DataState';
import useFetch from '../hooks/useFetch';
import useAlarmSocket from '../hooks/useAlarmSocket';
import { getCameras } from '../api/cameraService';
import { getAlarms } from '../api/alarmService';
import { getEvents } from '../api/eventService';
import { formatDateTime, timeAgo } from '../utils/format';

export default function Dashboard() {
  const cams = useFetch(getCameras);
  const alarms = useFetch(getAlarms);
  const events = useFetch(getEvents);

  // Live alarms pushed through the WebSocket appear immediately
  useAlarmSocket((alarm) =>
    alarms.setData((prev) => [alarm, ...(prev || []).filter((a) => a.id !== alarm.id)])
  );

  const loading = cams.loading || alarms.loading || events.loading;
  const error = cams.error || alarms.error || events.error;
  const reloadAll = () => {
    cams.reload();
    alarms.reload();
    events.reload();
  };

  const cameras = cams.data || [];
  const active = (alarms.data || []).filter((a) => !a.acknowledged);
  const recent = [...(events.data || [])]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 6);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of your security system" />
      <DataState loading={loading} error={error} onRetry={reloadAll}>
        <div className="grid grid--stats">
          <StatCard label="Total cameras" value={cameras.length} icon="🎥" />
          <StatCard
            label="Online cameras"
            value={cameras.filter((c) => c.status === 'online').length}
            icon="✅"
            tone="success"
          />
          <StatCard
            label="Offline cameras"
            value={cameras.filter((c) => c.status !== 'online').length}
            icon="📴"
            tone="warning"
          />
          <StatCard label="Active alarms" value={active.length} icon="🚨" tone="danger" />
        </div>

        <div className="grid grid--two">
          <section className="card">
            <div className="card__head">
              <h2>Active alarms</h2>
              <Link to="/alarms">View all</Link>
            </div>
            {active.length === 0 ? (
              <EmptyState message="No active alarms 🎉" />
            ) : (
              <ul className="list">
                {active.slice(0, 5).map((a) => (
                  <li key={a.id} className="list__row">
                    <div>
                      <strong>{a.cameraName}</strong>
                      <small className="muted block">{a.message}</small>
                    </div>
                    <div className="right">
                      <StatusBadge variant={a.severity}>{a.severity}</StatusBadge>
                      <small className="muted block">{timeAgo(a.timestamp)}</small>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="card">
            <div className="card__head">
              <h2>Recent events</h2>
              <Link to="/events">View all</Link>
            </div>
            {recent.length === 0 ? (
              <EmptyState message="No events yet" />
            ) : (
              <ul className="list">
                {recent.map((e) => (
                  <li key={e.id} className="list__row">
                    <div>
                      <strong>👤 Human detected</strong>
                      <small className="muted block">{e.cameraName}</small>
                    </div>
                    <small className="muted">{formatDateTime(e.timestamp)}</small>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </DataState>
    </>
  );
}
