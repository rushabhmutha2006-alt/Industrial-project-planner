import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarDays,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building,
  CheckSquare,
  AlertCircle,
  MapPin,
  Calendar,
  IndianRupee,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    visits,
    registrations,
    approvals,
    setActiveTab,
    viewVisitDetails,
    registerForVisit,
  } = useApp();

  // Metrics
  const totalVisits = visits.length;
  const upcomingVisits = visits.filter(
    (v) => v.status === 'Confirmed with Company' || v.status === 'Approved'
  );
  const totalRegisteredStudents = registrations.filter(
    (r) => r.status === 'Confirmed' || r.status === 'Attended'
  ).length;
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'Pending').length;
  const totalExpenditure = visits.reduce(
    (sum, v) => sum + (v.budgetEstimate?.totalCost || 0),
    0
  );

  // Student specific registrations
  const myRegistrations = registrations.filter(
    (r) => r.studentId === currentUser.id && r.status !== 'Cancelled'
  );

  // Chart 1 Data: Visits by Month
  const monthlyData = [
    { month: 'Aug', visits: 1, budget: 35 },
    { month: 'Sep', visits: 1, budget: 135 },
    { month: 'Oct', visits: 2, budget: 88 },
    { month: 'Nov', visits: 3, budget: 120 },
    { month: 'Dec', visits: 2, budget: 70 },
    { month: 'Jan', visits: 1, budget: 45 },
  ];

  // Chart 2 Data: Department Distribution
  const deptData = [
    { name: 'Mechanical & Auto', value: 3, color: '#2563eb' },
    { name: 'Computer Science', value: 2, color: '#0d9488' },
    { name: 'Robotics & Mechatronics', value: 1, color: '#8b5cf6' },
    { name: 'Electronics & Comm', value: 1, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold backdrop-blur-sm border border-blue-400/20 mb-3">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            Academic Year 2026 - 2027 • Industrial Relations Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base leading-relaxed">
            {currentUser.role === 'admin'
              ? 'Review pending departmental visit sanctions, monitor institutional compliance, and inspect industry partnerships.'
              : currentUser.role === 'faculty'
              ? 'Plan visits with Gemini AI, track student registration quotas, calculate travel budgets, and submit proposals for sanction.'
              : 'Browse sanctioned industrial visits, reserve your student seat, download gate passes, and check travel itineraries.'}
          </p>

          {/* Quick Action buttons */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {currentUser.role !== 'student' && (
              <>
                <button
                  onClick={() => setActiveTab('ai-planner')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" /> Plan with Gemini AI
                </button>
                <button
                  onClick={() => setActiveTab('visits')}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-sm border border-white/20 transition-colors"
                >
                  <CalendarDays className="w-4 h-4" /> Manage Visits
                </button>
              </>
            )}

            {currentUser.role === 'admin' && pendingApprovalsCount > 0 && (
              <button
                onClick={() => setActiveTab('approvals')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105"
              >
                <CheckSquare className="w-4 h-4" />
                Review {pendingApprovalsCount} Pending Request{pendingApprovalsCount === 1 ? '' : 's'}
              </button>
            )}

            {currentUser.role === 'student' && (
              <button
                onClick={() => setActiveTab('visits')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105"
              >
                <CheckCircle className="w-4 h-4" /> Explore Available Visits
              </button>
            )}

            <button
              onClick={() => setActiveTab('directory')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs backdrop-blur-sm border border-white/20 transition-colors"
            >
              <Building className="w-4 h-4" /> Browse Companies
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Visits
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{totalVisits}</span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> Active
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Across 4 engineering faculties
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Upcoming Tours
            </span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{upcomingVisits.length}</span>
            <span className="text-xs font-semibold text-teal-600">Sanctioned</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Next: {upcomingVisits[0]?.visitDate || 'Scheduled soon'}
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Student Seats
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {totalRegisteredStudents}
            </span>
            <span className="text-xs font-semibold text-indigo-600">Registered</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            In Confirmed/Attended status
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {currentUser.role === 'admin' ? 'Pending Approvals' : 'Total Budget'}
            </span>
            <div
              className={`p-2.5 rounded-xl ${
                currentUser.role === 'admin'
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              {currentUser.role === 'admin' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <IndianRupee className="w-5 h-5" />
              )}
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {currentUser.role === 'admin'
                ? pendingApprovalsCount
                : `₹${(totalExpenditure / 1000).toFixed(0)}k`}
            </span>
            <span
              className={`text-xs font-semibold ${
                currentUser.role === 'admin' ? 'text-amber-600' : 'text-emerald-600'
              }`}
            >
              {currentUser.role === 'admin' ? 'Requires Dean Sign-off' : 'Estimated Value'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {currentUser.role === 'admin'
              ? 'Visit request queue'
              : 'Cumulative travel allocations'}
          </div>
        </div>
      </div>

      {/* Student Specific Banner if logged in as student */}
      {currentUser.role === 'student' && (
        <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Student Registration Status ({currentUser.rollNumber})
                </h3>
                <p className="text-xs text-slate-500">
                  You are registered in {myRegistrations.length} industrial tour(s).
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('students')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              View My Passes & Tickets <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visits by Month Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Visits & Outreaches by Month</h3>
              <p className="text-xs text-slate-500">
                Number of scheduled plant visits and allocated budgets (₹ thousands)
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
              2026 - 2027
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="visits" name="Visits" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="budget" name="Budget (₹k)" fill="#14b8a6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Share Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Visits by Department</h3>
            <p className="text-xs text-slate-500">Distribution across academic streams</p>
          </div>

          <div className="h-56 w-full my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {deptData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {deptData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: d.color }}
                  ></span>
                  {d.name}
                </span>
                <span className="font-bold text-slate-900">{d.value} visit(s)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Visits & Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Scheduled Visits */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Upcoming Industrial Visits</h3>
              <p className="text-xs text-slate-500">
                Confirmed schedules and open student registration quotas
              </p>
            </div>
            <button
              onClick={() => setActiveTab('visits')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View All ({visits.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {visits.slice(0, 3).map((visit) => {
              const statusColors: Record<string, string> = {
                Draft: 'bg-slate-100 text-slate-700 border-slate-300',
                'Pending Approval': 'bg-amber-50 text-amber-700 border-amber-300',
                Approved: 'bg-blue-50 text-blue-700 border-blue-300',
                'Confirmed with Company': 'bg-emerald-50 text-emerald-700 border-emerald-300',
                Completed: 'bg-purple-50 text-purple-700 border-purple-300',
                Cancelled: 'bg-rose-50 text-rose-700 border-rose-300',
              };

              const isRegistered = registrations.some(
                (r) => r.visitId === visit.id && r.studentId === currentUser.id && r.status !== 'Cancelled'
              );

              return (
                <div
                  key={visit.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          statusColors[visit.status] || 'bg-slate-100'
                        }`}
                      >
                        {visit.status}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        {visit.department}
                      </span>
                    </div>

                    <h4
                      onClick={() => viewVisitDetails(visit.id)}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors truncate"
                    >
                      {visit.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {visit.visitDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {visit.companyLocation || visit.companyName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        {visit.registeredCount} / {visit.studentCapacity} seats
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {currentUser.role === 'student' && !isRegistered && (
                      <button
                        onClick={() => registerForVisit(visit.id)}
                        disabled={visit.status === 'Cancelled' || visit.status === 'Completed'}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        Register
                      </button>
                    )}

                    {isRegistered && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                        Enrolled ✓
                      </span>
                    )}

                    <button
                      onClick={() => viewVisitDetails(visit.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Timeline & Demo Notice */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Recent Activity</h3>
            <p className="text-xs text-slate-500 mb-4">Audit log of system actions</p>

            <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              <div className="relative flex items-start gap-3 pl-1">
                <span className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white ring-2 ring-blue-500/20 flex items-center justify-center text-blue-600 shrink-0 text-xs font-bold">
                  ✓
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Visit #101 Confirmed with Tata Motors
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Company PR issued visitor badges for 50 students.
                  </p>
                  <span className="text-[10px] text-slate-400">Today, 10:14 AM</span>
                </div>
              </div>

              <div className="relative flex items-start gap-3 pl-1">
                <span className="w-6 h-6 rounded-full bg-amber-100 border-2 border-white ring-2 ring-amber-500/20 flex items-center justify-center text-amber-600 shrink-0 text-xs font-bold">
                  !
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    GreyOrange Robotics Proposal Submitted
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Submitted by Prof. Rajesh Sharma.
                  </p>
                  <span className="text-[10px] text-slate-400">Yesterday</span>
                </div>
              </div>

              <div className="relative flex items-start gap-3 pl-1">
                <span className="w-6 h-6 rounded-full bg-teal-100 border-2 border-white ring-2 ring-teal-500/20 flex items-center justify-center text-teal-600 shrink-0 text-xs font-bold">
                  ★
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Infosys Sanction Approved
                  </p>
                  <p className="text-[11px] text-slate-500">
                    ₹12,000 Academic subsidy cleared by Dean.
                  </p>
                  <span className="text-[10px] text-slate-400">3 days ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Demo Environment Active:</span>{' '}
              All sample companies and records are illustrative for academic planning. Verify
              permissions directly with industries.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
