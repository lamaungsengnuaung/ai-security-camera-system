import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      <div className="main">
        <Topbar onMenuClick={() => setMenuOpen((o) => !o)} />
        <main className="content">
          <Outlet />
        </main>
      </div>
      {menuOpen && <div className="backdrop" onClick={() => setMenuOpen(false)} />}
    </div>
  );
}
