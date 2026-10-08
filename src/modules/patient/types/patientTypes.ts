// WIDA Patient Module - Isolated TypeScript Types
// Independent and isolated from other team modules

export type PatientNotificationType =
  | 'appointment'
  | 'medicine'
  | 'diagnostic'
  | 'pharmacy'
  | 'wellness'
  | 'followup'
  | 'health_record'
  | 'security'
  | 'emergency'
  | 'system';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export interface PatientNotification {
  id: string;
  type: PatientNotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: PriorityLevel;
  relatedId?: string;
  relatedType?: string;
  actionUrl?: string;
}

export type ReminderType = 'Medicine' | 'Appointment' | 'Lab' | 'Wellness' | 'Follow-up' | 'Custom';
export type ReminderStatus = 'Upcoming' | 'Taken' | 'Skipped' | 'Missed' | 'Completed';
export type RepeatInterval = 'Once' | 'Daily' | 'Weekly' | 'Custom';

export interface PatientReminder {
  id: string;
  type: ReminderType;
  title: string;
  description: string;
  date: string;
  time: string;
  repeat: RepeatInterval;
  status: ReminderStatus;
  relatedEntityId?: string;
  priority: PriorityLevel;
  dosage?: string;
  instructions?: string;
}

export interface PatientProfile {
  id: string;
  abhaId?: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  avatarUrl: string;
  bloodGroup: string;
  height: string;
  weight: string;
  bmi: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  lifestyle: {
    smoking: string;
    alcohol: string;
    activityLevel: string;
  };
}

export type MedicineSystem = 'Allopathy' | 'Ayurveda' | 'Homeopathy';

export interface PatientDoctor {
  id: string;
  name: string;
  photo: string;
  verified: boolean;
  specialization: string;
  experience: number;
  rating: number;
  patientsCount: number;
  consultationFee: number;
  location: string;
  hospital: string;
  availability: string;
  medicineSystem: MedicineSystem;
  about: string;
  education: string[];
  languages: string[];
  achievements: string[];
  availableSlots: string[];
}

export type AppointmentStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'Rescheduled';
export type AppointmentType = 'Online' | 'In-person';

export interface PatientAppointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorAvatar: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  fee: number;
  joinUrl?: string;
  location?: string;
  doctorRemarks?: string;
}

export interface PatientMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  timing: ('Morning' | 'Afternoon' | 'Evening' | 'Night')[];
  price?: number;
  quantity?: number;
}

export type PrescriptionStatus = 'Active' | 'Completed' | 'Expired' | 'Partially fulfilled';

export interface PatientPrescription {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  expiryDate: string;
  status: PrescriptionStatus;
  diagnosis: string;
  medicines: PatientMedicine[];
  instructions: string;
  dispensedBy?: string;
  isSentToPharmacy?: boolean;
}

export type PharmacyOrderStatus = 'Prescription received' | 'Verification' | 'Processing' | 'Ready' | 'Delivered';

export interface PatientPharmacyOrder {
  id: string;
  prescriptionId: string;
  pharmacyName: string;
  date: string;
  medicines: { name: string; quantity: string; price: number }[];
  totalAmount: number;
  status: PharmacyOrderStatus;
  deliveryType: 'Pickup' | 'Home Delivery';
  estimatedReadyTime: string;
}

export interface PatientDiagnosticTest {
  id: string;
  name: string;
  category: 'Full Body' | 'Blood' | 'Pathology' | 'Radiology' | 'Cardiology' | 'Preventive';
  description: string;
  price: number;
  preparation: string;
  turnaroundTime: string;
  sampleType: string;
  popular?: boolean;
  recommendedFor?: string[];
}

export interface PatientLab {
  id: string;
  name: string;
  address: string;
  rating: number;
  accreditation: string;
  phone: string;
  availableSlots: string[];
}

export type LabReportStatus = 'Processing' | 'Ready' | 'Reviewed' | 'Shared';

export interface LabParameter {
  name: string;
  value: string;
  unit: string;
  normalRange: string;
  status: 'Normal' | 'Elevated' | 'Low';
}

