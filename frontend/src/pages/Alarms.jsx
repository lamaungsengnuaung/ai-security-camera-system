import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import StatusBadge from '../components/common/StatusBadge';
import DataState, { EmptyState } from '../components/common/DataState';
import useFetch from '../hooks/useFetch';
import useAlarmSocket from '../hooks/useAlarmSocket';
import { getAlarms, acknowledgeAlarm } from '../api/alarmService';
import { formatDateTime } from '../utils/format';

export default function Alarms() {
  const { data, setData, loading, error, reload } = useFetch(getAlarms);
  const [tab, setTab] = useState('active');
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState(null);

  const { connected } = useAlarmSocket((alarm) =>
    setData((prev) => [alarm, ...(prev || []).filter((a) => a.id !== alarm.id)])
  );

  const alarms = [...(data || [])].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  const active = alarms.filter((a) => !a.acknowledged);
  const history = alarms.filter((a) => a.acknowledged);
  const rows = tab === 'active' ? active : history;

  const handleAcknowledge = async (id) => {
    setBusyId(id);
    setActionError(null);
    try {
      const updated = await acknowledgeAlarm(id);
      setData((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Alarm Management"
        subtitle={connected ? '🟢 Receiving live alarms' : 'Review and acknowledge alarms'}
        actions={
          <button className="btn" onClick={reload}>
            ↻ Refresh
          </button>
        }
      />

      <div className="tabs">
        <button className={`tab ${tab === 'active' ? 'tab--active' : ''}`} onClick={() => setTab('active')}>
          Active alarms <span className="count">{active.length}</span>
        </button>
        <button className={`tab ${tab === 'history' ? 'tab--active' : ''}`} onClick={() => setTab('history')}>
          Alarm history <span className="count">{history.length}</span>
        </button>
      </div>

      {actionError && <div className="alert">⚠️ {actionError}</div>}

      <DataState loading={loading} error={error} onRetry={reload}>
        <section className="card table-wrap">
          {rows.length === 0 ? (
            <EmptyState message={tab === 'active' ? 'No active alarms 🎉' : 'No alarm history yet'} />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Severity</th>
                  <th>Camera</th>
                  <th>Message</th>
                  <th>Time</th>
                  <th>{tab === 'active' ? 'Action' : 'Acknowledged'}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <StatusBadge variant={a.severity}>{a.severity}</StatusBadge>
                    </td>
                    <td>{a.cameraName}</td>
                    <td>{a.message}</td>
                    <td>{formatDateTime(a.timestamp)}</td>
                    <td>
                      {tab === 'active' ? (
                        <button
                          className="btn btn--primary btn--sm"
                          disabled={busyId === a.id}
                          onClick={() => handleAcknowledge(a.id)}
                        >
                          {busyId === a.id ? 'Saving…' : 'Acknowledge'}
                        </button>
                      ) : (
                        formatDateTime(a.acknowledgedAt)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </DataState>
    </>
  );
}
