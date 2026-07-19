import { readAll, writeAll, genId } from './storage';
import { SEED_COLUMNS } from '../data/seed';
import type { Column } from '../types';

const KEY = 'columns';

export function getColumns(): Column[] {
  return readAll<Column>(KEY, SEED_COLUMNS).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getColumnById(id: string): Column | undefined {
  return getColumns().find((c) => c.id === id);
}

// Columns are authored by admins on behalf of partner lawyers — no public submission form.
export function createColumn(input: Omit<Column, 'id' | 'publishedAt'>): Column {
  const column: Column = { ...input, id: genId('col'), publishedAt: new Date().toISOString() };
  writeAll(KEY, [...getColumns(), column]);
  return column;
}

export function updateColumn(id: string, patch: Partial<Column>): void {
  writeAll(
    KEY,
    getColumns().map((c) => (c.id === id ? { ...c, ...patch } : c)),
  );
}

export function deleteColumn(id: string): void {
  writeAll(
    KEY,
    getColumns().filter((c) => c.id !== id),
  );
}
