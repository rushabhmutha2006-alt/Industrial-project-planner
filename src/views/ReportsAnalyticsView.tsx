import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileBarChart,
  Download,
  Printer,
  Calendar,
  Building,
  Users,
  IndianRupee,
  CheckCircle2,
  TrendingUp,
  Award,
  Filter,
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
} from 'recharts';

export const ReportsAnalyticsView: React.FC = () => {
  const { visits, registrations, approvals, showToast } = useApp();

  const [selectedReportType, setSelectedReportType] = useState<
    'all-visits' | 'registrations' | 'budgets' | 'completed'
  >('all-visits');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  const filteredVisits = visits.filter(
    (v) => departmentFilter === 'all' || v.department.toLowerCase().includes(departmentFilter.toLowerCase())
  );

  const completedVisits = filteredVisits.filter((v) => v.status === 'Completed');
  const totalSanctionedBudget = filteredVisits.reduce(
    (acc, v) => acc + (v.budgetEstimate?.totalCost || 0),
    0
  );
  const totalStudentsEnrolled = registrations.filter((r) => r.status === 'Confirmed' || r.status === 'Attended').length;

  // Chart data
  const deptBreakdown = [
    { name: 'Mechanical', count: 3, budget: 140, color: '#2563eb' },
    { name: 'Computer Science', count: 2, budget: 85, color: '#0d9488' },
    { name: 'Robotics', count: 1, budget: 45, color: '#8b5cf6' },
    { name: 'Electronics', count: 1, budget: 35, color: '#f59e0b' },
  ];

  const handleExportFullCSV = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let fileName = '';

    if (selectedReportType === 'all-visits' || selectedReportType === 'completed') {
      headers = ['Visit ID', 'Title', 'Company', 'Department', 'Date', 'Status', 'Registered', 'Capacity', 'Budget (INR)'];
      const set = selectedReportType === 'completed' ? completedVisits : filteredVisits;
      rows = set.map((v) => [
        `"${v.id}"`,
        `"${v.title}"`,
        `"${v.companyName}"`,
        `"${v.department}"`,
        `"${v.visitDate}"`,
        `"${v.status}"`,
        `"${v.registeredCount}"`,
        `"${v.studentCapacity}"`,
        `"${v.budgetEstimate?.totalCost || 0}"`,
      ]);
      fileName = `Industrial_Visits_Report_${selectedReportType}.csv`;
    } else if (selectedReportType === 'registrations') {
      headers = ['Student Name', 'Roll No', 'Department', 'Class', 'Visit ID', 'Status', 'Registered At'];
      rows = registrations.map((r) => [
        `"${r.studentName}"`,
        `"${r.rollNumber}"`,
        `"${r.department}"`,
        `"${r.classYear}"`,
        `"${r.visitId}"`,
        `"${r.status}"`,
        `"${r.registeredAt}"`,
      ]);
      fileName = `Student_Registrations_Master.csv`;
    } else {
      headers = ['Visit Title', 'Transport Est', 'Food Est', 'Entry Est', 'Misc Est', 'Total Est', 'Cost Per Student'];
      rows = filteredVisits.map((v) => [
        `"${v.title}"`,
        `"${v.budgetEstimate?.transportCost}"`,
        `"${v.budgetEstimate?.foodCost}"`,
        `"${v.budgetEstimate?.entryFee}"`,
        `"${v.budgetEstimate?.miscCost}"`,
        `"${v.budgetEstimate?.totalCost}"`,
        `"${v.budgetEstimate?.costPerStudent}"`,
      ]);
      fileName = `Financial_Allocations_Audit.csv`;
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${fileName} successfully.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Reports & Academic Analytics
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Institutional Audit Ready
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Generate printable dossiers, department participation audits, and finance reconciliation reports.
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
          >
            <Printer className="w-3.5 h-3.5" /> Print Formal Report
          </button>
          <button
            onClick={handleExportFullCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
          >
            <Download className="w-3.5 h-3.5" /> Export Report (CSV)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Visits Filtered</span>
          <div className="text-3xl font-black text-slate-900 mt-2">{filteredVisits.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">{completedVisits.length} successfully completed</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Students Benefitted</span>
          <div className="text-3xl font-black text-blue-600 mt-2">{totalStudentsEnrolled}</div>
          <p className="text-[11px] text-slate-500 mt-1">Confirmed student attendance</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Sanctioned Outlay</span>
          <div className="text-3xl font-black text-teal-600 mt-2">
            ₹{(totalSanctionedBudget / 1000).toFixed(0)}k
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Total approved allocations</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Corporate Host Orgs</span>
          <div className="text-3xl font-black text-purple-600 mt-2">6</div>
          <p className="text-[11px] text-slate-500 mt-1">Tier-1 industries partnered</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Department Budget Outlay (₹ thousands)</h3>
            <span className="text-xs text-slate-400">Academic Year 2026-27</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="budget" name="Budget (₹k)" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Visits Distribution by Engineering Branch</h3>
            <span className="text-xs text-slate-400">Total 7 Tours</span>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="count">
                  {deptBreakdown.map((entry, index) => (
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
        </div>
      </div>

      {/* Report Data Table Preview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          {/* Report tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {[
              { id: 'all-visits', label: 'All Scheduled Visits' },
              { id: 'registrations', label: 'Student Enrollments' },
              { id: 'budgets', label: 'Financial Breakdown' },
              { id: 'completed', label: 'Completed Tours & Feedback' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedReportType(t.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedReportType === t.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
          >
            <option value="all">All Departments</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Computer">Computer Science</option>
            <option value="Robotics">Robotics</option>
            <option value="Electronics">Electronics</option>
          </select>
        </div>

        {/* Printable Formal Table Header (Visible on print) */}
        <div className="hidden print-only mb-6 text-center border-b pb-4">
          <h2 className="text-xl font-extrabold uppercase tracking-wide">
            Apex Institute of Technology & Engineering
          </h2>
          <p className="text-sm">Deanery of Academic & Industrial Relations</p>
          <p className="text-xs text-slate-500 mt-1">
            Official Industrial Visit Audit Report • Generated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Table Render */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
              <tr>
                <th className="p-3">Title / Host Industry</th>
                <th className="p-3">Department</th>
                <th className="p-3">Scheduled Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Seats</th>
                <th className="p-3 text-right">Budget (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(selectedReportType === 'completed' ? completedVisits : filteredVisits).map((v) => (
                <tr key={v.id}>
                  <td className="p-3 font-semibold text-slate-900">
                    <div>{v.title}</div>
                    <div className="text-[11px] text-slate-500">{v.companyName}</div>
                  </td>
                  <td className="p-3 text-slate-600">{v.department}</td>
                  <td className="p-3 font-mono">{v.visitDate}</td>
                  <td className="p-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {v.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono">
                    {v.registeredCount} / {v.studentCapacity}
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-900">
                    ₹{v.budgetEstimate?.totalCost.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
