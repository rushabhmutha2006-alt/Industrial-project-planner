import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Company,
  Visit,
  StudentRegistration,
  ApprovalRequest,
  NotificationItem,
  AppTab,
  BudgetBreakdown,
} from '../types';
import {
  DEMO_USERS,
  DEMO_COMPANIES,
  DEMO_VISITS,
  DEMO_REGISTRATIONS,
  DEMO_APPROVALS,
  DEMO_NOTIFICATIONS,
} from '../data/mockData';

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  loginUser: (user: Partial<User>) => void;
  logout: () => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  selectedVisitId: string | null;
  setSelectedVisitId: (id: string | null) => void;
  viewVisitDetails: (visitId: string) => void;

  companies: Company[];
  addCompany: (comp: Omit<Company, 'id'>) => string;
  updateCompany: (id: string, updates: Partial<Company>) => void;

  visits: Visit[];
  createVisit: (visit: Omit<Visit, 'id' | 'createdAt' | 'updatedAt' | 'registeredCount'>) => string;
  updateVisit: (id: string, updates: Partial<Visit>) => void;
  deleteVisit: (id: string) => void;
  duplicateVisit: (id: string) => string;

  registrations: StudentRegistration[];
  registerForVisit: (visitId: string, studentInfo?: Partial<StudentRegistration>) => { success: boolean; message: string };
  cancelRegistration: (registrationId: string) => void;
  updateAttendance: (registrationId: string, status: 'Attended' | 'Absent') => void;
  batchImportRegistrations: (visitId: string, newStudents: { name: string; rollNumber: string; department: string; classYear: string; email: string; phone: string }[]) => number;

  approvals: ApprovalRequest[];
  submitVisitForApproval: (visitId: string, remarks?: string) => void;
  reviewApproval: (approvalId: string, decision: 'Approved' | 'Rejected', remarks?: string, rejectionReason?: string) => void;
  confirmVisitWithCompany: (visitId: string) => void;
  completeVisit: (visitId: string, actualExp?: BudgetBreakdown['actualExpenditure']) => void;

  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  sendNotification: (n: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => void;

  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER_ROLE: 'ivp_user_role',
  COMPANIES: 'ivp_companies_v1',
  VISITS: 'ivp_visits_v1',
  REGISTRATIONS: 'ivp_registrations_v1',
  APPROVALS: 'ivp_approvals_v1',
  NOTIFICATIONS: 'ivp_notifications_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user / role state
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedRole = (localStorage.getItem(STORAGE_KEYS.USER_ROLE) as UserRole) || 'faculty';
    return DEMO_USERS[savedRole] || DEMO_USERS.faculty;
  });

  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);

  // Entities with LocalStorage caching
  const [companies, setCompanies] = useState<Company[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    return cached ? JSON.parse(cached) : DEMO_COMPANIES;
  });

  const [visits, setVisits] = useState<Visit[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEYS.VISITS);
    return cached ? JSON.parse(cached) : DEMO_VISITS;
  });

  const [registrations, setRegistrations] = useState<StudentRegistration[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    return cached ? JSON.parse(cached) : DEMO_REGISTRATIONS;
  });

  const [approvals, setApprovals] = useState<ApprovalRequest[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEYS.APPROVALS);
    return cached ? JSON.parse(cached) : DEMO_APPROVALS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const cached = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return cached ? JSON.parse(cached) : DEMO_NOTIFICATIONS;
  });

  const [toast, setToast] = useState<ToastState | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits));
  }, [visits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(approvals));
  }, [approvals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 4000);
  };

  const switchRole = (role: UserRole) => {
    const user = DEMO_USERS[role];
    if (user) {
      setCurrentUser(user);
      localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
      showToast(`Switched active profile to ${user.name} (${role.toUpperCase()})`, 'info');
    }
  };

  const loginUser = (userOverrides: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...userOverrides }));
    showToast(`Welcome, ${userOverrides.name || currentUser.name}!`, 'success');
  };

  const logout = () => {
    switchRole('student');
    showToast('Signed out of session. Switched to public guest mode.', 'info');
  };

  const viewVisitDetails = (visitId: string) => {
    setSelectedVisitId(visitId);
    setActiveTab('visit-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Company management
  const addCompany = (comp: Omit<Company, 'id'>): string => {
    const newId = `comp_${Date.now()}`;
    const newCompany: Company = { ...comp, id: newId };
    setCompanies((prev) => [newCompany, ...prev]);
    showToast(`Added ${newCompany.name} to Industry Directory!`, 'success');
    return newId;
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    showToast('Company details updated.', 'success');
  };

  // Visit management
  const createVisit = (
    visitData: Omit<Visit, 'id' | 'createdAt' | 'updatedAt' | 'registeredCount'>
  ): string => {
    const newId = `visit_${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    const newVisit: Visit = {
      ...visitData,
      id: newId,
      registeredCount: 0,
      createdAt: today,
      updatedAt: today,
    };
    setVisits((prev) => [newVisit, ...prev]);
    showToast(`Visit "${newVisit.title}" created successfully!`, 'success');

    sendNotification({
      recipientRole: 'faculty',
      title: 'New Visit Created',
      message: `Visit "${newVisit.title}" is in Draft mode. Ready for review or submission.`,
      type: 'schedule',
      visitId: newId,
    });

    return newId;
  };

  const updateVisit = (id: string, updates: Partial<Visit>) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              ...updates,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : v
      )
    );
    showToast('Visit details updated successfully.', 'success');
  };

  const deleteVisit = (id: string) => {
    const target = visits.find((v) => v.id === id);
    setVisits((prev) => prev.filter((v) => v.id !== id));
    setRegistrations((prev) => prev.filter((r) => r.visitId !== id));
    setApprovals((prev) => prev.filter((a) => a.visitId !== id));
    if (selectedVisitId === id) {
      setSelectedVisitId(null);
      setActiveTab('visits');
    }
    showToast(`Visit "${target?.title || id}" deleted.`, 'info');
  };

  const duplicateVisit = (id: string): string => {
    const source = visits.find((v) => v.id === id);
    if (!source) return '';
    const newId = `visit_${Date.now()}`;
    const today = new Date().toISOString().split('T')[0];
    const cloned: Visit = {
      ...source,
      id: newId,
      title: `${source.title} (Copy)`,
      status: 'Draft',
      registeredCount: 0,
      createdAt: today,
      updatedAt: today,
    };
    setVisits((prev) => [cloned, ...prev]);
    showToast(`Duplicated visit as "${cloned.title}"!`, 'success');
    return newId;
  };

  // Registrations & Waitlist
  const registerForVisit = (
    visitId: string,
    studentInfo?: Partial<StudentRegistration>
  ): { success: boolean; message: string } => {
    const visit = visits.find((v) => v.id === visitId);
    if (!visit) {
      return { success: false, message: 'Visit not found.' };
    }

    if (visit.status === 'Cancelled' || visit.status === 'Completed') {
      return { success: false, message: `Cannot register for a ${visit.status.toLowerCase()} visit.` };
    }

    const studentId = studentInfo?.studentId || currentUser.id;
    const existing = registrations.find(
      (r) => r.visitId === visitId && r.studentId === studentId && r.status !== 'Cancelled'
    );

    if (existing) {
      return {
        success: false,
        message: `You are already registered for this visit (Status: ${existing.status}).`,
      };
    }

    // Check capacity
    const confirmedCount = registrations.filter(
      (r) => r.visitId === visitId && (r.status === 'Confirmed' || r.status === 'Attended')
    ).length;

    const isFull = confirmedCount >= visit.studentCapacity;
    const newStatus: StudentRegistration['status'] = isFull ? 'Waitlisted' : 'Confirmed';

    const newReg: StudentRegistration = {
      id: `reg_${Date.now()}`,
      visitId,
      studentId,
      studentName: studentInfo?.studentName || currentUser.name,
      rollNumber: studentInfo?.rollNumber || currentUser.rollNumber || 'CSE-2023-042',
      department: studentInfo?.department || currentUser.department,
      classYear: studentInfo?.classYear || '3rd Year',
      email: studentInfo?.email || currentUser.email,
      phone: studentInfo?.phone || currentUser.phone || '+91 91234 56789',
      status: newStatus,
      registeredAt: new Date().toLocaleString(),
      emergencyContact: studentInfo?.emergencyContact,
    };

    setRegistrations((prev) => [newReg, ...prev]);

    // Update registeredCount on visit if confirmed
    if (newStatus === 'Confirmed') {
      setVisits((prev) =>
        prev.map((v) => (v.id === visitId ? { ...v, registeredCount: v.registeredCount + 1 } : v))
      );
    }

    const msg = isFull
      ? `Registration successful! Capacity is currently full, so you have been placed on the Waitlist (#${
          registrations.filter((r) => r.visitId === visitId && r.status === 'Waitlisted').length + 1
        }).`
      : `Registration confirmed! Your seat is reserved for ${visit.title}.`;

    showToast(msg, isFull ? 'info' : 'success');

    sendNotification({
      recipientRole: 'student',
      recipientId: studentId,
      title: isFull ? 'Waitlisted for Visit' : 'Seat Confirmed!',
      message: msg,
      type: 'registration',
      visitId,
    });

    return { success: true, message: msg };
  };

  const cancelRegistration = (registrationId: string) => {
    const reg = registrations.find((r) => r.id === registrationId);
    if (!reg) return;

    setRegistrations((prev) =>
      prev.map((r) => (r.id === registrationId ? { ...r, status: 'Cancelled' } : r))
    );

    // If it was confirmed, promote first waitlisted student if available
    if (reg.status === 'Confirmed') {
      const waitlisted = registrations.find(
        (r) => r.visitId === reg.visitId && r.status === 'Waitlisted'
      );
      if (waitlisted) {
        setRegistrations((prev) =>
          prev.map((r) => (r.id === waitlisted.id ? { ...r, status: 'Confirmed' } : r))
        );
        sendNotification({
          recipientRole: 'student',
          recipientId: waitlisted.studentId,
          title: 'Promoted from Waitlist!',
          message: `A seat opened up for your industrial visit. Your status is now Confirmed!`,
          type: 'registration',
          visitId: reg.visitId,
        });
      } else {
        setVisits((prev) =>
          prev.map((v) =>
            v.id === reg.visitId
              ? { ...v, registeredCount: Math.max(0, v.registeredCount - 1) }
              : v
          )
        );
      }
    }

    showToast('Registration cancelled.', 'info');
  };

  const updateAttendance = (registrationId: string, status: 'Attended' | 'Absent') => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === registrationId
          ? {
              ...r,
              status,
              attendanceMarkedAt: new Date().toLocaleTimeString(),
            }
          : r
      )
    );
    showToast(`Attendance marked as ${status}.`, 'success');
  };

  const batchImportRegistrations = (
    visitId: string,
    newStudents: { name: string; rollNumber: string; department: string; classYear: string; email: string; phone: string }[]
  ): number => {
    const visit = visits.find((v) => v.id === visitId);
    if (!visit) return 0;

    let addedCount = 0;
    const currentConfirmed = registrations.filter(
      (r) => r.visitId === visitId && (r.status === 'Confirmed' || r.status === 'Attended')
    ).length;

    const remainingSeats = Math.max(0, visit.studentCapacity - currentConfirmed);

    const newEntries: StudentRegistration[] = newStudents.map((st, idx) => {
      addedCount++;
      const isConfirmed = idx < remainingSeats;
      return {
        id: `reg_csv_${Date.now()}_${idx}`,
        visitId,
        studentId: `imported_${st.rollNumber.replace(/[^a-zA-Z0-9]/g, '_')}`,
        studentName: st.name,
        rollNumber: st.rollNumber,
        department: st.department || visit.department,
        classYear: st.classYear || visit.semester,
        email: st.email || `${st.rollNumber.toLowerCase()}@apextech.edu`,
        phone: st.phone || '+91 90000 00000',
        status: isConfirmed ? 'Confirmed' : 'Waitlisted',
        registeredAt: new Date().toLocaleString(),
      };
    });

    setRegistrations((prev) => [...newEntries, ...prev]);
    const newlyConfirmed = Math.min(newEntries.length, remainingSeats);
    setVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, registeredCount: v.registeredCount + newlyConfirmed } : v))
    );

    showToast(`Successfully imported ${newEntries.length} student records from CSV!`, 'success');
    return newEntries.length;
  };

  // Approvals workflow
  const submitVisitForApproval = (visitId: string, remarks?: string) => {
    const visit = visits.find((v) => v.id === visitId);
    if (!visit) return;

    // Check if an approval already exists
    const existing = approvals.find((a) => a.visitId === visitId && a.status === 'Pending');
    if (existing) {
      showToast('This visit is already pending approval.', 'info');
      return;
    }

    const newApproval: ApprovalRequest = {
      id: `appr_${Date.now()}`,
      visitId,
      visitTitle: visit.title,
      department: visit.department,
      proposedDate: visit.visitDate,
      facultyId: currentUser.id,
      facultyName: currentUser.name,
      studentCount: visit.studentCapacity,
      estimatedBudget: visit.budgetEstimate.totalCost,
      status: 'Pending',
      submittedAt: new Date().toLocaleString(),
      remarks: remarks || 'Submitted for administrative approval.',
    };

    setApprovals((prev) => [newApproval, ...prev]);
    setVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, status: 'Pending Approval' } : v))
    );

    sendNotification({
      recipientRole: 'admin',
      title: 'New Visit Approval Request',
      message: `${currentUser.name} submitted "${visit.title}" for review.`,
      type: 'approval',
      visitId,
    });

    showToast('Visit proposal submitted for Administrative Review!', 'success');
  };

  const reviewApproval = (
    approvalId: string,
    decision: 'Approved' | 'Rejected',
    remarks?: string,
    rejectionReason?: string
  ) => {
    const appr = approvals.find((a) => a.id === approvalId);
    if (!appr) return;

    const reviewedAt = new Date().toLocaleString();
    const reviewerName = currentUser.name;

    setApprovals((prev) =>
      prev.map((a) =>
        a.id === approvalId
          ? {
              ...a,
              status: decision,
              reviewedAt,
              reviewedBy: reviewerName,
              remarks: remarks || a.remarks,
              rejectionReason: decision === 'Rejected' ? rejectionReason || 'Budget or scheduling conflicts' : undefined,
            }
          : a
      )
    );

    // Update Visit status
    setVisits((prev) =>
      prev.map((v) => {
        if (v.id === appr.visitId) {
          return {
            ...v,
            status: decision === 'Approved' ? 'Approved' : 'Draft',
            notes:
              decision === 'Rejected'
                ? `Rejected by Admin on ${reviewedAt}. Reason: ${rejectionReason || 'Requires revision'}`
                : v.notes,
          };
        }
        return v;
      })
    );

    sendNotification({
      recipientRole: 'faculty',
      recipientId: appr.facultyId,
      title: `Visit Proposal ${decision}`,
      message: `"${appr.visitTitle}" was ${decision.toLowerCase()} by ${reviewerName}.${
        decision === 'Rejected' ? ` Reason: ${rejectionReason}` : ''
      }`,
      type: 'approval',
      visitId: appr.visitId,
    });

    showToast(`Proposal ${decision.toLowerCase()} by Administrative Authority.`, 'success');
  };

  const confirmVisitWithCompany = (visitId: string) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, status: 'Confirmed with Company' } : v))
    );
    showToast('Visit marked as Confirmed with Host Company!', 'success');

    sendNotification({
      recipientRole: 'all',
      title: 'Visit Confirmed with Industry Host!',
      message: 'Arrangements and entry badges are verified. Please check itinerary and guidelines.',
      type: 'schedule',
      visitId,
    });
  };

  const completeVisit = (visitId: string, actualExp?: BudgetBreakdown['actualExpenditure']) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.id === visitId
          ? {
              ...v,
              status: 'Completed',
              budgetEstimate: actualExp
                ? { ...v.budgetEstimate, actualExpenditure: actualExp }
                : v.budgetEstimate,
            }
          : v
      )
    );
    showToast('Visit marked as Completed. Post-visit reports are unlocked.', 'success');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('All notifications marked as read.', 'info');
  };

  const sendNotification = (n: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...n,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.COMPANIES);
    localStorage.removeItem(STORAGE_KEYS.VISITS);
    localStorage.removeItem(STORAGE_KEYS.REGISTRATIONS);
    localStorage.removeItem(STORAGE_KEYS.APPROVALS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);

    setCompanies(DEMO_COMPANIES);
    setVisits(DEMO_VISITS);
    setRegistrations(DEMO_REGISTRATIONS);
    setApprovals(DEMO_APPROVALS);
    setNotifications(DEMO_NOTIFICATIONS);
    showToast('Demo environment reset to standard initial seed state.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchRole,
        loginUser,
        logout,
        activeTab,
        setActiveTab,
        selectedVisitId,
        setSelectedVisitId,
        viewVisitDetails,
        companies,
        addCompany,
        updateCompany,
        visits,
        createVisit,
        updateVisit,
        deleteVisit,
        duplicateVisit,
        registrations,
        registerForVisit,
        cancelRegistration,
        updateAttendance,
        batchImportRegistrations,
        approvals,
        submitVisitForApproval,
        reviewApproval,
        confirmVisitWithCompany,
        completeVisit,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        sendNotification,
        toast,
        showToast,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
