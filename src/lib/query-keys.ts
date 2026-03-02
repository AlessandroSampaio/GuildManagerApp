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
