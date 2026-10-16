import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Settings,
  User,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Building,
  RotateCcw,
  Sparkles,
  Database,
  CheckCircle2,
  Save,
  Key,
  Info,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { currentUser, switchRole, loginUser, resetDemoData, showToast } = useApp();

  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    department: currentUser.department,
    collegeName: currentUser.collegeName,
    rollNumber: currentUser.rollNumber || '',
    phone: currentUser.phone || '',
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(profileForm);
    showToast('Profile and institutional details updated!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          User Profile & System Configuration
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account credentials, role permissions, and institutional preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: User Profile Form (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={currentUser.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500/20"
              />
              <div>
                <h3 className="font-bold text-slate-900 text-base">{currentUser.name}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 capitalize">
                  {currentUser.role} Account
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {(['faculty', 'student', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg capitalize transition-colors ${
                    currentUser.role === r
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Institutional Email</label>
                <input
                  type="email"
                  required
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Academic Department</label>
                <input
                  type="text"
                  required
                  value={profileForm.department}
                  onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {currentUser.role === 'student' ? 'Student Roll Number' : 'Employee Identification'}
                </label>
                <input
                  type="text"
                  value={profileForm.rollNumber}
                  onChange={(e) => setProfileForm({ ...profileForm, rollNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">College / University Name</label>
              <input
                type="text"
                required
                value={profileForm.collegeName}
                onChange={(e) => setProfileForm({ ...profileForm, collegeName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
              >
                <Save className="w-4 h-4" /> Save Profile Preferences
              </button>
            </div>
          </form>
        </div>

        {/* Right: Role Matrix & System Diagnostics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Role Permissions Matrix */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Role-Based Access Control (RBAC)
            </h3>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="p-3 bg-slate-50 flex items-center justify-between font-bold text-slate-700">
                <span>Role Capability</span>
                <span>Access Scope</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Admin (Dean / Principal)</div>
                  <div className="text-[11px] text-slate-500">Sanctions, user audits, company register</div>
                </div>
                <span className="font-bold text-emerald-600">Full Control</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Faculty Coordinator</div>
                  <div className="text-[11px] text-slate-500">Create visits, AI planner, attendance</div>
                </div>
                <span className="font-bold text-blue-600">Planning & Ops</span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Student Portal</div>
                  <div className="text-[11px] text-slate-500">Browse visits, seat registration, gate passes</div>
                </div>
                <span className="font-bold text-slate-700">Self-Enrollment</span>
              </div>
            </div>
          </div>

          {/* System Services Status */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" /> Platform Integration Engine
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-medium text-slate-700">Gemini 3.8 Flash AI Model:</span>
                <span className="font-bold text-teal-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                  Active on Server
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-medium text-slate-700">Database Storage Layer:</span>
                <span className="font-bold text-blue-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Local Persistent + Firebase Ready
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Restore factory sample seed data</span>
              <button
                onClick={resetDemoData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-semibold text-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
