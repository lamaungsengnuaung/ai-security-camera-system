import { useTheme } from '../../context/ThemeContext';
import { USE_MOCK } from '../../api/axiosClient';

export default function Topbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="topbar">
      <button className="icon-btn topbar__menu" onClick={onMenuClick} aria-label="Toggle menu">
        ☰
      </button>
      <div className="topbar__spacer" />
      <span className={`mode-pill ${USE_MOCK ? 'mode-pill--mock' : 'mode-pill--live'}`}>
        {USE_MOCK ? 'Mock data' : 'Live API'}
      </span>
      <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle dark / light mode">
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </header>
  );
}
