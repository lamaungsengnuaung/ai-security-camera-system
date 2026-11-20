// tone: 'neutral' | 'success' | 'danger' | 'warning'
export default function StatCard({ label, value, icon, tone = 'neutral' }) {
  return (
    <div className={`card stat-card stat-card--${tone}`}>
      <div className="stat-card__icon">{icon}</div>
      <div>
        <div className="stat-card__value">{value}</div>
        <div className="stat-card__label">{label}</div>
      </div>
    </div>
  );
}
