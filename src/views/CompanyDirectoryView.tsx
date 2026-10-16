import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Company } from '../types';
import {
  Building2,
  Search,
  Filter,
  MapPin,
  Users,
  ExternalLink,
  Mail,
  Phone,
  Sparkles,
  Plus,
  ShieldAlert,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Tag,
  Briefcase,
  X,
} from 'lucide-react';

export const CompanyDirectoryView: React.FC = () => {
  const { companies, addCompany, setActiveTab, currentUser, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedBookingStatus, setSelectedBookingStatus] = useState<string>('all');
  const [selectedCompanyModal, setSelectedCompanyModal] = useState<Company | null>(null);

  // Add Company Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompanyForm, setNewCompanyForm] = useState({
    name: '',
    sector: 'Automotive & Electric Vehicles',
    location: '',
    address: '',
    description: '',
    visitTypes: 'Plant Tour, Technical Q&A',
    technologies: 'Robotics, IoT, Quality Assurance',
    capacity: 50,
    contactPerson: '',
    contactEmail: '',
    website: 'https://',
    requirements: 'Safety shoes, College ID, Non-Disclosure Agreement',
    bookingStatus: 'Advance Notice Required' as Company['bookingStatus'],
    eligibleDepartments: 'Mechanical Engineering, Electronics',
  });

  // Extract unique filter options
  const sectors = useMemo(() => {
    const set = new Set(companies.map((c) => c.sector));
    return Array.from(set);
  }, [companies]);

  const locations = useMemo(() => {
    const locs = companies.map((c) => c.location.split(',')[0].trim());
    return Array.from(new Set(locs));
  }, [companies]);

  const departments = useMemo(() => {
    const all = companies.flatMap((c) => c.eligibleDepartments);
    return Array.from(new Set(all));
  }, [companies]);

  // Filtered companies
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector = selectedSector === 'all' || c.sector === selectedSector;
      const matchesLocation =
        selectedLocation === 'all' || c.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesDept =
        selectedDepartment === 'all' ||
        c.eligibleDepartments.some((d) => d.toLowerCase().includes(selectedDepartment.toLowerCase()));
      const matchesStatus =
        selectedBookingStatus === 'all' || c.bookingStatus === selectedBookingStatus;

      return matchesSearch && matchesSector && matchesLocation && matchesDept && matchesStatus;
    });
  }, [companies, searchQuery, selectedSector, selectedLocation, selectedDepartment, selectedBookingStatus]);

  const handlePlanWithAi = (company: Company) => {
    // Save selection in session/local storage for AI Planner prefill
    sessionStorage.setItem(
      'ivp_prefill_ai_planner',
      JSON.stringify({
        companyName: company.name,
        preferredIndustry: company.sector,
        preferredCity: company.location,
        learningObjectives: `Hands-on exposure to ${company.technologies.join(', ')} and plant operations.`,
        studentCount: company.capacity,
      })
    );
    showToast(`Loaded ${company.name} parameters into AI Visit Planner!`, 'info');
    setActiveTab('ai-planner');
  };

  const handleCreateCompanySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyForm.name || !newCompanyForm.location) {
      showToast('Please fill in company name and location.', 'error');
      return;
    }

    addCompany({
      name: newCompanyForm.name,
      sector: newCompanyForm.sector,
      location: newCompanyForm.location,
      address: newCompanyForm.address || `${newCompanyForm.location} Industrial Area`,
      description: newCompanyForm.description || 'Enterprise industry facility partnering with universities.',
      visitTypes: newCompanyForm.visitTypes.split(',').map((s) => s.trim()),
      technologies: newCompanyForm.technologies.split(',').map((s) => s.trim()),
      capacity: Number(newCompanyForm.capacity) || 50,
      contactPerson: newCompanyForm.contactPerson || 'Industrial HR & Training Division',
      contactEmail: newCompanyForm.contactEmail || `contact@${newCompanyForm.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      website: newCompanyForm.website,
      requirements: newCompanyForm.requirements.split(',').map((s) => s.trim()),
      bookingStatus: newCompanyForm.bookingStatus,
      eligibleDepartments: newCompanyForm.eligibleDepartments.split(',').map((s) => s.trim()),
      isDemo: true,
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Call to action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Industry & Company Directory
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {companies.length} Registered
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Search vetted industrial establishments across automotive, software, robotics, and defense sectors.
          </p>
        </div>

        {currentUser.role !== 'student' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Host Industry
          </button>
        )}
      </div>

      {/* Demo notice banner */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">Academic Notice:</span> All companies in this directory are
          fictional or illustrative demo profiles designed for institutional planning exercises. Contact
          details and booking statuses are simulated. Verify visit permissions through official corporate channels.
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company name, technology (e.g. SLAM, SCADA, Cloud), sector, or city..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Dropdown filters grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {/* Sector filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Sector</label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="all">All Sectors ({sectors.length})</option>
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Location filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Region / City</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="all">All Cities ({locations.length})</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Department eligibility */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Target Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Booking Status */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">Visit Accessibility</label>
            <select
              value={selectedBookingStatus}
              onChange={(e) => setSelectedBookingStatus(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="Open for Visits">Open for Visits</option>
              <option value="Advance Notice Required">Advance Notice Required</option>
              <option value="Restricted Access">Restricted Access (MoD/Defense)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompanies.map((company) => {
          const statusColors: Record<string, string> = {
            'Open for Visits': 'bg-emerald-50 text-emerald-700 border-emerald-200',
            'Advance Notice Required': 'bg-amber-50 text-amber-700 border-amber-200',
            'Restricted Access': 'bg-rose-50 text-rose-700 border-rose-200',
          };

          return (
            <div
              key={company.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 font-black text-lg shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    {company.name.charAt(0)}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                      statusColors[company.bookingStatus] || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {company.bookingStatus}
                  </span>
                </div>

                {/* Company Name & Sector */}
                <div>
                  <h3
                    onClick={() => setSelectedCompanyModal(company)}
                    className="font-bold text-slate-900 text-base leading-snug hover:text-blue-600 cursor-pointer transition-colors line-clamp-1"
                  >
                    {company.name}
                  </h3>
                  <div className="text-xs font-semibold text-blue-600 mt-0.5">
                    {company.sector}
                  </div>
                </div>

                {/* Location & Capacity */}
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {company.location}
                  </span>
                  <span className="flex items-center gap-1 shrink-0">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Up to {company.capacity} students
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {company.description}
                </p>

                {/* Technologies learned */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Key Technologies & Learning Focus:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {company.technologies.slice(0, 3).map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                    {company.technologies.length > 3 && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
                        +{company.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedCompanyModal(company)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-200/60 rounded-lg transition-colors"
                >
                  View Details
                </button>

                {currentUser.role !== 'student' && (
                  <button
                    onClick={() => handlePlanWithAi(company)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-xs transition-all hover:scale-105"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Plan with AI
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No matching industries found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords or resetting filters to explore all sectors.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSector('all');
              setSelectedLocation('all');
              setSelectedDepartment('all');
              setSelectedBookingStatus('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Company Detail Modal */}
      {selectedCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center">
                  {selectedCompanyModal.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    {selectedCompanyModal.name}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600">
                    {selectedCompanyModal.sector} • {selectedCompanyModal.location}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCompanyModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto text-xs sm:text-sm">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Company Overview</h4>
                <p className="text-slate-600 leading-relaxed">
                  {selectedCompanyModal.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Address</span>
                  <p className="text-slate-800 font-medium mt-0.5">{selectedCompanyModal.address}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Batch Capacity</span>
                  <p className="text-slate-800 font-medium mt-0.5">
                    Up to {selectedCompanyModal.capacity} students + 3 faculty members
                  </p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Contact Representative</span>
                  <p className="text-slate-800 font-medium mt-0.5">{selectedCompanyModal.contactPerson}</p>
                  <p className="text-slate-500 text-xs">{selectedCompanyModal.contactEmail}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Official Portal</span>
                  <a
                    href={selectedCompanyModal.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline font-medium flex items-center gap-1 mt-0.5"
                  >
                    {selectedCompanyModal.website} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Available Visit Modules</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCompanyModal.visitTypes.map((vt, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200"
                    >
                      {vt}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Target Academic Departments</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCompanyModal.eligibleDepartments.map((dept, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium text-xs border border-emerald-200"
                    >
                      {dept}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Mandatory Entry Requirements & PPE</h4>
                <ul className="space-y-1.5">
                  {selectedCompanyModal.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedCompanyModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Close
              </button>
              {currentUser.role !== 'student' && (
                <button
                  onClick={() => {
                    const c = selectedCompanyModal;
                    setSelectedCompanyModal(null);
                    handlePlanWithAi(c);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" /> Plan Industrial Tour
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Host Industry Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base">Add Host Industry to Directory</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCompanySubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bosch Smart Engineering Campus"
                  value={newCompanyForm.name}
                  onChange={(e) => setNewCompanyForm({ ...newCompanyForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sector *</label>
                  <select
                    value={newCompanyForm.sector}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, sector: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="Automotive & Electric Vehicles">Automotive & Electric Vehicles</option>
                    <option value="IT & Cloud Computing">IT & Cloud Computing</option>
                    <option value="Manufacturing & Heavy Engineering">Manufacturing & Heavy Engineering</option>
                    <option value="Robotics & Supply Chain Logistics">Robotics & Supply Chain Logistics</option>
                    <option value="Electronics & Defense Aerospace">Electronics & Defense Aerospace</option>
                    <option value="Industrial Automation & IoT">Industrial Automation & IoT</option>
                    <option value="Telecommunications & 5G/6G Networks">Telecommunications & 5G</option>
                    <option value="Pharmaceutical & Biotechnology">Pharmaceutical & Biotechnology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location / City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune, Maharashtra"
                    value={newCompanyForm.location}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Facility summary, manufacturing operations, or specialized R&D cells..."
                  value={newCompanyForm.description}
                  onChange={(e) => setNewCompanyForm({ ...newCompanyForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Student Capacity</label>
                  <input
                    type="number"
                    value={newCompanyForm.capacity}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Booking Accessibility</label>
                  <select
                    value={newCompanyForm.bookingStatus}
                    onChange={(e) => setNewCompanyForm({ ...newCompanyForm, bookingStatus: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="Open for Visits">Open for Visits</option>
                    <option value="Advance Notice Required">Advance Notice Required</option>
                    <option value="Restricted Access">Restricted Access</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Key Technologies (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. PLC, SCADA, Computer Vision, Industrial AI"
                  value={newCompanyForm.technologies}
                  onChange={(e) => setNewCompanyForm({ ...newCompanyForm, technologies: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Eligible Departments (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mechanical Engineering, Computer Science"
                  value={newCompanyForm.eligibleDepartments}
                  onChange={(e) => setNewCompanyForm({ ...newCompanyForm, eligibleDepartments: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 -mx-6 -mb-6 mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
                >
                  Save Industry Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
