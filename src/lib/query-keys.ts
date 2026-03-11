/**
 * Typed query key factory.
 *
 * All cache keys in one place so invalidation always matches exactly.
 * Use the narrowest key possible when invalidating:
 *   queryClient.invalidateQueries({ queryKey: reportKeys.lists() })
 *   ← invalidates all paginated report lists
 *
 *   queryClient.invalidateQueries({ queryKey: reportKeys.detail(code) })
 *   ← invalidates only a specific report
 */
export const reportKeys = {
  /* Root key - matches any reports query, for broad invalidation */
  all: () => ["reports"] as const,

  /* Paginated lists key - matches any paginated report list query */
  lists: () => ["reports", "lists"] as const,

  /** One specific page of the report list. */
  list: (page: number) => ["reports", "list", page] as const,

  /** All report detail queries. */
  details: () => ["reports", "detail"] as const,

  /** Detail for a single report code. */
  detail: (code: string) => ["reports", "detail", code] as const,

  /** Full performance map for a report (all fights). */
  performance: (code: string) => ["reports", "performance", code] as const,
} as const;

export const wclKeys = {
  /** Root — matches any WCL query. */
  all: () => ["wcl"] as const,

  /** Current WCL OAuth status for the authenticated user. */
  status: () => ["wcl", "status"] as const,
} as const;

export const adminKeys = {
  /** Root — matches any admin query. */
  all: () => ["admin"] as const,

  /** Status das credenciais WCL (ClientId/Secret) — visível apenas para Admin. */
  wclCredentialsStatus: () => ["admin", "wcl-credentials", "status"] as const,
} as const;

export const scoringKeys = {
  all: () => ["scoring"] as const,
  settings: () => ["scoring", "settings"] as const,
} as const;

export const playerScoringKeys = {
  all: () => ["player-scoring"] as const,
  byWeek: (id: number) => ["player-scoring", "week", id] as const,
} as const;

export const playerKeys = {
  all: () => ["players"] as const,
  lists: () => ["players", "list"] as const,
  list: (page: number) => ["players", "list", page] as const,
  details: () => ["players", "detail"] as const,
  detail: (id: number) => ["players", "detail", id] as const,
} as const;

export const raidWeekKeys = {
  all: () => ["raid-weeks"] as const,
  lists: () => ["raid-weeks", "list"] as const,
  list: (page: number) => ["raid-weeks", "list", page] as const,
  details: () => ["raid-weeks", "detail"] as const,
  detail: (id: number) => ["raid-weeks", "detail", id] as const,
} as const;

export const characterKeys = {
  all: () => ["characters"] as const,
  search: (q: string, cls: string) => ["characters", "search", q, cls] as const,
} as const;
