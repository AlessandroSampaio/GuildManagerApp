import { PagedResult } from "@/types/common";
import { req } from "./client";
import { CharacterSearchResult } from "@/types/characters";

export const charactersApi = {
  search: (q?: string, className?: string, page = 1, pageSize = 20) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (className) params.set("className", className);
    params.set("page", String(page));
    params.set("pageSize", String(pageSize));
    return req<PagedResult<CharacterSearchResult>>(
      `/api/characters/search?${params}`,
    );
  },
};
