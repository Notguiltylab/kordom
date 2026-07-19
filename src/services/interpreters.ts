import { readAll, writeAll, genId } from './storage';
import { SEED_INTERPRETERS } from '../data/seed';
import type { Interpreter } from '../types';

const KEY = 'interpreters';

export function getInterpreters(): Interpreter[] {
  return readAll<Interpreter>(KEY, SEED_INTERPRETERS);
}

export function getInterpreterById(id: string): Interpreter | undefined {
  return getInterpreters().find((i) => i.id === id);
}

// Interpreters are curated by admins only — there is no public self-signup flow.
export function createInterpreter(input: Omit<Interpreter, 'id' | 'addedAt'>): Interpreter {
  const interpreter: Interpreter = { ...input, id: genId('interp'), addedAt: new Date().toISOString() };
  writeAll(KEY, [...getInterpreters(), interpreter]);
  return interpreter;
}

export function updateInterpreter(id: string, patch: Partial<Interpreter>): void {
  writeAll(
    KEY,
    getInterpreters().map((i) => (i.id === id ? { ...i, ...patch } : i)),
  );
}

export function deleteInterpreter(id: string): void {
  writeAll(
    KEY,
    getInterpreters().filter((i) => i.id !== id),
  );
}
