import { describe, expect, it } from "vitest";
import { getCriterionBadge } from "./criterion-badges";

const DAY = 24 * 60 * 60 * 1000;
const now = Date.parse("2026-08-19T12:00:00.000Z");

describe("criterion recency badges", () => {
  it("marks a criterion created within 30 days as Nouveau", () => {
    const badge = getCriterionBadge(new Date(now - 10 * DAY), new Date(now - 10 * DAY), now);
    expect(badge?.label).toBe("Nouveau");
    expect(badge?.className).toContain("#eee8ff");
  });

  it("marks an older criterion modified within 14 days as Modifié", () => {
    const badge = getCriterionBadge(new Date(now - 60 * DAY), new Date(now - 5 * DAY), now);
    expect(badge?.label).toBe("Modifié");
    expect(badge?.className).toContain("#fff0d4");
  });

  it("hides the badge after both recency windows", () => {
    expect(getCriterionBadge(new Date(now - 60 * DAY), new Date(now - 30 * DAY), now)).toBeNull();
  });
});
