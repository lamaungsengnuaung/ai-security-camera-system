import { useMemo, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import DataState, { EmptyState } from '../components/common/DataState';
import useFetch from '../hooks/useFetch';
import { getEvents } from '../api/eventService';
import { formatDateTime } from '../utils/format';

export default function Events() {
  const { data, loading, error, reload } = useFetch(getEvents);
  const [search, setSearch] = useState('');
  const [cameraId, setCameraId] = useState('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const events = data || [];

  const cameraOptions = useMemo(() => {
    const map = new Map();
    events.forEach((e) => map.set(String(e.cameraId), e.cameraName));
    return [...map.entries()];
  }, [events]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return events
      .filter((e) => {
        const t = new Date(e.timestamp).getTime();
        if (cameraId !== 'all' && String(e.cameraId) !== cameraId) return false;
        if (from && t < new Date(`${from}T00:00:00`).getTime()) return false;
        if (to && t > new Date(`${to}T23:59:59`).getTime()) return false;
        if (q && !`${e.cameraName} ${e.cameraId} ${e.type}`.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [events, search, cameraId, from, to]);

  const clearFilters = () => {
    setSearch('');
    setCameraId('all');
    setFrom('');
    setTo('');
  };

  return (
    <>
      <PageHeader
        title="Event History"
        subtitle="Human detection events"
        actions={
          <button className="btn" onClick={reload}>
            ↻ Refresh
          </button>
        }
      />

      <section className="card filters">
        <input
          className="input"
          type="search"
          placeholder="Search by camera name or ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input" value={cameraId} onChange={(e) => setCameraId(e.target.value)}>
          <option value="all">All cameras</option>
          {cameraOptions.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        <label className="filters__date">
          From <input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="filters__date">
          To <input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        <button className="btn" onClick={clearFilters}>
          Clear
        </button>
      </section>

      <DataState loading={loading} error={error} onRetry={reload}>
        <section className="card table-wrap">
          {filtered.length === 0 ? (
            <EmptyState message="No events match your filters" />
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Camera</th>
                  <th>Camera ID</th>
                  <th>Date &amp; time</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id}>
                    <td>👤 Human detected</td>
                    <td>{e.cameraName}</td>
                    <td>#{e.cameraId}</td>
                    <td>{formatDateTime(e.timestamp)}</td>
                    <td>{e.confidence != null ? `${Math.round(e.confidence * 100)}%` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
        <p className="muted small">
          Showing {filtered.length} of {events.length} events
        </p>
      </DataState>
    </>
  );
}
