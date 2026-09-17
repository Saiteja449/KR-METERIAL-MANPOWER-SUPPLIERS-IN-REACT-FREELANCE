import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Clock,
  CheckCircle,
  Hourglass,
  CheckCheck,
  XCircle,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
  User,
  UserPlus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const toast = useToast();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/admin/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: '+ Add New Candidate',
      path: '/admin/applications/new',
      icon: <UserPlus size={18} className="text-amber" />,
    },
    {
      name: 'All Applications',
      path: '/admin/applications',
      icon: <FileText size={18} />,
    },
    {
      name: 'Payment Pending',
      path: '/admin/applications?status=PAYMENT_PENDING',
      icon: <Clock size={18} />,
      status: 'PAYMENT_PENDING',
    },
    {
      name: 'Payment Received',
      path: '/admin/applications?status=PAYMENT_RECEIVED',
      icon: <CheckCircle size={18} />,
      status: 'PAYMENT_RECEIVED',
    },
    {
      name: 'Under Review',
      path: '/admin/applications?status=APPLICATION_PENDING',
      icon: <Hourglass size={18} />,
      status: 'APPLICATION_PENDING',
    },
    {
      name: 'Confirmed',
      path: '/admin/applications?status=CONFIRMED',
      icon: <CheckCheck size={18} />,
      status: 'CONFIRMED',
    },
    {
      name: 'Rejected',
      path: '/admin/applications?status=REJECTED',
      icon: <XCircle size={18} />,
      status: 'REJECTED',
    },
  ];

  const currentPathWithQuery = location.pathname + location.search;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="md:hidden bg-navy-dark text-white p-4 flex items-center justify-between border-b border-navy-light sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img src="/assets/images/KRLOGO.jpeg" alt="KR Logo" className="h-8 w-auto rounded-sm" />
          <span className="font-heading font-bold text-sm tracking-tight text-white">
            KR Admin Portal
          </span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-300 hover:text-amber p-1.5 transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-navy-dark text-gray-300 flex flex-col justify-between z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Portal Title */}
          <div className="p-6 border-b border-navy-light flex items-center gap-3">
            <img src="/assets/images/KRLOGO.jpeg" alt="KR Logo" className="h-10 w-auto rounded-sm" />
            <div>
              <span className="font-heading font-extrabold text-base text-white block leading-tight">
                KR Material
              </span>
              <span className="text-[11px] font-semibold tracking-wider text-amber uppercase flex items-center gap-1 mt-0.5">
                <ShieldCheck size={12} /> Admin Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-220px)]">
            <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Management
            </div>
            {navItems.map((item) => {
              const isActive =
                item.path === '/admin/applications'
                  ? location.pathname === '/admin/applications' && !location.search
                  : currentPathWithQuery === item.path ||
                    (item.path === '/admin/dashboard' && location.pathname === '/admin/dashboard');

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-amber text-navy font-bold shadow-md'
                      : 'text-gray-300 hover:bg-navy-light hover:text-white'
                  }`}
                >
                  <span className={isActive ? 'text-navy' : 'text-amber-light'}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="p-4 border-t border-navy-light bg-navy/60">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-amber/20 text-amber flex items-center justify-center font-bold text-xs">
              <User size={16} />
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-white block truncate">{user?.name || 'Administrator'}</span>
              <span className="text-[10px] text-gray-400 block truncate">{user?.email || 'admin@kr1.in'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link
              to="/"
              target="_blank"
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-sm bg-navy-light hover:bg-navy text-gray-300 hover:text-white text-[11px] font-medium transition-colors"
            >
              <ExternalLink size={12} />
              <span>Live Site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-sm bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-[11px] font-semibold transition-colors"
            >
              <LogOut size={12} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex bg-white border-b border-gray-200 px-8 py-4 items-center justify-between shadow-xs sticky top-0 z-30">
          <div>
            <h2 className="text-lg font-heading font-bold text-navy">
              Application & Payment Management System
            </h2>
            <p className="text-xs text-gray-500">
              Overview, candidate screening, verification, and automated notifications
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Atlas Connected
            </div>
            <span className="text-xs text-gray-400">|</span>
            <span className="text-xs font-medium text-gray-600">
              Logged in as <strong className="text-navy">{user?.name}</strong>
            </span>
          </div>
        </header>

        {/* Routed Page Container */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
