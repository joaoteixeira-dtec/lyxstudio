export interface AuditEntry {
  id: string;
  action: string;
  detail: string;
  section: string;
  timestamp: Date;
  severity: 'info' | 'success' | 'warning' | 'error';
}

const store: AuditEntry[] = [
  {
    id: '0',
    action: 'Sessão iniciada',
    detail: 'Login de administrador efetuado com sucesso',
    section: 'Auth',
    timestamp: new Date(),
    severity: 'success',
  },
];

export function pushAudit(
  action: string,
  detail: string,
  section: string,
  severity: AuditEntry['severity'] = 'info'
): void {
  store.unshift({
    id: `${Date.now()}-${Math.random()}`,
    action,
    detail,
    section,
    timestamp: new Date(),
    severity,
  });
  if (store.length > 500) store.length = 500;
}

export function getAuditEntries(): AuditEntry[] {
  return [...store];
}
