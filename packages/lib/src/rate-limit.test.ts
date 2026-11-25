import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit.js";

function createClock(start = 0) {
  let time = start;

  return {
    now: () => time,
    advance: (ms: number) => {
      time += ms;
    },
  };
}

describe("createRateLimiter", () => {
  it("allows hits up to the limit and then blocks", () => {
    const clock = createClock();
    const limiter = createRateLimiter({
      limit: 2,
      windowMs: 1000,
      now: clock.now,
    });

    expect(limiter.check("ip")).toEqual({ allowed: true, remaining: 1 });
    expect(limiter.check("ip")).toEqual({ allowed: true, remaining: 0 });
    clock.advance(250);
    expect(limiter.check("ip")).toEqual({ allowed: false, retryAfterMs: 750 });
  });

  it("frees capacity once the window slides past old hits", () => {
    const clock = createClock();
    const limiter = createRateLimiter({
      limit: 1,
      windowMs: 1000,
      now: clock.now,
    });

    limiter.check("ip");
    clock.advance(1000);
    expect(limiter.check("ip").allowed).toBe(true);
  });

  it("tracks keys independently", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000 });

    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("b").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(false);
  });

  it("evicts the oldest key when maxKeys is reached", () => {
    const clock = createClock();
    const limiter = createRateLimiter({
      limit: 1,
      windowMs: 1000,
      maxKeys: 2,
      now: clock.now,
    });

    limiter.check("a");
    limiter.check("b");
    limiter.check("c");
    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("c").allowed).toBe(false);
  });
});
