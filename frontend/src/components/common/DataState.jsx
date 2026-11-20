// Shows a spinner, an error with retry, or the children.
export default function DataState({ loading, error, onRetry, children }) {
  if (loading) {
    return (
      <div className="state">
        <div className="spinner" />
        <p className="muted">Loading…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="state state--error">
        <p>⚠️ {error}</p>
        {onRetry && (
          <button className="btn" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    );
  }
  return children;
}

export function EmptyState({ message }) {
  return <div className="state muted">{message}</div>;
}
