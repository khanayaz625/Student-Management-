import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Bell, Sun, Moon, Menu, X, CheckSquare, MessageSquare, ChevronDown } from 'lucide-react';
import axios from 'axios';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, toggleSidebar, isSidebarOpen } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications`);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications');
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Error marking as read');
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/notifications/read-all`);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <nav className="navbar animate-fade">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={toggleSidebar}>
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="navbar-brand">
          <span className="logo-text">DigiSkill<span className="logo-dot">.</span></span>
        </div>
      </div>

      <div className="navbar-actions">
        <div className="action-pill">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <div className="divider"></div>

          <div className="notification-wrapper">
            <button className="notif-btn" onClick={() => setShowNotif(!showNotif)}>
              <Bell size={18} />
              {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
            </button>

            {showNotif && (
              <div className="glass notification-dropdown animate-fade">
                <div className="notif-header">
                  <h3>Notifications</h3>
                  <button className="mark-all-btn" onClick={markAllRead}>Clear all</button>
                </div>
                <div className="notif-list">
                  {notifications.length === 0 ? (
                    <div className="empty-notif">You're all caught up!</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n._id}
                        className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                        onClick={() => markAsRead(n._id)}
                      >
                        <div className="notif-icon">
                          {n.type === 'task' ? <CheckSquare size={14} /> : <MessageSquare size={14} />}
                        </div>
                        <div className="notif-content">
                          <div className="notif-title">{n.title}</div>
                          <div className="notif-msg">{n.message}</div>
                          <div className="notif-time">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        {!n.isRead && <div className="unread-dot"></div>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="user-profile-menu">
          <div className="user-avatar-box">
            {user?.name?.charAt(0)}
          </div>
          <div className="user-details hide-mobile">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          <button className="logout-btn-nav" onClick={logout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          height: 72px;
          background: var(--bg-card);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }

        .navbar-left { display: flex; align-items: center; gap: 1.5rem; }
        .menu-toggle { background: var(--bg-main); color: var(--text-main); padding: 10px; border-radius: 12px; transition: 0.2s; border: none; }
        .menu-toggle:hover { background: var(--border); }
        
        .navbar-brand { cursor: default; }
        .logo-text { font-family: 'Outfit', sans-serif; font-size: 1.4rem; font-weight: 800; color: var(--text-main); }
        .logo-dot { color: var(--primary); }

        .navbar-actions { display: flex; align-items: center; gap: 1rem; }
        
        .action-pill { 
            display: flex; 
            align-items: center; 
            background: var(--bg-main); 
            border-radius: 50px; 
            padding: 4px;
            border: none;
        }
        
        .divider { width: 1px; height: 16px; background: var(--border); margin: 0 4px; }
        
        .theme-toggle, .notif-btn { 
            background: none; 
            color: var(--text-muted); 
            padding: 8px 12px; 
            border-radius: 50px; 
            transition: 0.2s;
            position: relative;
            border: none;
        }
        .theme-toggle:hover, .notif-btn:hover { color: var(--primary); background: var(--bg-card); }

        .unread-badge {
          position: absolute;
          top: 6px;
          right: 8px;
          background: var(--danger);
          color: white;
          font-size: 0.6rem;
          min-width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          border: 2px solid var(--bg-main);
        }

        .notification-dropdown {
          position: absolute;
          top: calc(100% + 15px);
          right: 0;
          width: 340px;
          max-height: 480px;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          padding: 0;
          z-index: 1001;
          border: 1px solid var(--border);
        }

        .notif-header { padding: 16px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .notif-header h3 { font-size: 1rem; margin: 0; }
        .mark-all-btn { font-size: 0.8rem; color: var(--primary); font-weight: 600; background: none; }
        
        .notif-list { padding: 8px 0; }
        .notif-item { padding: 12px 16px; display: flex; gap: 12px; cursor: pointer; transition: 0.2s; position: relative; }
        .notif-item:hover { background: rgba(99, 102, 241, 0.05); }
        .notif-item.unread { background: rgba(99, 102, 241, 0.03); }
        
        .notif-icon { width: 32px; height: 32px; background: var(--bg-main); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .notif-content { flex: 1; }
        .notif-title { font-size: 0.85rem; font-weight: 700; margin-bottom: 2px; }
        .notif-msg { font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; }
        .notif-time { font-size: 0.7rem; color: var(--text-muted); margin-top: 4px; }
        .unread-dot { width: 6px; height: 6px; background: var(--primary); border-radius: 50%; position: absolute; top: 20px; right: 16px; }

        .user-profile-menu { display: flex; align-items: center; gap: 12px; padding-left: 10px; }
        .user-avatar-box { width: 40px; height: 40px; background: linear-gradient(135deg, var(--primary), #4f46e5); color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.1rem; box-shadow: 0 4px 12px var(--primary-glow); }
        .user-details { display: flex; flex-direction: column; }
        .user-name { font-size: 0.9rem; font-weight: 700; color: var(--text-main); line-height: 1.1; }
        .user-role { font-size: 0.75rem; color: var(--text-muted); text-transform: capitalize; }
        
        .logout-btn-nav { background: var(--bg-main); color: var(--danger); padding: 8px; border-radius: 10px; transition: 0.2s; }
        .logout-btn-nav:hover { background: rgba(239, 68, 68, 0.1); }

        @media (max-width: 768px) {
          .navbar { height: 64px; padding: 0 1rem; }
          .hide-mobile { display: none; }
          .notification-dropdown { width: calc(100vw - 32px); right: -60px; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
