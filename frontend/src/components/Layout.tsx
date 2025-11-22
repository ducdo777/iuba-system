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
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-6 h-16 bg-primary text-white shadow-md backdrop-blur-sm bg-opacity-95">
        <div className="flex items-center gap-4">
          <button
            className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle menu"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <h1 className="text-xl font-semibold">IUBA System</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:flex items-center gap-2 text-sm">
            <i className="fas fa-user"></i>
            {user?.fullName || user?.username}
          </span>
          <button
            className="px-4 py-2 text-sm rounded-md bg-white/20 hover:bg-white/30 transition-colors flex items-center gap-2"
            onClick={handleLogout}
          >
            <i className="fas fa-sign-out-alt"></i>
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:static top-16 md:top-0 left-0 h-[calc(100vh-4rem)] md:h-full
            w-64 bg-card border-r border-gray-200
            transform transition-transform duration-300 ease-in-out z-40
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <nav className="p-4 space-y-1 h-full overflow-y-auto">
            {menu.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-colors duration-200
                  ${
                    isActive(item.path)
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-foreground hover:bg-muted hover:text-primary'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <i className={`${item.icon} w-5 text-center`}></i>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-muted/30 w-full min-w-0">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};
