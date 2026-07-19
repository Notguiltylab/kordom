import type { ReactNode } from 'react';

export function Badge({ tone = 'default', children }: { tone?: 'default' | 'success' | 'warning' | 'danger'; children: ReactNode }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
