import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

// jsdom has no matchMedia; default to a mobile-width, light-mode viewport.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

// next/image needs Next's runtime config; a plain <img> is enough for tests.
const nextImageOnlyProps = ["fill", "preload", "priority", "sizes", "quality"];

vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    const imgProps: Record<string, unknown> = { ...props };
    for (const key of nextImageOnlyProps) delete imgProps[key];

    return <img {...(imgProps as ImgHTMLAttributes<HTMLImageElement>)} />;
  },
}));
