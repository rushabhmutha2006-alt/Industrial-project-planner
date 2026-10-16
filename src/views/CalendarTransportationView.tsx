import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarDays,
  Truck,
  MapPin,
  Clock,
  Phone,
  Users,
  Building,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Save,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const CalendarTransportationView: React.FC = () => {
  const { visits, viewVisitDetails, updateVisit, currentUser, showToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'calendar' | 'transport'>('calendar');
  const [selectedVisitId, setSelectedVisitId] = useState<string>(visits[0]?.id || '');
  const [isEditingTransport, setIsEditingTransport] = useState(false);

  const selectedVisit = visits.find((v) => v.id === selectedVisitId) || visits[0];

  // Editable transport form
  const [transportForm, setTransportForm] = useState({
    vehicleType: selectedVisit?.transportationDetails?.vehicleType || '',
    vehicleNumber: selectedVisit?.transportationDetails?.vehicleNumber || '',
    driverName: selectedVisit?.transportationDetails?.driverName || '',
    driverPhone: selectedVisit?.transportationDetails?.driverPhone || '',
    distanceKm: selectedVisit?.transportationDetails?.distanceKm || 0,
    estimatedTravelTime: selectedVisit?.transportationDetails?.estimatedTravelTime || '',
    routeSummary: selectedVisit?.transportationDetails?.routeSummary || '',
  });

  const handleSelectVisitForTransport = (visitId: string) => {
    setSelectedVisitId(visitId);
    const v = visits.find((x) => x.id === visitId);
    if (v) {
      setTransportForm({
        vehicleType: v.transportationDetails.vehicleType,
        vehicleNumber: v.transportationDetails.vehicleNumber,
        driverName: v.transportationDetails.driverName,
        driverPhone: v.transportationDetails.driverPhone,
        distanceKm: v.transportationDetails.distanceKm,
        estimatedTravelTime: v.transportationDetails.estimatedTravelTime,
        routeSummary: v.transportationDetails.routeSummary,
      });
      setIsEditingTransport(false);
    }
  };

  const handleSaveTransport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisit) return;

    updateVisit(selectedVisit.id, {
      transportationDetails: {
        ...selectedVisit.transportationDetails,
        ...transportForm,
      },
    });
    setIsEditingTransport(false);
    showToast('Transportation & Fleet details updated successfully.', 'success');
  };

  // Calendar dates representation
  const calendarMonths = [
    { name: 'November 2026', days: 30, startDay: 0 },
    { name: 'December 2026', days: 31, startDay: 2 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Calendar & Transportation Logistics
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Institutional Fleet
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track tour departure schedules, vehicle assignments, pickup waypoints, and driver contacts.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveSubTab('calendar')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'calendar'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" /> Calendar View
          </button>
          <button
            onClick={() => setActiveSubTab('transport')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeSubTab === 'transport'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-3.5 h-3.5" /> Fleet & Routes
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CALENDAR VIEW */}
      {activeSubTab === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Calendar Grid (8 cols) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base">
                Upcoming Academic Tours • Q4 2026
              </h3>
              <span className="text-xs text-slate-500">Dates highlighted by department</span>
            </div>

            <div className="space-y-6">
              {calendarMonths.map((m) => (
                <div key={m.name} className="space-y-3">
                  <div className="font-bold text-sm text-blue-700 bg-blue-50/70 px-3 py-1.5 rounded-lg inline-block">
                    {m.name}
                  </div>

                  <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                      <div key={d} className="p-1 font-bold text-slate-400 text-[11px] uppercase">
                        {d}
                      </div>
                    ))}

                    {/* Empty padding days */}
                    {Array.from({ length: m.startDay }).map((_, i) => (
                      <div key={`pad-${i}`} className="p-2 text-slate-300 bg-slate-50/40 rounded-lg" />
                    ))}

                    {/* Month days */}
                    {Array.from({ length: m.days }).map((_, i) => {
                      const dayNumber = i + 1;
                      const dayStr = dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`;
                      const isNov = m.name.includes('November');
                      const fullDate = isNov ? `2026-11-${dayStr}` : `2026-12-${dayStr}`;

                      const matchingVisits = visits.filter((v) => v.visitDate === fullDate);
                      const hasVisit = matchingVisits.length > 0;

                      return (
                        <div
                          key={dayNumber}
                          onClick={() => {
                            if (hasVisit) {
                              viewVisitDetails(matchingVisits[0].id);
                            }
                          }}
                          className={`p-2 min-h-[52px] rounded-xl border flex flex-col justify-between text-left transition-all ${
                            hasVisit
                              ? 'bg-blue-50/90 border-blue-300 cursor-pointer hover:scale-105 hover:shadow-md'
                              : 'bg-white border-slate-100 text-slate-600'
                          }`}
                        >
                          <span className={`text-[11px] font-bold ${hasVisit ? 'text-blue-700 font-black' : 'text-slate-400'}`}>
                            {dayNumber}
                          </span>

                          {hasVisit && (
                            <div className="text-[10px] font-bold text-blue-900 bg-white/90 p-1 rounded-md shadow-2xs truncate">
                              {matchingVisits[0].companyName.split(' ')[0]}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Tour Chronology Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Scheduled Departures</h3>
            <div className="space-y-3">
              {visits.map((v) => (
                <div
                  key={v.id}
                  onClick={() => viewVisitDetails(v.id)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-slate-50 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-blue-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {v.visitDate}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {v.departureTime}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs truncate">{v.title}</h4>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>{v.companyName}</span>
                    <span>{v.registeredCount} / {v.studentCapacity} seats</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: TRANSPORTATION & FLEET MANAGEMENT */}
      {activeSubTab === 'transport' && selectedVisit && (
        <div className="space-y-6">
          {/* Select Visit Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase shrink-0">Select Tour:</span>
            {visits.map((v) => (
              <button
                key={v.id}
                onClick={() => handleSelectVisitForTransport(v.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedVisit.id === v.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {v.companyName.split(' ')[0]} ({v.visitDate})
              </button>
            ))}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Fleet & Route Logistics: {selectedVisit.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Assembly at {selectedVisit.assemblyPoint} • Total Distance: {selectedVisit.transportationDetails.distanceKm} km
                </p>
              </div>

              {currentUser.role !== 'student' && !isEditingTransport && (
                <button
                  onClick={() => setIsEditingTransport(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit Fleet Details
                </button>
              )}
            </div>

            {/* Editable Form or Readonly View */}
            {isEditingTransport ? (
              <form onSubmit={handleSaveTransport} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Vehicle Type & Spec</label>
                    <input
                      type="text"
                      required
                      value={transportForm.vehicleType}
                      onChange={(e) => setTransportForm({ ...transportForm, vehicleType: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Vehicle Registration No.</label>
                    <input
                      type="text"
                      required
                      value={transportForm.vehicleNumber}
                      onChange={(e) => setTransportForm({ ...transportForm, vehicleNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Driver Name</label>
                    <input
                      type="text"
                      required
                      value={transportForm.driverName}
                      onChange={(e) => setTransportForm({ ...transportForm, driverName: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Driver Mobile Phone</label>
                    <input
                      type="text"
                      required
                      value={transportForm.driverPhone}
                      onChange={(e) => setTransportForm({ ...transportForm, driverPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Distance (km)</label>
                    <input
                      type="number"
                      required
                      value={transportForm.distanceKm}
                      onChange={(e) => setTransportForm({ ...transportForm, distanceKm: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Estimated Travel Time</label>
                    <input
                      type="text"
                      required
                      value={transportForm.estimatedTravelTime}
                      onChange={(e) => setTransportForm({ ...transportForm, estimatedTravelTime: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Route Summary</label>
                    <input
                      type="text"
                      required
                      value={transportForm.routeSummary}
                      onChange={(e) => setTransportForm({ ...transportForm, routeSummary: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingTransport(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Vehicles</span>
                  <p className="font-bold text-slate-900 text-sm mt-1">{selectedVisit.transportationDetails.vehicleType}</p>
                  <p className="text-xs text-blue-700 font-mono mt-0.5">Reg: {selectedVisit.transportationDetails.vehicleNumber}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Driver Contact</span>
                  <p className="font-bold text-slate-900 text-sm mt-1">{selectedVisit.transportationDetails.driverName}</p>
                  <p className="text-xs text-emerald-700 font-mono mt-0.5">{selectedVisit.transportationDetails.driverPhone}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Route Details</span>
                  <p className="font-bold text-slate-900 text-sm mt-1">
                    {selectedVisit.transportationDetails.distanceKm} km ({selectedVisit.transportationDetails.estimatedTravelTime})
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{selectedVisit.transportationDetails.routeSummary}</p>
                </div>
              </div>
            )}

            {/* Boarding Points */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-2">Pickup Bays & Student Allocation</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                    <tr>
                      <th className="p-3">Designated Pickup Bay</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Students Boarding</th>
                      <th className="p-3 text-right">Escort</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedVisit.transportationDetails.pickupPoints.map((pt, i) => (
                      <tr key={i}>
                        <td className="p-3 font-semibold text-slate-900">{pt.name}</td>
                        <td className="p-3 font-mono font-bold text-blue-700">{pt.time}</td>
                        <td className="p-3">{pt.studentCount} students</td>
                        <td className="p-3 text-right text-slate-500">Faculty Chaperone</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
