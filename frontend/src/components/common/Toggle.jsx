export default function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="toggle-row">
      <span>
        <span className="toggle-row__label">{label}</span>
        {description && <small className="muted toggle-row__desc">{description}</small>}
      </span>
      <span className="switch">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="switch__track" />
      </span>
    </label>
  );
}
