import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Search,
  Filter,
  Download,
  Upload,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  Building,
  GraduationCap,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import { StudentRegistration } from '../types';

export const StudentManagementView: React.FC = () => {
  const {
    registrations,
    visits,
    currentUser,
    updateAttendance,
    cancelRegistration,
    batchImportRegistrations,
    showToast,
    viewVisitDetails,
  } = useApp();

  const [selectedVisitFilter, setSelectedVisitFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // CSV Import Modal State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importVisitId, setImportVisitId] = useState(visits[0]?.id || '');
  const [csvText, setCsvText] = useState(
    `Name,RollNumber,Department,ClassYear,Email,Phone
Sameer Joshi,ME-2023-085,Mechanical Engineering,3rd Year,sameer.j@apextech.edu,+91 98231 44556
Aarti Deshpande,ME-2023-089,Mechanical Engineering,3rd Year,aarti.d@apextech.edu,+91 98231 55667
Kunal Sen,ME-2023-094,Mechanical Engineering,3rd Year,kunal.s@apextech.edu,+91 98231 66778`
  );

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((r) => {
      // If student persona, show only their own registrations unless they switch to faculty/admin
      if (currentUser.role === 'student' && r.studentId !== currentUser.id) {
        return false;
      }

      const matchesVisit = selectedVisitFilter === 'all' || r.visitId === selectedVisitFilter;
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesSearch =
        r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.department.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesVisit && matchesStatus && matchesSearch;
    });
  }, [registrations, currentUser, selectedVisitFilter, statusFilter, searchQuery]);

  // Statistics
  const confirmedCount = filteredRegistrations.filter((r) => r.status === 'Confirmed' || r.status === 'Attended').length;
  const attendedCount = filteredRegistrations.filter((r) => r.status === 'Attended').length;
  const waitlistedCount = filteredRegistrations.filter((r) => r.status === 'Waitlisted').length;

  const handleExportCSV = () => {
    const headers = ['Student Name', 'Roll Number', 'Department', 'Class Year', 'Visit ID', 'Status', 'Registered At', 'Attendance Marked'];
    const rows = filteredRegistrations.map((r) => [
      `"${r.studentName}"`,
      `"${r.rollNumber}"`,
      `"${r.department}"`,
      `"${r.classYear}"`,
      `"${r.visitId}"`,
      `"${r.status}"`,
      `"${r.registeredAt}"`,
      `"${r.attendanceMarkedAt || 'N/A'}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Students_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported student registrations to CSV.', 'success');
  };

  const handleProcessCsvImport = () => {
    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) {
      showToast('CSV must have header and at least 1 record row.', 'error');
      return;
    }

    const studentsToImport: { name: string; rollNumber: string; department: string; classYear: string; email: string; phone: string }[] = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim());
      if (parts.length >= 2 && parts[0] && parts[1]) {
        studentsToImport.push({
          name: parts[0],
          rollNumber: parts[1],
          department: parts[2] || 'Engineering',
          classYear: parts[3] || '3rd Year',
          email: parts[4] || `${parts[1].toLowerCase()}@apextech.edu`,
          phone: parts[5] || '+91 90000 00000',
        });
      }
    }

    if (studentsToImport.length === 0) {
      showToast('No valid student rows found in CSV.', 'error');
      return;
    }

    batchImportRegistrations(importVisitId, studentsToImport);
    setIsImportModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {currentUser.role === 'student' ? 'My Registrations & Tickets' : 'Student Registration & Attendance'}
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {filteredRegistrations.length} Records
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {currentUser.role === 'student'
              ? 'Check your active enrollment status, download boarding passes, or manage cancellations.'
              : 'Audit enrollment quotas, process waitlists, track spot attendance, and export academic sheets.'}
          </p>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
          >
            <Printer className="w-3.5 h-3.5" /> Printable Sheet
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          {currentUser.role !== 'student' && (
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
            >
              <Upload className="w-3.5 h-3.5" /> Batch CSV Import
            </button>
          )}
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Confirmed Seats</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{confirmedCount}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Enrolled for travel</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Present at Venue</span>
          <div className="text-2xl font-extrabold text-teal-700 mt-1">{attendedCount}</div>
          <p className="text-[11px] text-teal-600 font-semibold mt-0.5">Attendance verified</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Waitlist Backlog</span>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">{waitlistedCount}</div>
          <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Auto-promoted on cancellation</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, roll number, or department..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedVisitFilter}
            onChange={(e) => setSelectedVisitFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Visits</option>
            {visits.map((v) => (
              <option key={v.id} value={v.id}>
                {v.title}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Attended">Attended (Present)</option>
            <option value="Absent">Absent</option>
            <option value="Waitlisted">Waitlisted</option>
          </select>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">Student Details</th>
                <th className="p-3.5">Roll Number</th>
                <th className="p-3.5">Industrial Visit</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Registered On</th>
                <th className="p-3.5 text-right no-print">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-400">
                    No registrations found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredRegistrations.map((st) => {
                  const visitMatch = visits.find((v) => v.id === st.visitId);

                  return (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{st.studentName}</div>
                        <div className="text-[11px] text-slate-500">{st.email}</div>
                      </td>
                      <td className="p-3.5 font-mono font-semibold text-slate-800">{st.rollNumber}</td>
                      <td className="p-3.5 max-w-xs">
                        <div
                          onClick={() => viewVisitDetails(st.visitId)}
                          className="font-semibold text-blue-600 hover:underline cursor-pointer truncate"
                        >
                          {visitMatch?.title || st.visitId}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {visitMatch?.companyName} • {visitMatch?.visitDate}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            st.status === 'Confirmed'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : st.status === 'Attended'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                              : st.status === 'Absent'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {st.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500 text-[11px]">{st.registeredAt}</td>
                      <td className="p-3.5 text-right no-print whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          {currentUser.role !== 'student' && (
                            <>
                              <button
                                onClick={() => updateAttendance(st.id, 'Attended')}
                                className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                                  st.status === 'Attended'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                                }`}
                                title="Mark Present"
                              >
                                Present
                              </button>
                              <button
                                onClick={() => updateAttendance(st.id, 'Absent')}
                                className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                                  st.status === 'Absent'
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-rose-100 hover:text-rose-800'
                                }`}
                                title="Mark Absent"
                              >
                                Absent
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => cancelRegistration(st.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Cancel Registration"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Batch Import Dialog */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Import Students from CSV</h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Industrial Visit</label>
              <select
                value={importVisitId}
                onChange={(e) => setImportVisitId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                {visits.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title} ({v.registeredCount}/{v.studentCapacity} seats)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">CSV Data</label>
                <span className="text-[10px] text-slate-400">Header: Name,RollNumber,Department...</span>
              </div>
              <textarea
                rows={6}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                className="w-full font-mono text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessCsvImport}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
              >
                Process & Import
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
