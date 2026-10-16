import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Bell,
  Building2,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  ChevronDown,
  Menu,
  X,
  RotateCcw,
  Sparkles,
  CheckCheck,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const {
    currentUser,
    switchRole,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
    resetDemoData,
    viewVisitDetails,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter notifications for current user role
  const visibleNotifications = notifications.filter(
    (n) => n.recipientRole === 'all' || n.recipientRole === currentUser.role || n.recipientId === currentUser.id
  );
  const unreadCount = visibleNotifications.filter((n) => !n.isRead).length;

  const roleMeta: Record<UserRole, { label: string; icon: React.ReactNode; color: string; badge: string }> = {
    admin: {
      label: 'Administrator (Dean)',
      icon: <ShieldCheck className="w-4 h-4 text-amber-600" />,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'bg-amber-600 text-white',
    },
    faculty: {
      label: 'Faculty Coordinator',
      icon: <Briefcase className="w-4 h-4 text-blue-600" />,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      badge: 'bg-blue-600 text-white',
    },
    student: {
      label: 'Student Portal',
      icon: <GraduationCap className="w-4 h-4 text-emerald-600" />,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badge: 'bg-emerald-600 text-white',
    },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-teal-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-lg tracking-tight">
                    Industrial Visit <span className="text-blue-600">Planner</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                    <Sparkles className="w-3 h-3 text-teal-600" /> AI Powered
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block truncate max-w-xs">
                  {currentUser.collegeName}
                </p>
              </div>
            </div>
          </div>

          {/* Center/Right: Quick Role Switcher (Crucial for testing all 3 roles!) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role switcher segmented pill */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(['faculty', 'student', 'admin'] as UserRole[]).map((role) => {
                const isActive = currentUser.role === role;
                return (
                  <button
                    key={role}
                    onClick={() => switchRole(role)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    {role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />}
                    {role === 'faculty' && <Briefcase className="w-3.5 h-3.5 text-blue-600" />}
                    {role === 'student' && <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />}
                    <span className="capitalize">{role}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile role select button */}
            <div className="relative md:hidden" ref={roleRef}>
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${roleMeta[currentUser.role].color}`}
              >
                {roleMeta[currentUser.role].icon}
                <span className="capitalize">{currentUser.role}</span>
                <ChevronDown className="w-3 h-3 ml-0.5" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-medium text-slate-400">
                    Switch Test Persona
                  </div>
                  {(['faculty', 'student', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 text-left"
                    >
                      <span className="capitalize">{r}</span>
                      {currentUser.role === r && <span className="text-blue-600 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification bell dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                      <p className="text-xs text-slate-500">
                        {unreadCount} unread update{unreadCount === 1 ? '' : 's'}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {visibleNotifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No notifications right now.
                      </div>
                    ) : (
                      visibleNotifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.visitId) {
                              viewVisitDetails(n.visitId);
                              setIsNotifOpen(false);
                            }
                          }}
                          className={`p-3.5 text-left transition-colors cursor-pointer hover:bg-slate-50 ${
                            n.isRead ? 'opacity-70 bg-white' : 'bg-blue-50/40'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-semibold text-slate-900 line-clamp-1">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400 shrink-0">{n.createdAt}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{n.message}</p>
                          {n.visitId && (
                            <div className="mt-1.5 flex items-center gap-1 text-[11px] text-blue-600 font-medium">
                              <span>View visit details</span>
                              <ExternalLink className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
                    <button
                      onClick={() => {
                        setActiveTab('notifications');
                        setIsNotifOpen(false);
                      }}
                      className="text-xs font-semibold text-slate-700 hover:text-blue-600"
                    >
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Mini Card */}
            <div
              onClick={() => setActiveTab('settings')}
              className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 cursor-pointer group"
            >
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                alt={currentUser.name}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-blue-400 transition-all"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <span className="capitalize">{currentUser.role}</span>
                  {currentUser.rollNumber && <span>• {currentUser.rollNumber}</span>}
                </div>
              </div>
            </div>

            {/* Demo Reset helper button */}
            <button
              onClick={resetDemoData}
              title="Reset Demo Data to Initial State"
              className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
