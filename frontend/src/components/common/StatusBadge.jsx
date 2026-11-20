// variant: 'online' | 'offline' | 'high' | 'medium' | 'low' | 'ack' | 'active'
export default function StatusBadge({ variant, children }) {
  return (
    <span className={`badge badge--${variant}`}>
      <span className="badge__dot" />
      {children}
    </span>
  );
}
