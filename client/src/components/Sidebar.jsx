import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ClipboardList, Trophy, UserCircle, Settings, Users, CalendarCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const { user } = useAuth();
  const { isSidebarOpen, closeSidebar } = useTheme();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/' },
    { name: 'Daily Tasks', icon: <ClipboardList size={18} />, path: '/tasks' },
    { name: 'Leaderboard', icon: <Trophy size={18} />, path: '/leaderboard' },
    { name: 'Profile', icon: <UserCircle size={18} />, path: '/profile' },
  ];

  if (user?.role === 'teacher') {
    menuItems.splice(3, 0, { name: 'Students', icon: <Users size={18} />, path: '/students' });
    menuItems.splice(4, 0, { name: 'Attendance', icon: <CalendarCheck size={18} />, path: '/attendance-admin' });
  }

  const handleMenuClick = () => {
    if (window.innerWidth < 1025) {
      closeSidebar();
    }
  };

  return (
    <>
      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
      <aside className={`sidebar-premium ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-scroll-box">
          <div className="sidebar-menu">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `menu-item-premium ${isActive ? 'active' : ''}`}
                onClick={handleMenuClick}
              >
                <span className="icon-wrap">{item.icon}</span>
                <span className="menu-label">{item.name}</span>
                {item.name === 'Daily Tasks' && <span className="new-dot"></span>}
              </NavLink>
            ))}
          </div>

        </div>

        <style jsx>{`
        .sidebar-premium {
          width: 280px;
          background: var(--bg-card);
          border-right: 1px solid var(--border);
          position: fixed;
          top: 72px;
          bottom: 0;
          left: 0;
          z-index: 900;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(-100%);
        }
        .sidebar-premium.open { transform: translateX(0); }
        
        .sidebar-scroll-box {
            height: 100%;
            padding: 24px 16px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .sidebar-menu { display: flex; flex-direction: column; gap: 8px; }
        
        .menu-item-premium {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          text-decoration: none;
          color: var(--text-muted);
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.95rem;
          transition: 0.2s;
          position: relative;
        }

        .icon-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: var(--bg-main);
            transition: 0.2s;
        }

        .menu-item-premium:hover {
          color: var(--primary);
          background: rgba(99, 102, 241, 0.05);
        }
        
        .menu-item-premium:hover .icon-wrap {
            background: rgba(99, 102, 241, 0.1);
        }

        .menu-item-premium.active {
          background: rgba(99, 102, 241, 0.08);
          color: var(--primary);
        }
        
        .menu-item-premium.active .icon-wrap {
            background: var(--primary);
            color: white;
            box-shadow: 0 4px 12px var(--primary-glow);
        }

        .new-dot {
            width: 6px;
            height: 6px;
            background: #ef4444;
            border-radius: 50%;
            position: absolute;
            right: 16px;
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(2, 6, 23, 0.6);
          z-index: 850;
          backdrop-filter: blur(4px);
        }

        @media (max-width: 1024px) {
          .sidebar-premium { 
            box-shadow: 20px 0 25px -5px rgba(0, 0, 0, 0.1);
            top: 64px;
          }
          .sidebar-overlay { display: block; }
        }

        @media (max-width: 768px) {
          .sidebar-premium { width: 260px; }
        }
      `}</style>
      </aside>
    </>
  );
};

export default Sidebar;
