import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Visit, VisitStatus } from '../types';
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  MapPin,
  Clock,
  Users,
  Copy,
  Trash2,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  Building,
  Table as TableIcon,
  LayoutGrid,
  Calendar,
  X,
  FileCheck,
} from 'lucide-react';

export const VisitManagementView: React.FC = () => {
  const {
    visits,
    companies,
    currentUser,
    createVisit,
    duplicateVisit,
    deleteVisit,
    submitVisitForApproval,
    viewVisitDetails,
    registerForVisit,
    registrations,
    showToast,
  } = useApp();

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Create Visit Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newVisitForm, setNewVisitForm] = useState({
    title: '',
    companyId: companies[0]?.id || '',
    department: currentUser.department || 'Mechanical & Automation Engineering',
    semester: '6th Semester (3rd Year)',
    visitDate: '2026-11-20',
    returnDate: '2026-11-20',
    departureTime: '07:30 AM',
    returnTime: '06:30 PM',
    assemblyPoint: 'Campus Central Bay',
    studentCapacity: 50,
    registrationDeadline: '2026-11-10',
    estimatedBudgetPerStudent: 1000,
    notes: '',
  });

  const filteredVisits = useMemo(() => {
    return visits.filter((v) => {
      const matchesSearch =
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
      const matchesDept = departmentFilter === 'all' || v.department.toLowerCase().includes(departmentFilter.toLowerCase());
      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [visits, searchQuery, statusFilter, departmentFilter]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const comp = companies.find((c) => c.id === newVisitForm.companyId) || companies[0];

    const studentCount = Number(newVisitForm.studentCapacity) || 45;
    const transportEst = 18000;
    const foodEst = studentCount * 250;
    const miscEst = 3000;
    const contingency = Math.round((transportEst + foodEst + miscEst) * 0.08);
    const totalCost = transportEst + foodEst + miscEst + contingency;
    const costPerStudent = Math.round(totalCost / studentCount);

    const newId = createVisit({
      title: newVisitForm.title || `Industrial Visit to ${comp.name}`,
      companyId: comp.id,
      companyName: comp.name,
      companySector: comp.sector,
      companyLocation: comp.location,
      department: newVisitForm.department,
      semester: newVisitForm.semester,
      visitDate: newVisitForm.visitDate,
      returnDate: newVisitForm.returnDate,
      departureTime: newVisitForm.departureTime,
      returnTime: newVisitForm.returnTime,
      assemblyPoint: newVisitForm.assemblyPoint,
      studentCapacity: studentCount,
      registrationDeadline: newVisitForm.registrationDeadline,
      status: 'Draft',
      notes: newVisitForm.notes || 'Created via faculty management console.',
      budgetEstimate: {
        transportCost: transportEst,
        foodCost: foodEst,
        entryFee: 0,
        accommodationCost: 0,
        miscCost: miscEst,
        facultyDA: 2000,
        studentCount,
        contingencyPercent: 8,
        contingencyCost: contingency,
        totalCost,
        costPerStudent,
        collegeSubsidy: Math.round(totalCost * 0.2),
        studentPayable: Math.round(costPerStudent * 0.8),
      },
      facultyCoordinatorId: currentUser.id,
      facultyCoordinatorName: currentUser.name,
      facultyCoordinatorEmail: currentUser.email,
      facultyCoordinatorPhone: currentUser.phone,
      transportationDetails: {
        vehicleType: 'College Institutional 50-Seater AC Bus',
        vehicleNumber: 'Pending Fleet Assignment',
        seatingCapacity: studentCount + 5,
        agencyName: 'Apex Transport Division',
        driverName: 'To be assigned',
        driverPhone: 'N/A',
        distanceKm: 45,
        estimatedTravelTime: '1 hr 15 min',
        routeSummary: `Campus -> Highway -> ${comp.location}`,
        pickupPoints: [{ name: newVisitForm.assemblyPoint, time: newVisitForm.departureTime, studentCount }],
      },
      itinerary: [
        {
          timeSlot: `${newVisitForm.departureTime} - 09:30 AM`,
          activity: 'Boarding & Transit',
          location: 'Campus to Industry Facility',
          details: 'Roll call and travel.',
        },
        {
          timeSlot: '09:45 AM - 12:45 PM',
          activity: 'Plant Tour & Technical Briefing',
          location: 'Main Engineering Bay',
          details: 'Guided inspection of operations.',
        },
        {
          timeSlot: '01:00 PM - 02:00 PM',
          activity: 'Lunch & Student Networking',
          location: 'Cafeteria',
          details: 'Interaction with young engineers.',
        },
        {
          timeSlot: '02:15 PM - 04:00 PM',
          activity: 'Technical Deep-Dive Seminar',
          location: 'Auditorium',
          details: 'Q&A session with senior technical directors.',
        },
        {
          timeSlot: `04:15 PM - ${newVisitForm.returnTime}`,
          activity: 'Return Journey to Campus',
          location: 'Industry to Campus',
          details: 'Safe return and dispersal.',
        },
      ],
      learningObjectives: [
        `Understand process flows and production quality management at ${comp.name}.`,
        'Interact with senior engineering leaders to understand industry career competencies.',
      ],
      safetyGuidelines: [
        'Closed-toe safety shoes mandatory.',
        'Always follow designated yellow pedestrian lines.',
      ],
    });

    setIsCreateModalOpen(false);
    viewVisitDetails(newId);
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
      {/* Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Industrial Visit Management
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {visits.length} Tours
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Create, track sanction approvals, manage student capacities, and schedule transportation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle view mode */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-semibold ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          {currentUser.role !== 'student' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" /> Create Visit Plan
            </button>
          )}
        </div>
      </div>

      {/* Filters row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search visits by title, company, or department..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Statuses ({visits.length})</option>
            <option value="Draft">Draft</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="Confirmed with Company">Confirmed with Company</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-hidden"
          >
            <option value="all">All Departments</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Computer">Computer Science</option>
            <option value="Robotics">Robotics</option>
            <option value="Electronics">Electronics</option>
          </select>
        </div>
      </div>

      {/* CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVisits.map((visit) => {
            const isRegistered = registrations.some(
              (r) => r.visitId === visit.id && r.studentId === currentUser.id && r.status !== 'Cancelled'
            );

            return (
              <div
                key={visit.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 space-y-3">
                  {/* Top line: Status & Department */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        statusBadgeColors[visit.status]
                      }`}
                    >
                      {visit.status}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[140px]">
                      {visit.semester}
                    </span>
                  </div>

                  {/* Visit Title */}
                  <h3
                    onClick={() => viewVisitDetails(visit.id)}
                    className="font-bold text-slate-900 text-base leading-snug hover:text-blue-600 cursor-pointer transition-colors line-clamp-2"
                  >
                    {visit.title}
                  </h3>

                  {/* Company & Location */}
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{visit.companyName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{visit.companyLocation || 'Location on request'}</span>
                    </div>
                  </div>

                  {/* Metadata Chips: Date, Time, Capacity */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Date</span>
                      <p className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        {visit.visitDate}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Quota</span>
                      <p className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        {visit.registeredCount} / {visit.studentCapacity} Seats
                      </p>
                    </div>
                  </div>

                  {/* Estimated Cost & Deadline */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Est: ₹{visit.budgetEstimate?.costPerStudent} / student</span>
                    <span>Deadline: {visit.registrationDeadline}</span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => viewVisitDetails(visit.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Dossier
                  </button>

                  <div className="flex items-center gap-1.5">
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

                    {currentUser.role !== 'student' && (
                      <>
                        {visit.status === 'Draft' && (
                          <button
                            onClick={() => submitVisitForApproval(visit.id)}
                            title="Submit for Administrative Sanction"
                            className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => duplicateVisit(visit.id)}
                          title="Duplicate Visit Plan"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => deleteVisit(visit.id)}
                            title="Delete Visit"
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5">Visit Details</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Visit Date</th>
                  <th className="p-3.5">Quota</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Cost/Student</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVisits.map((visit) => (
                  <tr key={visit.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 max-w-xs">
                      <div
                        onClick={() => viewVisitDetails(visit.id)}
                        className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1"
                      >
                        {visit.title}
                      </div>
                      <div className="text-slate-500 text-[11px]">{visit.companyName}</div>
                    </td>
                    <td className="p-3.5 text-slate-600">{visit.department}</td>
                    <td className="p-3.5 font-medium text-slate-900 whitespace-nowrap">
                      {visit.visitDate}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="font-semibold text-slate-900">{visit.registeredCount}</span>
                      <span className="text-slate-400"> / {visit.studentCapacity}</span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          statusBadgeColors[visit.status]
                        }`}
                      >
                        {visit.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-700 whitespace-nowrap">
                      ₹{visit.budgetEstimate?.costPerStudent}
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => viewVisitDetails(visit.id)}
                          className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold"
                        >
                          View
                        </button>
                        {currentUser.role !== 'student' && (
                          <button
                            onClick={() => duplicateVisit(visit.id)}
                            className="p-1 rounded-md text-slate-500 hover:bg-slate-100"
                            title="Duplicate"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredVisits.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <CalendarDays className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No visits match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting filters or creating a new visit.</p>
        </div>
      )}

      {/* Create Visit Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">Schedule New Industrial Visit</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Visit Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Motors EV Assembly Shopfloor Inspection"
                  value={newVisitForm.title}
                  onChange={(e) => setNewVisitForm({ ...newVisitForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Host Company *</label>
                <select
                  value={newVisitForm.companyId}
                  onChange={(e) => setNewVisitForm({ ...newVisitForm, companyId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.sector} - {c.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department *</label>
                  <select
                    value={newVisitForm.department}
                    onChange={(e) => setNewVisitForm({ ...newVisitForm, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="Mechanical & Automation Engineering">Mechanical & Automation</option>
                    <option value="Computer Science & Engineering">Computer Science</option>
                    <option value="Robotics & Mechatronics">Robotics & Mechatronics</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Batch / Semester *</label>
                  <input
                    type="text"
                    value={newVisitForm.semester}
                    onChange={(e) => setNewVisitForm({ ...newVisitForm, semester: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Proposed Date *</label>
                  <input
                    type="date"
                    required
                    value={newVisitForm.visitDate}
                    onChange={(e) =>
                      setNewVisitForm({
                        ...newVisitForm,
                        visitDate: e.target.value,
                        returnDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Registration Cutoff *</label>
                  <input
                    type="date"
                    required
                    value={newVisitForm.registrationDeadline}
                    onChange={(e) => setNewVisitForm({ ...newVisitForm, registrationDeadline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Capacity *</label>
                  <input
                    type="number"
                    min={10}
                    max={120}
                    required
                    value={newVisitForm.studentCapacity}
                    onChange={(e) => setNewVisitForm({ ...newVisitForm, studentCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assembly Location</label>
                  <input
                    type="text"
                    value={newVisitForm.assemblyPoint}
                    onChange={(e) => setNewVisitForm({ ...newVisitForm, assemblyPoint: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Coordinator Notes</label>
                <textarea
                  rows={2}
                  placeholder="Special instructions or initial permissions obtained..."
                  value={newVisitForm.notes}
                  onChange={(e) => setNewVisitForm({ ...newVisitForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 -mx-6 -mb-6 mt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
                >
                  Create Visit Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
