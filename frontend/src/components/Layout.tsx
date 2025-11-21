'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';


interface LayoutProps {
  children: React.ReactNode;
  role: 'admin' | 'user';
}

export const Layout: React.FC<LayoutProps> = ({ children, role }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => {
    return pathname === path ? 'active' : '';
  };

  const adminMenu = [
    { path: '/admin', icon: 'fas fa-home', label: 'Dashboard' },
    { path: '/admin/users', icon: 'fas fa-users', label: 'Tài khoản' },
    { path: '/admin/teams', icon: 'fas fa-user-friends', label: 'Teams' },
    { path: '/admin/statistics', icon: 'fas fa-chart-bar', label: 'Thống kê' },
    { path: '/admin/points', icon: 'fas fa-cog', label: 'Cấu hình Điểm' },
  ];

  const userMenu = [
    { path: '/user', icon: 'fas fa-plus', label: 'Nhập dữ liệu' },
  ];

  const menu = role === 'admin' ? adminMenu : userMenu;

  return (
    <div className="layout">
      <header className="header">
        <div className="header-left">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="logo">IUBA System</h1>
        </div>
        <div className="header-right">
          <span className="user-info">
            <i className="fas fa-user"></i> {user?.fullName || user?.username}
          </span>
          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Đăng xuất
          </button>
        </div>
      </header>

      <div className="layout-body">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            {menu.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-item ${isActive(item.path)}`}
                onClick={() => setSidebarOpen(false)}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="main-content">
          {children}
        </main>
      </div>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}
    </div>
  );
};
