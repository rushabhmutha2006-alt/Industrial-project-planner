import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  XCircle,
  ExternalLink,
  Info,
  Filter,
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    currentUser,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    viewVisitDetails,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'approval' | 'registration' | 'reminder'>('all');

  // Filter for role
  const roleFiltered = notifications.filter(
    (n) => n.recipientRole === 'all' || n.recipientRole === currentUser.role || n.recipientId === currentUser.id
  );

  const displayedNotifications = roleFiltered.filter((n) => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'all') return true;
    return n.type === activeFilter;
  });

  const unreadCount = roleFiltered.filter((n) => !n.isRead).length;

  const iconByType = {
    approval: <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />,
    registration: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    reminder: <Clock className="w-5 h-5 text-amber-600 shrink-0" />,
    schedule: <Calendar className="w-5 h-5 text-indigo-600 shrink-0" />,
    cancellation: <XCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    general: <Info className="w-5 h-5 text-slate-500 shrink-0" />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              In-App Notification Center
            </h1>
            {unreadCount > 0 && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500 text-white">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time notifications for sanctions, registrations, schedule updates, and safety advisories.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-blue-600" /> Mark All as Read
          </button>
        )}
      </div>

      {/* External delivery disclosure banner (as mandated by prompt) */}
      <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-slate-800">Delivery Channel Notice:</span> In-app notifications
          are active and functional. External SMTP email delivery and mobile SMS relays are unconfigured in this
          sandbox and currently unavailable.
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
        {[
          { id: 'all', label: `All (${roleFiltered.length})` },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'approval', label: 'Sanctions & Approvals' },
          { id: 'registration', label: 'Student Registrations' },
          { id: 'reminder', label: 'Safety & Deadlines' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === f.id
                ? 'bg-blue-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {displayedNotifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => {
              markNotificationAsRead(notif.id);
              if (notif.visitId) {
                viewVisitDetails(notif.visitId);
              }
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
              notif.isRead
                ? 'bg-white border-slate-200 hover:border-slate-300'
                : 'bg-blue-50/50 border-blue-200 hover:border-blue-400 shadow-xs'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs mt-0.5">
                {iconByType[notif.type] || <Bell className="w-5 h-5 text-slate-600" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-slate-900 text-sm">{notif.title}</h4>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{notif.message}</p>
                {notif.visitId && (
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 pt-1">
                    <span>Inspect associated visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </div>
                )}
              </div>
            </div>

            <span className="text-[11px] text-slate-400 shrink-0">{notif.createdAt}</span>
          </div>
        ))}

        {displayedNotifications.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No notifications</h3>
            <p className="text-xs text-slate-500 mt-1">You are all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};
