export type ReadableSearchParams = {
  get(name: string): string | null;
  toString(): string;
};

export type ProjectSearchState = {
  /** A known category value, or "all" when missing or unknown. */
  category: string;
  query: string;
};

export const ALL_CATEGORIES = "all";

/** Reads `?category=` and `?q=` defensively; unknown categories fall back to "all". */
export function parseProjectSearchParams(
  params: ReadableSearchParams,
  validCategories: readonly string[],
): ProjectSearchState {
  const category = params.get("category") ?? ALL_CATEGORIES;

  return {
    category: validCategories.includes(category) ? category : ALL_CATEGORIES,
    query: (params.get("q") ?? "").trim(),
  };
}

/**
 * Builds the next URL for a filter change, keeping unrelated params and
 * dropping defaults so `/projects` stays the canonical "everything" view.
 */
export function buildProjectSearchHref(
  pathname: string,
  current: ReadableSearchParams,
  updates: Partial<ProjectSearchState>,
): string {
  const params = new URLSearchParams(current.toString());

  if (updates.category !== undefined) {
    if (updates.category === ALL_CATEGORIES || !updates.category) {
      params.delete("category");
    } else {
      params.set("category", updates.category);
    }
  }

  if (updates.query !== undefined) {
    const query = updates.query.trim();

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
  }

  const queryString = params.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}
