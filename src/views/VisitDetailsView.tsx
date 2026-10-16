import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  Users,
  IndianRupee,
  Truck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  ChevronLeft,
  ArrowRight,
  Send,
  CheckSquare,
  ShieldAlert,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Download,
  Upload,
  Sparkles,
  ExternalLink,
  Edit2,
  Save,
} from 'lucide-react';
import { VisitStatus } from '../types';

export const VisitDetailsView: React.FC = () => {
  const {
    visits,
    selectedVisitId,
    setActiveTab,
    currentUser,
    registrations,
    registerForVisit,
    cancelRegistration,
    updateAttendance,
    submitVisitForApproval,
    reviewApproval,
    confirmVisitWithCompany,
    completeVisit,
    approvals,
    updateVisit,
    showToast,
  } = useApp();

  const [activeTab, setActiveDetailTab] = useState<
    'itinerary' | 'students' | 'budget' | 'transit' | 'approvals' | 'safety'
  >('itinerary');

  const visit = visits.find((v) => v.id === selectedVisitId) || visits[0];

  // Local state for interactive budget editing within this visit
  const [transportCost, setTransportCost] = useState(visit?.budgetEstimate?.transportCost || 20000);
  const [foodCost, setFoodCost] = useState(visit?.budgetEstimate?.foodCost || 14000);
  const [entryFee, setEntryFee] = useState(visit?.budgetEstimate?.entryFee || 5000);
  const [miscCost, setMiscCost] = useState(visit?.budgetEstimate?.miscCost || 3000);
  const [collegeSubsidy, setCollegeSubsidy] = useState(visit?.budgetEstimate?.collegeSubsidy || 10000);

  // Approval modal state
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');

  if (!visit) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-800">Visit not found</h3>
        <button
          onClick={() => setActiveTab('visits')}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Visits List
        </button>
      </div>
    );
  }

  // Registrations for this visit
  const visitRegistrations = registrations.filter(
    (r) => r.visitId === visit.id && r.status !== 'Cancelled'
  );
  const confirmedStudents = visitRegistrations.filter((r) => r.status === 'Confirmed' || r.status === 'Attended');
  const waitlistedStudents = visitRegistrations.filter((r) => r.status === 'Waitlisted');
  const isCurrentUserRegistered = visitRegistrations.some((r) => r.studentId === currentUser.id);

  // Approval item
  const approvalItem = approvals.find((a) => a.visitId === visit.id);

  // Calculations for live budget
  const studentCount = visit.studentCapacity || 50;
  const subtotal = transportCost + foodCost + entryFee + miscCost;
  const contingency = Math.round(subtotal * 0.08);
  const totalCalculated = subtotal + contingency;
  const costPerStudentCalc = Math.round(totalCalculated / studentCount);
  const studentPayableCalc = Math.max(0, Math.round((totalCalculated - collegeSubsidy) / studentCount));

  const handleSaveBudgetUpdates = () => {
    updateVisit(visit.id, {
      budgetEstimate: {
        ...visit.budgetEstimate,
        transportCost,
        foodCost,
        entryFee,
        miscCost,
        contingencyCost: contingency,
        totalCost: totalCalculated,
        costPerStudent: costPerStudentCalc,
        collegeSubsidy,
        studentPayable: studentPayableCalc,
      },
    });
    showToast('Budget parameters updated and saved for this visit!', 'success');
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'Roll Number', 'Department', 'Class Year', 'Status', 'Registered At', 'Emergency Contact'];
    const rows = visitRegistrations.map((r) => [
      `"${r.studentName}"`,
      `"${r.rollNumber}"`,
      `"${r.department}"`,
      `"${r.classYear}"`,
      `"${r.status}"`,
      `"${r.registeredAt}"`,
      `"${r.emergencyContact || 'N/A'}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Attendance_${visit.title.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Attendance report exported as CSV.', 'success');
  };

  const statusBadgeColors: Record<VisitStatus, string> = {
    Draft: 'bg-slate-100 text-slate-700 border-slate-300',
    'Pending Approval': 'bg-amber-50 text-amber-700 border-amber-300',
    Approved: 'bg-blue-50 text-blue-700 border-blue-300',
    'Confirmed with Company': 'bg-emerald-50 text-emerald-700 border-emerald-300',
    Completed: 'bg-purple-50 text-purple-700 border-purple-300',
    Cancelled: 'bg-rose-50 text-rose-700 border-rose-300',
  };

  return (
    <div className="space-y-6">
      {/* Back button & quick navigation */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => setActiveTab('visits')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Visit Management
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
          >
            <Printer className="w-3.5 h-3.5" /> Print Visit Dossier
          </button>
        </div>
      </div>

      {/* Hero Banner with Status & Key Actions */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  statusBadgeColors[visit.status]
                }`}
              >
                {visit.status}
              </span>
              <span className="text-xs font-semibold text-slate-500">{visit.department}</span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-500">{visit.semester}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {visit.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1.5 font-bold text-slate-900">
                <Building className="w-4 h-4 text-blue-600 shrink-0" />
                {visit.companyName}
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                {visit.companyLocation}
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                {visit.visitDate} ({visit.departureTime} - {visit.returnTime})
              </span>
            </div>
          </div>

          {/* Action Hub */}
          <div className="flex flex-wrap items-center gap-2 self-start no-print">
            {/* Student Registration Button */}
            {currentUser.role === 'student' && !isCurrentUserRegistered && (
              <button
                onClick={() => registerForVisit(visit.id)}
                disabled={visit.status === 'Cancelled' || visit.status === 'Completed'}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" /> Register as Student
              </button>
            )}

            {isCurrentUserRegistered && (
              <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> You Are Registered
              </span>
            )}

            {/* Faculty submit for approval */}
            {currentUser.role !== 'student' && visit.status === 'Draft' && (
              <button
                onClick={() => submitVisitForApproval(visit.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-all"
              >
                <Send className="w-4 h-4" /> Submit for Sanction
              </button>
            )}

            {/* Admin approval buttons */}
            {currentUser.role === 'admin' && visit.status === 'Pending Approval' && approvalItem && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => reviewApproval(approvalItem.id, 'Approved', 'Sanctioned by Dean')}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                >
                  Approve Visit
                </button>
                <button
                  onClick={() => setIsRejectModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm"
                >
                  Reject...
                </button>
              </div>
            )}

            {/* Faculty mark confirmed with company once approved */}
            {currentUser.role !== 'student' && visit.status === 'Approved' && (
              <button
                onClick={() => confirmVisitWithCompany(visit.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirm with Host Company
              </button>
            )}

            {/* Mark complete */}
            {currentUser.role !== 'student' && visit.status === 'Confirmed with Company' && (
              <button
                onClick={() => completeVisit(visit.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm"
              >
                Mark as Completed
              </button>
            )}
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">Capacity & Enrollment:</span>
            <span className="font-bold text-slate-900">
              {confirmedStudents.length} / {visit.studentCapacity} Confirmed
            </span>
            {waitlistedStudents.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                {waitlistedStudents.length} on Waitlist
              </span>
            )}
          </div>

          <div className="w-full sm:w-48 bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                confirmedStudents.length >= visit.studentCapacity ? 'bg-amber-500' : 'bg-blue-600'
              }`}
              style={{
                width: `${Math.min(100, (confirmedStudents.length / visit.studentCapacity) * 100)}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 no-print">
          {[
            { id: 'itinerary', label: '1. Itinerary & Schedule' },
            { id: 'students', label: `2. Registered Students (${visitRegistrations.length})` },
            { id: 'budget', label: '3. Budget & Expenditure' },
            { id: 'transit', label: '4. Transportation & Fleet' },
            { id: 'approvals', label: '5. Sanctions & Approvals' },
            { id: 'safety', label: '6. Safety & Academic Questions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDetailTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: ITINERARY & SCHEDULE */}
      {activeTab === 'itinerary' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Time-Based Visit Itinerary
                </h3>
                <p className="text-xs text-slate-500">
                  Assembly at {visit.assemblyPoint} • Departure at {visit.departureTime}
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {visit.itinerary.length} Steps Planned
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {visit.itinerary.map((item, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-36 shrink-0 font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg text-center">
                    {item.timeSlot}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-900 text-sm">{item.activity}</h4>
                      {item.coordinator && (
                        <span className="text-[11px] font-semibold text-slate-400">
                          In Charge: {item.coordinator}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-blue-600 font-semibold">{item.location}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Objectives */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
            <h3 className="text-base font-extrabold text-slate-900">Curriculum Learning Objectives</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {visit.learningObjectives.map((obj, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED STUDENTS & ATTENDANCE */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Student List & Attendance Tracker
                </h3>
                <p className="text-xs text-slate-500">
                  {confirmedStudents.length} Confirmed • {waitlistedStudents.length} Waitlisted • Enforcing max capacity of {visit.studentCapacity}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>

                {currentUser.role !== 'student' && (
                  <button
                    onClick={() => {
                      const sampleBatch = [
                        { name: 'Siddharth Roy', rollNumber: 'ME-2023-071', department: visit.department, classYear: visit.semester, email: 'sid.r@apextech.edu', phone: '+91 99881 22334' },
                        { name: 'Meera Nambiar', rollNumber: 'ME-2023-082', department: visit.department, classYear: visit.semester, email: 'meera.n@apextech.edu', phone: '+91 99882 33445' },
                      ];
                      showToast(`Importing 2 sample student records via CSV parser...`, 'info');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold"
                  >
                    <Upload className="w-3.5 h-3.5" /> Batch CSV Import
                  </button>
                )}
              </div>
            </div>

            {/* Students Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-3">Student Name</th>
                    <th className="p-3">Roll Number</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Registered At</th>
                    {currentUser.role !== 'student' && <th className="p-3 text-right">Attendance</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visitRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No students have registered yet. Quota is open!
                      </td>
                    </tr>
                  ) : (
                    visitRegistrations.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{st.studentName}</div>
                          <div className="text-[11px] text-slate-500">{st.email}</div>
                        </td>
                        <td className="p-3 font-mono font-semibold text-slate-800">{st.rollNumber}</td>
                        <td className="p-3 text-slate-600">{st.department}</td>
                        <td className="p-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              st.status === 'Confirmed'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : st.status === 'Attended'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-black'
                                : st.status === 'Absent'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {st.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500 text-[11px]">{st.registeredAt}</td>

                        {/* Attendance Toggles for Faculty/Admin */}
                        {currentUser.role !== 'student' && (
                          <td className="p-3 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => updateAttendance(st.id, 'Attended')}
                                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${
                                  st.status === 'Attended'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-100 hover:text-emerald-800'
                                }`}
                                title="Mark Present"
                              >
                                Present ✓
                              </button>
                              <button
                                onClick={() => updateAttendance(st.id, 'Absent')}
                                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-colors ${
                                  st.status === 'Absent'
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-rose-100 hover:text-rose-800'
                                }`}
                                title="Mark Absent"
                              >
                                Absent ✕
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BUDGET BREAKDOWN & ACTUALS */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Interactive Budget Calculator & Cost Allocation
                </h3>
                <p className="text-xs text-slate-500">
                  Live recalculation for {studentCount} students. Distinguish estimates from actual expenditure.
                </p>
              </div>

              {currentUser.role !== 'student' && (
                <button
                  onClick={handleSaveBudgetUpdates}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  <Save className="w-3.5 h-3.5" /> Save Updated Budget
                </button>
              )}
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Total Estimated Outlay</span>
                <div className="text-2xl font-black text-slate-900 mt-1">₹{totalCalculated.toLocaleString()}</div>
                <span className="text-[11px] text-slate-500">All expenses + 8% contingency</span>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <span className="text-[10px] font-bold text-blue-700 uppercase">Gross Cost / Student</span>
                <div className="text-2xl font-black text-blue-950 mt-1">₹{costPerStudentCalc}</div>
                <span className="text-[11px] text-blue-600">Before college subsidy</span>
              </div>

              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
                <span className="text-[10px] font-bold text-teal-700 uppercase">College Grant / Subsidy</span>
                <div className="text-2xl font-black text-teal-950 mt-1">₹{collegeSubsidy.toLocaleString()}</div>
                <span className="text-[11px] text-teal-600">Funded from academic pool</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Student Payable Fee</span>
                <div className="text-2xl font-black text-emerald-950 mt-1">₹{studentPayableCalc}</div>
                <span className="text-[11px] text-emerald-600">Net contribution per student</span>
              </div>
            </div>

            {/* Editable Form Inputs for Faculty */}
            {currentUser.role !== 'student' && (
              <div className="p-5 rounded-xl bg-slate-50/80 border border-slate-200 space-y-4 text-xs">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Edit2 className="w-4 h-4 text-blue-600" /> Adjust Quotation Line Items
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Bus Transport (₹)</label>
                    <input
                      type="number"
                      step={500}
                      value={transportCost}
                      onChange={(e) => setTransportCost(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Food & Meals (₹)</label>
                    <input
                      type="number"
                      step={500}
                      value={foodCost}
                      onChange={(e) => setFoodCost(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Lab/Entry Passes (₹)</label>
                    <input
                      type="number"
                      step={500}
                      value={entryFee}
                      onChange={(e) => setEntryFee(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Miscellaneous (₹)</label>
                    <input
                      type="number"
                      step={500}
                      value={miscCost}
                      onChange={(e) => setMiscCost(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">College Subsidy (₹)</label>
                    <input
                      type="number"
                      step={500}
                      value={collegeSubsidy}
                      onChange={(e) => setCollegeSubsidy(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Actual vs Estimated Comparison if Completed or recorded */}
            {visit.budgetEstimate?.actualExpenditure && (
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-2">
                <h4 className="font-bold text-purple-950 text-xs">
                  Actual vs Estimated Audit Reconciliation
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500">Estimated Total:</span>
                    <p className="font-mono font-bold text-slate-900">
                      ₹{visit.budgetEstimate.totalCost.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Actual Billed:</span>
                    <p className="font-mono font-bold text-emerald-700">
                      ₹{visit.budgetEstimate.actualExpenditure.total.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Net Variance:</span>
                    <p className="font-mono font-bold text-emerald-600">
                      -₹{(visit.budgetEstimate.totalCost - visit.budgetEstimate.actualExpenditure.total).toLocaleString()} (Savings)
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500">Audit Status:</span>
                    <p className="font-bold text-emerald-800">Accounts Cleared ✓</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: TRANSPORTATION & FLEET */}
      {activeTab === 'transit' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Transportation Logistics & Fleet Details
              </h3>
              <p className="text-xs text-slate-500">
                Vehicle assignments, route milestones, and driver emergency contacts
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Vehicles</span>
                <p className="font-bold text-slate-900 text-sm mt-1">
                  {visit.transportationDetails.vehicleType}
                </p>
                <p className="text-xs text-blue-600 font-mono mt-0.5">
                  Reg: {visit.transportationDetails.vehicleNumber}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Driver Contact</span>
                <p className="font-bold text-slate-900 text-sm mt-1">
                  {visit.transportationDetails.driverName}
                </p>
                <p className="text-xs text-emerald-700 font-mono mt-0.5 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {visit.transportationDetails.driverPhone}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Route Distance</span>
                <p className="font-bold text-slate-900 text-sm mt-1">
                  {visit.transportationDetails.distanceKm} km (Est: {visit.transportationDetails.estimatedTravelTime})
                </p>
                <p className="text-xs text-slate-500 mt-0.5 truncate">
                  {visit.transportationDetails.routeSummary}
                </p>
              </div>
            </div>

            {/* Pickup Points Table */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-2">Designated Pickup & Boarding Bays</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">Pickup Location</th>
                      <th className="p-3">Departure Timestamp</th>
                      <th className="p-3">Boarding Students</th>
                      <th className="p-3 text-right">Gate Marshal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visit.transportationDetails.pickupPoints.map((pt, i) => (
                      <tr key={i}>
                        <td className="p-3 font-semibold text-slate-900">{pt.name}</td>
                        <td className="p-3 font-mono font-bold text-blue-700">{pt.time}</td>
                        <td className="p-3">{pt.studentCount} students</td>
                        <td className="p-3 text-right text-slate-500">Student Rep / Faculty Chaperone</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Simulated Route Visualizer / Map Preview */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-teal-400" />
                  <span className="font-bold text-sm">Interactive Route Waypoint Preview</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-teal-300">
                  Google Maps Route Simulator
                </span>
              </div>

              {/* Waypoint timeline bar */}
              <div className="flex items-center justify-between text-xs pt-4 relative before:absolute before:top-6.5 before:left-6 before:right-6 before:h-0.5 before:bg-teal-500/30">
                <div className="relative z-10 text-center">
                  <div className="w-6 h-6 rounded-full bg-teal-400 text-slate-950 flex items-center justify-center font-bold text-xs mx-auto">
                    A
                  </div>
                  <div className="font-bold mt-2">Campus Terminal</div>
                  <div className="text-[10px] text-slate-400">{visit.departureTime}</div>
                </div>

                <div className="relative z-10 text-center">
                  <div className="w-6 h-6 rounded-full bg-blue-400 text-slate-950 flex items-center justify-center font-bold text-xs mx-auto">
                    B
                  </div>
                  <div className="font-bold mt-2">Highway Junction</div>
                  <div className="text-[10px] text-slate-400">+40 mins</div>
                </div>

                <div className="relative z-10 text-center">
                  <div className="w-6 h-6 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-xs mx-auto">
                    C
                  </div>
                  <div className="font-bold mt-2">{visit.companyName}</div>
                  <div className="text-[10px] text-slate-400">Arrival Gate 1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SANCTIONS & APPROVALS WORKFLOW */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Administrative Approval History & Audit Trail
              </h3>
              <p className="text-xs text-slate-500">
                Deanery sanctions, financial approvals, and reviewer remarks
              </p>
            </div>

            {/* Current Status Box */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-blue-600 shadow-xs shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">Sanction Status:</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusBadgeColors[visit.status]}`}>
                    {visit.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{visit.notes}</p>
                {approvalItem?.reviewedBy && (
                  <div className="text-[11px] text-slate-500 pt-1">
                    Reviewed by <span className="font-semibold text-slate-800">{approvalItem.reviewedBy}</span> on {approvalItem.reviewedAt}
                  </div>
                )}
                {approvalItem?.rejectionReason && (
                  <div className="text-xs text-rose-700 font-semibold pt-1">
                    Rejection Grounds: {approvalItem.rejectionReason}
                  </div>
                )}
              </div>
            </div>

            {/* Submission history items */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Audit Chronology</h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="p-3.5 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-slate-900">Proposal Created</span>
                  </div>
                  <span className="text-slate-400">{visit.createdAt}</span>
                </div>

                {approvalItem && (
                  <div className="p-3.5 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="font-bold text-slate-900">Submitted for Sanction by {approvalItem.facultyName}</span>
                    </div>
                    <span className="text-slate-400">{approvalItem.submittedAt}</span>
                  </div>
                )}

                {approvalItem?.reviewedAt && (
                  <div className="p-3.5 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${approvalItem.status === 'Approved' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      <span className="font-bold text-slate-900">
                        {approvalItem.status === 'Approved' ? 'Dean Approval Granted' : 'Proposal Rejected'} ({approvalItem.reviewedBy})
                      </span>
                    </div>
                    <span className="text-slate-400">{approvalItem.reviewedAt}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SAFETY & QUESTIONS */}
      {activeTab === 'safety' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Industrial Safety Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {visit.safetyGuidelines.map((g, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 text-xs text-rose-950 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{g}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && approvalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Reject Proposal Request</h3>
            <p className="text-xs text-slate-500">
              Provide feedback and reasons so the faculty coordinator can revise the budget or schedule.
            </p>

            <textarea
              rows={3}
              required
              placeholder="e.g. Budget exceeds departmental cap; please explore institutional college buses instead of private contractor."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  reviewApproval(approvalItem.id, 'Rejected', 'Rejected during audit review', rejectionReason);
                  setIsRejectModalOpen(false);
                }}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
