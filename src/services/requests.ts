import { readAll, writeAll, genId } from './storage';
import type { AnyRequest, ContactRequest, VisitRequest, RightsReportRequest, RequestStatus } from '../types';

const KEY = 'requests';

export function getRequests(): AnyRequest[] {
  return readAll<AnyRequest>(KEY, []);
}

export function getRequestsBySeeker(seekerId: string): AnyRequest[] {
  return getRequests()
    .filter((r) => r.seekerId === seekerId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getRequestsForAgentListings(listingIds: string[]): AnyRequest[] {
  return getRequests()
    .filter((r) => listingIds.includes(r.listingId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createContactRequest(input: { listingId: string; seekerId: string; message: string }): ContactRequest {
  const req: ContactRequest = {
    ...input,
    id: genId('req'),
    type: 'contact',
    status: 'requested',
    createdAt: new Date().toISOString(),
  };
  writeAll(KEY, [...getRequests(), req]);
  return req;
}

export function createVisitRequest(input: {
  listingId: string;
  seekerId: string;
  visitDate: string;
  visitTime: string;
  needsInterpreter: boolean;
  interpreterId?: string;
}): VisitRequest {
  const req: VisitRequest = {
    ...input,
    id: genId('req'),
    type: 'visit',
    status: 'requested',
    createdAt: new Date().toISOString(),
  };
  writeAll(KEY, [...getRequests(), req]);
  return req;
}

export function createRightsReportRequest(input: {
  listingId: string;
  seekerId: string;
  note: string;
  feeKrw: number;
}): RightsReportRequest {
  const req: RightsReportRequest = {
    ...input,
    id: genId('req'),
    type: 'rights_report',
    status: 'requested',
    createdAt: new Date().toISOString(),
  };
  writeAll(KEY, [...getRequests(), req]);
  return req;
}

export function updateRequestStatus(id: string, status: RequestStatus): void {
  writeAll(
    KEY,
    getRequests().map((r) => (r.id === id ? { ...r, status } : r)),
  );
}
