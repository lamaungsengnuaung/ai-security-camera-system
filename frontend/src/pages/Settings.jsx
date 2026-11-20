import { useEffect, useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import DataState from '../components/common/DataState';
import Toggle from '../components/common/Toggle';
import useFetch from '../hooks/useFetch';
import { getSettings, saveSettings } from '../api/settingsService';

export default function Settings() {
  const { data, loading, error, reload } = useFetch(getSettings);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'ok' | 'error', text }

  useEffect(() => {
    if (data) setForm(structuredClone(data));
  }, [data]);

  const setNight = (key, value) =>
    setForm((f) => ({ ...f, nightMode: { ...f.nightMode, [key]: value } }));
  const setNotify = (key, value) =>
    setForm((f) => ({ ...f, notifications: { ...f.notifications, [key]: value } }));
  const setCamera = (id, key, value) =>
    setForm((f) => ({
      ...f,
      cameras: f.cameras.map((c) => (c.id === id ? { ...c, [key]: value } : c)),
    }));

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await saveSettings(form);
      setMessage({ type: 'ok', text: 'Settings saved.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Night mode, notifications and camera configuration"
        actions={
          <button className="btn btn--primary" onClick={handleSave} disabled={saving || !form}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        }
      />

      {message && (
        <div className={message.type === 'ok' ? 'alert alert--ok' : 'alert'}>
          {message.type === 'ok' ? '✅' : '⚠️'} {message.text}
        </div>
      )}

      <DataState loading={loading} error={error} onRetry={reload}>
        {form && (
          <div className="stack">
            <section className="card">
              <div className="card__head">
                <h2>🌙 Night mode</h2>
              </div>
              <Toggle
                label="Enable night mode"
                description="Stricter monitoring during the hours below"
                checked={form.nightMode.enabled}
                onChange={(v) => setNight('enabled', v)}
              />
              <div className="form-row">
                <label>
                  Start time
                  <input
                    className="input"
                    type="time"
                    value={form.nightMode.startTime}
                    disabled={!form.nightMode.enabled}
                    onChange={(e) => setNight('startTime', e.target.value)}
                  />
                </label>
                <label>
                  End time
                  <input
                    className="input"
                    type="time"
                    value={form.nightMode.endTime}
                    disabled={!form.nightMode.enabled}
                    onChange={(e) => setNight('endTime', e.target.value)}
                  />
                </label>
              </div>
            </section>

            <section className="card">
              <div className="card__head">
                <h2>🔔 Notifications</h2>
              </div>
              <Toggle
                label="Email notifications"
                checked={form.notifications.email}
                onChange={(v) => setNotify('email', v)}
              />
              <Toggle
                label="Sound alerts"
                checked={form.notifications.sound}
                onChange={(v) => setNotify('sound', v)}
              />
              <Toggle
                label="Push notifications"
                checked={form.notifications.push}
                onChange={(v) => setNotify('push', v)}
              />
            </section>

            <section className="card">
              <div className="card__head">
                <h2>🎥 Camera configuration</h2>
              </div>
              {(form.cameras || []).map((cam) => (
                <div key={cam.id} className="camera-config">
                  <div className="camera-config__head">
                    <strong>Camera #{cam.id}</strong>
                    <Toggle
                      label="Enabled"
                      checked={cam.enabled}
                      onChange={(v) => setCamera(cam.id, 'enabled', v)}
                    />
                  </div>
                  <div className="form-row">
                    <label>
                      Name
                      <input
                        className="input"
                        value={cam.name}
                        onChange={(e) => setCamera(cam.id, 'name', e.target.value)}
                      />
                    </label>
                    <label>
                      Location
                      <input
                        className="input"
                        value={cam.location}
                        onChange={(e) => setCamera(cam.id, 'location', e.target.value)}
                      />
                    </label>
                    <label className="form-row__wide">
                      Stream URL
                      <input
                        className="input"
                        placeholder="http://…"
                        value={cam.streamUrl || ''}
                        onChange={(e) => setCamera(cam.id, 'streamUrl', e.target.value)}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}
      </DataState>
    </>
  );
}
