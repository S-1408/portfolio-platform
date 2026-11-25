"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("popstate", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("popstate", listener);
  };
}

const getSnapshot = () => window.location.search;
// The page is statically prerendered without query params.
const getServerSnapshot = () => "";

/**
 * URL search params as hydration-safe state.
 *
 * Unlike `useSearchParams`, this doesn't force the static page to bail out to
 * client rendering: the server HTML (no params) hydrates as-is, then the
 * component re-renders with the real URL. Updates use `history.pushState`,
 * which Next.js syncs into its router without an RSC round trip.
 */
export function useUrlSearch() {
  const search = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  const push = useCallback((href: string) => {
    window.history.pushState(null, "", href);
    listeners.forEach((listener) => listener());
  }, []);

  return { searchParams, push };
}
