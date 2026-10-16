import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Building,
  Calendar,
  Users,
  IndianRupee,
  Eye,
  Send,
  AlertTriangle,
  X,
  MessageSquare,
  FileCheck,
} from 'lucide-react';
import { ApprovalRequest } from '../types';

export const ApprovalsView: React.FC = () => {
  const {
    approvals,
    visits,
    currentUser,
    reviewApproval,
    viewVisitDetails,
    confirmVisitWithCompany,
    showToast,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('all');
  const [selectedApprovalForReject, setSelectedApprovalForReject] = useState<ApprovalRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminRemarks, setAdminRemarks] = useState('');

  const filteredApprovals = approvals.filter((a) => {
    if (activeFilter === 'all') return true;
    return a.status === activeFilter;
  });

  const pendingCount = approvals.filter((a) => a.status === 'Pending').length;
  const approvedCount = approvals.filter((a) => a.status === 'Approved').length;
  const rejectedCount = approvals.filter((a) => a.status === 'Rejected').length;

  const handleApprove = (approval: ApprovalRequest) => {
    reviewApproval(approval.id, 'Approved', adminRemarks || 'Proposal sanctioned by Deanery of Academic Affairs.');
    setAdminRemarks('');
  };

  const handleConfirmReject = () => {
    if (!selectedApprovalForReject) return;
    if (!rejectionReason.trim()) {
      showToast('Rejection reason is required.', 'error');
      return;
    }
    reviewApproval(
      selectedApprovalForReject.id,
      'Rejected',
      'Proposal requires revision as per audit notes.',
      rejectionReason
    );
    setSelectedApprovalForReject(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Administrative Sanctions & Approval Requests
            </h1>
            {pendingCount > 0 && (
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                {pendingCount} Pending Review
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Review proposed departmental industrial tours, audit financial estimates, and maintain compliance records.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(['all', 'Pending', 'Approved', 'Rejected'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeFilter === filter
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter === 'all' ? `All (${approvals.length})` : `${filter}`}
            </button>
          ))}
        </div>
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.map((appr) => {
          const visitMatch = visits.find((v) => v.id === appr.visitId);

          const statusBadge = {
            Pending: 'bg-amber-50 text-amber-700 border-amber-300',
            Approved: 'bg-emerald-50 text-emerald-700 border-emerald-300',
            Rejected: 'bg-rose-50 text-rose-700 border-rose-300',
          }[appr.status];

          return (
            <div
              key={appr.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-5 sm:p-6 space-y-4"
            >
              {/* Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl border ${
                      appr.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : appr.status === 'Rejected'
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}
                  >
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${statusBadge}`}>
                        {appr.status}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{appr.department}</span>
                    </div>
                    <h3
                      onClick={() => viewVisitDetails(appr.visitId)}
                      className="font-bold text-slate-900 text-base hover:text-blue-600 cursor-pointer transition-colors mt-0.5"
                    >
                      {appr.visitTitle}
                    </h3>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs text-slate-400">
                  <div>Submitted on {appr.submittedAt}</div>
                  <div className="font-semibold text-slate-700">Lead: {appr.facultyName}</div>
                </div>
              </div>

              {/* Metadata Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Proposed Date</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{appr.proposedDate}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Student Quota</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{appr.studentCount} Students</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Budget Sanction</span>
                  <p className="font-semibold text-slate-800 mt-0.5 font-mono">
                    ₹{appr.estimatedBudget.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Company Status</span>
                  <p className="font-semibold text-blue-700 mt-0.5 truncate">
                    {visitMatch?.status || 'Pending'}
                  </p>
                </div>
              </div>

              {/* Remarks or Rejection reasons */}
              {appr.remarks && (
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/60 text-xs text-blue-950 flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Faculty Remarks:</span> {appr.remarks}
                  </div>
                </div>
              )}

              {appr.rejectionReason && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950 flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Rejection Reason:</span> {appr.rejectionReason}
                  </div>
                </div>
              )}

              {/* Bottom Action bar */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => viewVisitDetails(appr.visitId)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  <Eye className="w-3.5 h-3.5" /> Inspect Full Itinerary & Documents
                </button>

                {/* Admin Actions */}
                {currentUser.role === 'admin' && appr.status === 'Pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(appr)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
                    >
                      Approve Sanction
                    </button>
                    <button
                      onClick={() => setSelectedApprovalForReject(appr)}
                      className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all"
                    >
                      Reject with Reason...
                    </button>
                  </div>
                )}

                {/* Faculty Move to Company Confirmation if Approved */}
                {currentUser.role !== 'student' && appr.status === 'Approved' && visitMatch?.status === 'Approved' && (
                  <button
                    onClick={() => confirmVisitWithCompany(appr.visitId)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
                  >
                    Move to Host Company Confirmation →
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredApprovals.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
            <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No approval records in this category</h3>
            <p className="text-xs text-slate-500 mt-1">
              All departmental proposals are current. New submissions from faculty will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {selectedApprovalForReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">Reject Proposal Request</h3>
              <button
                onClick={() => setSelectedApprovalForReject(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              State the specific issues (e.g., budget ceiling breach, exam schedule clash, transit safety audit) so the coordinator can modify the plan.
            </p>

            <textarea
              rows={4}
              required
              placeholder="e.g. The proposed dates clash with 3rd-year mid-semester laboratory exams. Please reschedule for the following weekend."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedApprovalForReject(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md"
              >
                Confirm & Return to Faculty
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
