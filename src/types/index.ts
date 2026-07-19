export type Lang = 'ko' | 'en' | 'ru';

export type LocalizedText = Record<Lang, string>;

export type UserRole = 'seeker' | 'agent' | 'admin';

export type AgentApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface BaseUser {
  id: string;
  email: string;
  password: string; // demo only — plain text, never do this in production
  name: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

export interface SeekerUser extends BaseUser {
  role: 'seeker';
  nationality?: string;
}

export interface AgentUser extends BaseUser {
  role: 'agent';
  agencyName: string;
  licenseNumber: string;
  licenseFileName: string;
  approvalStatus: AgentApprovalStatus;
}

export interface AdminUser extends BaseUser {
  role: 'admin';
}

export type AppUser = SeekerUser | AgentUser | AdminUser;

export type DealType = 'monthly' | 'jeonse' | 'sale';
export type RoomType = 'oneroom' | 'officetel' | 'apartment' | 'villa' | 'share';

export interface Listing {
  id: string;
  agentId: string;
  title: LocalizedText;
  description: LocalizedText;
  dealType: DealType;
  roomType: RoomType;
  deposit: number; // 보증금 (만원)
  monthlyRent: number; // 월세 (만원), 0 if jeonse/sale
  areaM2: number;
  rooms: number;
  floor: string;
  address: string;
  region: string; // 평택, 화성, 안산, 인천 연수구 등
  lat: number;
  lng: number;
  photos: string[]; // emoji or placeholder identifiers
  options: string[];
  createdAt: string;
  featured?: boolean;
}

export interface Interpreter {
  id: string;
  name: string;
  languages: string[];
  hourlyRateKrw: number;
  bio: LocalizedText;
  photo: string;
  yearsExperience: number;
  addedAt: string;
}

export interface Column {
  id: string;
  title: LocalizedText;
  author: string;
  category: string;
  content: LocalizedText;
  publishedAt: string;
}

export type RequestStatus = 'requested' | 'in_review' | 'completed' | 'cancelled';

export interface ContactRequest {
  id: string;
  type: 'contact';
  listingId: string;
  seekerId: string;
  message: string;
  status: RequestStatus;
  createdAt: string;
}

export interface VisitRequest {
  id: string;
  type: 'visit';
  listingId: string;
  seekerId: string;
  visitDate: string;
  visitTime: string;
  needsInterpreter: boolean;
  interpreterId?: string;
  status: RequestStatus;
  createdAt: string;
}

export interface RightsReportRequest {
  id: string;
  type: 'rights_report';
  listingId: string;
  seekerId: string;
  note: string;
  status: RequestStatus;
  feeKrw: number;
  createdAt: string;
}

export type AnyRequest = ContactRequest | VisitRequest | RightsReportRequest;
