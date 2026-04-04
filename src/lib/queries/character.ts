import { useQuery, useQueryClient } from "@tanstack/solid-query";
import { createEffect } from "solid-js";
import { characterKeys } from "../query-keys";
import { charactersApi } from "@/api/characters";

export function useMyCharacters(includeRaiderIo = false) {
  return useQuery(() => ({
    queryKey: characterKeys.mine(includeRaiderIo),
    queryFn: () => charactersApi.getMyCharacters(includeRaiderIo),
    staleTime: 60_000,
  }));
}

export function useCharacterRaiderIo(id: () => number) {
  const qc = useQueryClient();
  const query = useQuery(() => ({
    queryKey: characterKeys.raiderIo(id()),
    queryFn: () => charactersApi.getRaiderIoProfile(id()),
    staleTime: 5 * 60 * 1000,
  }));

  createEffect(() => {
    if (query.isSuccess) {
      qc.invalidateQueries({ queryKey: characterKeys.mine() });
    }
  });

  return query;
}

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
