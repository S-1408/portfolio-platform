import { describe, expect, it } from "vitest";
import {
  buildProjectSearchHref,
  parseProjectSearchParams,
} from "./project-search-params.js";

const categories = ["all", "react", "angular"];
const params = (value: string) => new URLSearchParams(value);

describe("parseProjectSearchParams", () => {
  it("defaults to all categories and an empty query", () => {
    expect(parseProjectSearchParams(params(""), categories)).toEqual({
      category: "all",
      query: "",
    });
  });

  it("reads a known category and trims the query", () => {
    expect(
      parseProjectSearchParams(
        params("category=react&q=%20hooks%20"),
        categories,
      ),
    ).toEqual({ category: "react", query: "hooks" });
  });

  it("falls back to all for unknown categories", () => {
    expect(
      parseProjectSearchParams(params("category=cobol"), categories).category,
    ).toBe("all");
  });
});

describe("buildProjectSearchHref", () => {
  it("sets a category and keeps the existing query", () => {
    expect(
      buildProjectSearchHref("/projects", params("q=api"), {
        category: "react",
      }),
    ).toBe("/projects?q=api&category=react");
  });

  it('removes the category param for "all"', () => {
    expect(
      buildProjectSearchHref("/projects", params("category=react"), {
        category: "all",
      }),
    ).toBe("/projects");
  });

  it("trims the query and removes it when empty", () => {
    expect(
      buildProjectSearchHref("/projects", params(""), { query: "  Next.js " }),
    ).toBe("/projects?q=Next.js");
    expect(
      buildProjectSearchHref("/projects", params("q=old&category=angular"), {
        query: "   ",
      }),
    ).toBe("/projects?category=angular");
  });

  it("preserves unrelated parameters", () => {
    expect(
      buildProjectSearchHref("/projects", params("utm_source=x"), {
        category: "angular",
      }),
    ).toBe("/projects?utm_source=x&category=angular");
  });
});
