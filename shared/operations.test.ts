import { describe, expect, it } from "vitest";
import { buildMonthlyReminderCron, findingStatusLabel } from "./operations";

describe("operations rules", () => {
  it("uses clear French labels for corrective-action statuses", () => {
    expect(findingStatusLabel("open")).toBe("Ouverte");
    expect(findingStatusLabel("in_progress")).toBe("En cours");
    expect(findingStatusLabel("resolved")).toBe("Résolue");
  });

  it("builds a bounded monthly reminder cron expression", () => {
    expect(buildMonthlyReminderCron(15, 8)).toBe("0 0 8 15 * *");
    expect(buildMonthlyReminderCron(99, -3)).toBe("0 0 0 28 * *");
  });
});
