export type UserRole = 'admin' | 'faculty' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  rollNumber?: string;
  collegeName: string;
  avatarUrl?: string;
  phone?: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  sector: string;
  location: string;
  address: string;
  description: string;
  visitTypes: string[];
  technologies: string[];
  capacity: number;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string;
  website: string;
  requirements: string[];
  bookingStatus: 'Open for Visits' | 'Advance Notice Required' | 'Restricted Access';
  eligibleDepartments: string[];
  isDemo: boolean;
}

export interface ItineraryItem {
  timeSlot: string;
  activity: string;
  location: string;
  details: string;
  coordinator?: string;
}

export interface BudgetBreakdown {
  transportCost: number;
  foodCost: number;
  entryFee: number;
  accommodationCost: number;
  miscCost: number;
  facultyDA: number;
  studentCount: number;
  contingencyPercent: number;
  contingencyCost: number;
  totalCost: number;
  costPerStudent: number;
  collegeSubsidy: number;
  studentPayable: number;
  actualExpenditure?: {
    transport: number;
    food: number;
    entry: number;
    misc: number;
    total: number;
  };
}

export interface PickupPoint {
  name: string;
  time: string;
  studentCount: number;
}

export interface TransportationInfo {
  vehicleType: string;
  vehicleNumber: string;
  seatingCapacity: number;
  agencyName: string;
  driverName: string;
  driverPhone: string;
  pickupPoints: PickupPoint[];
  distanceKm: number;
  estimatedTravelTime: string;
  routeSummary: string;
}

export type VisitStatus = 
  | 'Draft' 
  | 'Pending Approval' 
  | 'Approved' 
  | 'Confirmed with Company' 
  | 'Completed' 
  | 'Cancelled';

export interface Visit {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companySector?: string;
  companyLocation?: string;
  department: string;
  semester: string;
  visitDate: string;
  returnDate: string;
  departureTime: string;
  returnTime: string;
  assemblyPoint: string;
  studentCapacity: number;
  registeredCount: number;
  registrationDeadline: string;
  status: VisitStatus;
  notes: string;
  budgetEstimate: BudgetBreakdown;
  facultyCoordinatorId: string;
  facultyCoordinatorName: string;
  facultyCoordinatorEmail?: string;
  facultyCoordinatorPhone?: string;
  transportationDetails: TransportationInfo;
  itinerary: ItineraryItem[];
  learningObjectives: string[];
  safetyGuidelines: string[];
  preparationChecklist?: { timeline: string; tasks: string[] }[];
  industrialQuestions?: { topic: string; question: string; context: string }[];
  postVisitReportTemplate?: { sections: string[]; assessmentRubric: string[] };
  createdAt: string;
  updatedAt: string;
}

export type RegistrationStatus = 'Confirmed' | 'Waitlisted' | 'Attended' | 'Absent' | 'Cancelled';

export interface StudentRegistration {
  id: string;
  visitId: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  classYear: string;
  email: string;
  phone: string;
  status: RegistrationStatus;
  registeredAt: string;
  emergencyContact?: string;
  attendanceMarkedAt?: string;
}

export interface ApprovalRequest {
  id: string;
  visitId: string;
  visitTitle: string;
  department: string;
  proposedDate: string;
  facultyId: string;
  facultyName: string;
  studentCount: number;
  estimatedBudget: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  remarks?: string;
}

export interface NotificationItem {
  id: string;
  recipientRole: 'all' | 'admin' | 'faculty' | 'student';
  recipientId?: string;
  title: string;
  message: string;
  type: 'approval' | 'registration' | 'reminder' | 'schedule' | 'cancellation' | 'general';
  isRead: boolean;
  createdAt: string;
  visitId?: string;
}

export interface AiGeneratedPlan {
  visitTitle: string;
  executiveSummary: string;
  recommendedDestinations: {
    companyType: string;
    exampleOrganization: string;
    location: string;
    suitabilityReason: string;
    recommendedLabs: string[];
  }[];
  itinerary: ItineraryItem[];
  learningOutcomes: {
    domain: string;
    description: string;
    curriculumMapping: string;
  }[];
  budgetEstimates: {
    transportCost: number;
    foodAndRefreshments: number;
    entryLabFees: number;
    miscellaneousFirstAid: number;
    contingencyBuffer: number;
    totalEstimatedCost: number;
    costPerStudent: number;
    budgetNotes: string;
  };
  preparationChecklist: {
    timeline: string;
    tasks: string[];
  }[];
  safetyPrecautions: {
    category: string;
    guidelines: string[];
  }[];
  industrialQuestions: {
    topic: string;
    question: string;
    context: string;
  }[];
  postVisitReportTemplate: {
    sections: string[];
    assessmentRubric: string[];
  };
}

export type AppTab = 
  | 'dashboard'
  | 'directory'
  | 'ai-planner'
  | 'visits'
  | 'visit-details'
  | 'students'
  | 'budget'
  | 'approvals'
  | 'calendar'
  | 'reports'
  | 'notifications'
  | 'settings';
