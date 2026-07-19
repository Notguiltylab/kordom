import { readAll, writeAll, genId } from './storage';
import { SEED_LISTINGS } from '../data/seed';
import type { Listing } from '../types';

const KEY = 'listings';

export function getListings(): Listing[] {
  return readAll<Listing>(KEY, SEED_LISTINGS);
}

export function getListingById(id: string): Listing | undefined {
  return getListings().find((l) => l.id === id);
}

export function getListingsByAgent(agentId: string): Listing[] {
  return getListings().filter((l) => l.agentId === agentId);
}

export interface ListingFilters {
  region?: string;
  roomType?: string;
  dealType?: string;
  maxDeposit?: number;
  maxMonthlyRent?: number;
}

export function filterListings(filters: ListingFilters): Listing[] {
  return getListings().filter((l) => {
    if (filters.region && l.region !== filters.region) return false;
    if (filters.roomType && l.roomType !== filters.roomType) return false;
    if (filters.dealType && l.dealType !== filters.dealType) return false;
    if (filters.maxDeposit != null && l.deposit > filters.maxDeposit) return false;
    if (filters.maxMonthlyRent != null && l.monthlyRent > filters.maxMonthlyRent) return false;
    return true;
  });
}

export function createListing(input: Omit<Listing, 'id' | 'createdAt'>): Listing {
  const listing: Listing = { ...input, id: genId('listing'), createdAt: new Date().toISOString() };
  writeAll(KEY, [...getListings(), listing]);
  return listing;
}

export function updateListing(id: string, patch: Partial<Listing>): void {
  const next = getListings().map((l) => (l.id === id ? { ...l, ...patch } : l));
  writeAll(KEY, next);
}

export function deleteListing(id: string): void {
  writeAll(
    KEY,
    getListings().filter((l) => l.id !== id),
  );
}

export const REGIONS = ['평택', '화성', '안산', '인천 연수구'];
