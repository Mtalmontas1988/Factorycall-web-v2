/**
 * Firebase Realtime Database records used by FactoryCall Android and Web.
 * Optional aliases allow the web portal to read existing Android keys without migration.
 */
export type FirebaseId = string;
export type TimestampValue = number | string;

export type CallStatus = 'Naujas' | 'Priskirtas' | 'Vykdomas' | 'Laukia dalių' | 'Uždarytas' | 'Atšauktas' | string;
export type Priority = 'Žemas' | 'Vidutinis' | 'Aukštas' | 'Kritinis' | string;

export interface FirebaseRecord { id?: FirebaseId; createdAt?: TimestampValue; updatedAt?: TimestampValue; }
export interface FactoryCall extends FirebaseRecord {
  /** Current Android model fields under /calls/{id}. */
  company?: string; line?: string; problem?: string; description?: string; technician?: string; operator?: string;
  priority?: Priority; status?: CallStatus; photo?: string; photoAfterRepair?: string; technicianComment?: string;
  date?: string; time?: string; acceptedTime?: number; arrivedTime?: number; startedRepairTime?: number; completedTime?: number; createdTime?: number;
  responseTime?: string; travelTime?: string; repairTime?: string; totalDowntime?: string;
  /** Optional web-compatible extensions; these do not require Android migration. */
  callNumber?: string; title?: string; companyId?: FirebaseId; lineId?: FirebaseId; equipmentId?: FirebaseId; problemId?: FirebaseId;
  operatorId?: FirebaseId; technicianId?: FirebaseId; reportedAt?: TimestampValue; resolvedAt?: TimestampValue; downtimeMinutes?: number;
  notes?: string; imageUrls?: string[]; attachments?: Record<string, FirebaseAttachment>;
}
export interface FirebaseAttachment { name?: string; url?: string; storagePath?: string; uploadedAt?: TimestampValue; }
export interface Person extends FirebaseRecord { name?: string; email?: string; phone?: string; active?: boolean; }
export interface Technician extends Person { photo?: string; lines?: string; skills?: string[]; team?: string; availability?: string; companyId?: FirebaseId; lastLogin?: TimestampValue; lastLoginTime?: TimestampValue; uid?: FirebaseId; }
export interface Operator extends Person { shift?: string; department?: string; lineId?: FirebaseId; companyId?: FirebaseId; lastLogin?: TimestampValue; lastLoginTime?: TimestampValue; uid?: FirebaseId; }
export interface Company extends FirebaseRecord { logoUrl?: string; name?: string; address?: string; city?: string; country?: string; phone?: string; email?: string; website?: string; companyCode?: string; vatCode?: string; manager?: string; workingDays?: string[]; shifts?: string; workStart?: string; workEnd?: string; lunchBreak?: string; timezone?: string; }
export interface ProductionLine extends FirebaseRecord { name?: string; code?: string; companyId?: FirebaseId; active?: boolean; zone?: string; technicians?: string[]; technicianIds?: FirebaseId[]; }
export interface Problem extends FirebaseRecord { name?: string; code?: string; category?: string; description?: string; active?: boolean; priority?: Priority; sla?: string; color?: string; }
export interface PortalUser extends FirebaseRecord { name?: string; email?: string; role?: string; online?: boolean; busy?: boolean; fcmToken?: string; companyId?: FirebaseId; lastLogin?: TimestampValue; lastLoginTime?: TimestampValue; uid?: FirebaseId; }
/** Tokens are intentionally reduced to metadata in the UI; the token value is never displayed. */
export interface DeviceToken extends FirebaseRecord { userId?: FirebaseId; updatedAt?: TimestampValue; }
/** Existing `/preventiveWorks` records are read without renaming any Android fields. */
export interface PreventiveWork extends FirebaseRecord { name?: string; title?: string; line?: string; company?: string; status?: string; dueDate?: string; dueTime?: number; scheduledTime?: number; completedTime?: number; }
export type AssetStatus = 'active' | 'maintenance' | 'inactive';
/** Android-compatible record at /assets/{assetId}. */
export interface Asset extends FirebaseRecord {
  id: FirebaseId;
  company: string;
  line: string;
  name: string;
  code: string;
  serialNumber: string;
  manufacturer: string;
  model: string;
  location: string;
  description: string;
  installationDate: string;
  warrantyUntil: string;
  status: AssetStatus;
  qrCode: string;
  createdTime: number;
  updatedTime: number;
}
/** Existing /notifications records. The portal only updates read/dismissed flags; it never deletes notifications. */
export interface FactoryNotification extends FirebaseRecord { title?: string; message?: string; body?: string; eventType?: string; callId?: FirebaseId; read?: boolean; dismissed?: boolean; priority?: Priority; createdTime?: TimestampValue; }
export interface AppNotification extends FirebaseRecord { id: FirebaseId; eventType: string; entityId: string; callId: string; preventiveWorkId: string; title: string; body: string; recipientUserId: string; recipientRole: string; createdTime: number; read: boolean; dismissed: boolean; dismissedAt: number; source: string; }

export type FirebaseRootPaths = {
  calls: 'calls' | 'serviceCalls' | 'issues'; technicians: 'technicians'; operators: 'operators';
  companies: 'companies'; lines: 'lines' | 'productionLines'; problems: 'problems' | 'failureTypes';
};
