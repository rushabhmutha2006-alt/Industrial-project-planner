import React from 'react';
import { useApp } from '../context/AppContext';
import { AppTab } from '../types';
import {
  LayoutDashboard,
  Building,
  Sparkles,
  CalendarDays,
  Users,
  Calculator,
  CheckSquare,
  Truck,
  FileBarChart,
  Bell,
  Settings,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  GraduationCap,
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: AppTab;
  label: string;
  icon: React.ReactNode;
  roles?: ('admin' | 'faculty' | 'student')[];
  badge?: number;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, currentUser, approvals, notifications } = useApp();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;
  const unreadNotifsCount = notifications.filter(
    (n) => !n.isRead && (n.recipientRole === 'all' || n.recipientRole === currentUser.role || n.recipientId === currentUser.id)
  ).length;

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'directory',
      label: 'Company Directory',
      icon: <Building className="w-5 h-5" />,
    },
    {
      id: 'ai-planner',
      label: 'AI Visit Planner',
      icon: <Sparkles className="w-5 h-5" />,
      roles: ['faculty', 'admin'],
      highlight: true,
    },
    {
      id: 'visits',
      label: 'Visit Management',
      icon: <CalendarDays className="w-5 h-5" />,
    },
    {
      id: 'students',
      label: currentUser.role === 'student' ? 'My Registrations' : 'Student Management',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'budget',
      label: 'Budget Calculator',
      icon: <Calculator className="w-5 h-5" />,
      roles: ['faculty', 'admin'],
    },
    {
      id: 'approvals',
      label: 'Approval Requests',
      icon: <CheckSquare className="w-5 h-5" />,
      roles: ['admin', 'faculty'],
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
    },
    {
      id: 'calendar',
      label: 'Calendar & Transit',
      icon: <Truck className="w-5 h-5" />,
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: <FileBarChart className="w-5 h-5" />,
      roles: ['admin', 'faculty'],
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined,
    },
    {
      id: 'settings',
      label: 'Profile & Settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const filteredItems = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(currentUser.role);
  });

  const handleSelectTab = (tab: AppTab) => {
    setActiveTab(tab);
    onCloseMobile();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden no-print"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out no-print ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <div className="p-4 space-y-1 overflow-y-auto flex-1">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Menu Navigation
          </div>

          {filteredItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : item.highlight
                    ? 'text-teal-700 bg-teal-50/70 hover:bg-teal-100/70 border border-teal-200/60'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={
                      isActive
                        ? 'text-white'
                        : item.highlight
                        ? 'text-teal-600 group-hover:scale-110 transition-transform'
                        : 'text-slate-400 group-hover:text-slate-700 transition-colors'
                    }
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== undefined && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white text-blue-700'
                          : 'bg-rose-500 text-white shadow-xs'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-white/80" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* User Role Card at bottom of sidebar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-xs">
              {currentUser.role === 'admin' && <ShieldCheck className="w-5 h-5 text-amber-600" />}
              {currentUser.role === 'faculty' && <Briefcase className="w-5 h-5 text-blue-600" />}
              {currentUser.role === 'student' && <GraduationCap className="w-5 h-5 text-emerald-600" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
              <div className="text-[11px] text-slate-500 capitalize">{currentUser.role} Account</div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Demo Data Ready</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live & Synced
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