export interface PatientLabReport {
  id: string;
  testId: string;
  testName: string;
  labName: string;
  date: string;
  doctorName: string;
  status: LabReportStatus;
  parameters: LabParameter[];
  overallConclusion: string;
  doctorNotes?: string;
  pdfUrl?: string;
  isVerified: boolean;
}

export interface PatientLabBooking {
  id: string;
  testId: string;
  testName: string;
  labId: string;
  labName: string;
  date: string;
  time: string;
  collectionType: 'Visit Lab' | 'Home Sample Collection';
  status: 'Booked' | 'Sample Collected' | 'Report Ready';
  price: number;
}

export type HealthRecordCategory = 'Consultation' | 'Prescription' | 'Lab' | 'Pharmacy' | 'Wellness' | 'Follow-up';

export interface PatientHealthRecord {
  id: string;
  category: HealthRecordCategory;
  title: string;
  date: string;
  time: string;
  provider: string;
  summary: string;
  details?: Record<string, unknown>;
  verified: boolean;
  badgeType: 'doctor' | 'lab' | 'pharmacy' | 'wellness';
  relatedId?: string;
}

export interface PatientCareJourneyStep {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  provider: string;
  status: 'completed' | 'in_progress' | 'pending';
  icon: string;
  routeLink: string;
  details?: string;
}

export interface PatientWellnessMetric {
  id: string;
  name: string;
  value: string | number;
  unit: string;
  status: 'Normal' | 'Optimal' | 'Attention' | 'Warning';
  trend: string;
  trendDirection: 'up' | 'down' | 'stable';
  lastUpdated: string;
  target?: string;
}

export interface PatientWearable {
  id: string;
  name: string;
  model: string;
  status: 'Connected' | 'Syncing' | 'Not connected' | 'Connecting';
  battery: string;
  lastSynced: string;
  metrics: {
    steps: number;
    heartRate: number;
    sleepHours: number;
    calories: number;
  };
}

export interface PatientEmergencyRequest {
  id: string;
  patientId: string;
  timestamp: string;
  location: string;
  status: 'Alert Sent' | 'Request Received' | 'Response Assigned' | 'Ambulance Dispatched' | 'Hospital Notified' | 'Arrived';
  ambulanceNumber?: string;
  hospitalName?: string;
  etaMinutes?: number;
  paramedicContact?: string;
  criticalDetailsShared: {
    bloodGroup: string;
    allergies: string[];
    chronicConditions: string[];
    emergencyContact: string;
  };
}

export interface PatientConsentPermission {
  id: string;
  providerName: string;
  providerType: 'Doctor' | 'Diagnostic Lab' | 'Pharmacy' | 'Emergency Services';
  grantedDate: string;
  expiryDate: string;
  accessScopes: {
    medicalHistory: boolean;
    prescriptions: boolean;
    labReports: boolean;
    wellnessData: boolean;
  };
  status: 'Active' | 'Revoked' | 'Expired';
}

export interface PatientAuditLog {
  id: string;
  accessorName: string;
  accessorRole: string;
  action: string;
  resourceAccessed: string;
  timestamp: string;
  purpose: string;
  status: 'Authorized' | 'Emergency Access' | 'Restricted';
}

export interface PatientMedicalDocument {
  id: string;
  title: string;
  category: 'Medical Reports' | 'Prescriptions' | 'Insurance' | 'Vaccination' | 'Previous Records';
  date: string;
  fileSize: string;
  uploader: string;
  sharingStatus: 'Private' | 'Shared with Doctors' | 'Shared with Labs';
  fileType: 'pdf' | 'jpg' | 'png';
}

export interface PatientGovernmentScheme {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  eligibility: string[];
  benefits: string[];
  requiredDocuments: string[];
  coverageAmount: string;
  officialSource: string;
  status: 'Active' | 'Under Review' | 'Enrolled' | 'Available';
  applicationProcedure: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  isDisclaimer?: boolean;
}
