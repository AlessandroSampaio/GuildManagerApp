export interface AuditLogDto {
  id: number;
  action: string;
  entityType: string;
  entityId: string | null;
  actorId: string | null;
  actorUsername: string | null;
  details: string | null;
  occurredAt: string; // ISO 8601
}
