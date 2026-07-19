import { readAll, writeAll, genId } from './storage';
import { SEED_USERS } from '../data/seed';
import type { AppUser, SeekerUser, AgentUser } from '../types';

const KEY = 'users';
const SESSION_KEY = 'kordom:session';

function getUsers(): AppUser[] {
  return readAll<AppUser>(KEY, SEED_USERS);
}

function saveUsers(users: AppUser[]): void {
  writeAll(KEY, users);
}

export function getCurrentUser(): AppUser | null {
  const id = localStorage.getItem(SESSION_KEY);
  if (!id) return null;
  return getUsers().find((u) => u.id === id) ?? null;
}

export function login(email: string, password: string): AppUser {
  const user = getUsers().find((u) => u.email === email && u.password === password);
  if (!user) throw new Error('AUTH_INVALID');
  localStorage.setItem(SESSION_KEY, user.id);
  return user;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function signupSeeker(input: {
  email: string;
  password: string;
  name: string;
  phone: string;
  nationality?: string;
}): SeekerUser {
  const users = getUsers();
  if (users.some((u) => u.email === input.email)) throw new Error('EMAIL_TAKEN');
  const user: SeekerUser = {
    id: genId('seeker'),
    email: input.email,
    password: input.password,
    name: input.name,
    phone: input.phone,
    role: 'seeker',
    nationality: input.nationality,
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, user]);
  localStorage.setItem(SESSION_KEY, user.id);
  return user;
}

export function signupAgent(input: {
  email: string;
  password: string;
  name: string;
  phone: string;
  agencyName: string;
  licenseNumber: string;
  licenseFileName: string;
}): AgentUser {
  const users = getUsers();
  if (users.some((u) => u.email === input.email)) throw new Error('EMAIL_TAKEN');
  const user: AgentUser = {
    id: genId('agent'),
    email: input.email,
    password: input.password,
    name: input.name,
    phone: input.phone,
    role: 'agent',
    agencyName: input.agencyName,
    licenseNumber: input.licenseNumber,
    licenseFileName: input.licenseFileName,
    approvalStatus: 'pending',
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, user]);
  localStorage.setItem(SESSION_KEY, user.id);
  return user;
}

export function listAgents(): AgentUser[] {
  return getUsers().filter((u): u is AgentUser => u.role === 'agent');
}

export function setAgentApproval(agentId: string, status: AgentUser['approvalStatus']): void {
  const users = getUsers();
  const next = users.map((u) => (u.id === agentId && u.role === 'agent' ? { ...u, approvalStatus: status } : u));
  saveUsers(next);
}

export function findUserById(id: string): AppUser | undefined {
  return getUsers().find((u) => u.id === id);
}
