import { useQuery } from "@tanstack/solid-query";
import { characterKeys } from "../query-keys";
import { charactersApi } from "@/api/characters";

/**
 * Searches characters by name substring and/or exact class name.
 * Enabled only when query or class is non-empty (≥1 char).
 * Results are cached for 30s — short enough to feel fresh, long enough
 * to avoid hammering the API as the user types.
 */
export function useCharacterSearch(
  query: () => string,
  className: () => string,
) {
  return useQuery(() => ({
    queryKey: characterKeys.search(query(), className()),
    queryFn: () =>
      charactersApi.search(
        query() || undefined,
        className() || undefined,
        1,
        20,
      ),
    enabled: () => query().length >= 1 || className().length >= 1,
    staleTime: 30_000,
    // Keep previous results while new ones load to avoid flicker
    placeholderData: (prev: any) => prev,
  }));
}
