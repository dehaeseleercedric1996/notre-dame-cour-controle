import { describe, expect, it, vi } from "vitest";
import { personnelContext } from "./test-context";

vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    listFindings: vi.fn(async () => [{ id: 10, status: "open", equipmentId: 2, criterion: "sécurité", description: "Fixation à vérifier" }]),
    listAuditLogs: vi.fn(async () => [{ log: { id: 1, action: "created", entityType: "finding", createdAt: new Date() }, actorName: "Personnel autorisé" }]),
    getAnnualStats: vi.fn(async () => ({ year: 2026, totals: { conforme: 4, aSurveiller: 1, nonConforme: 0, anomaliesResolues: 2 }, months: [] })),
    getDb: vi.fn(async () => ({ select: () => ({ from: () => ({ limit: async () => [{ id: 1, enabled: 1, dayOfMonth: 1, hourUtc: 8, scheduleCronTaskUid: "task-1" }] }) }) })),
  };
});

import { appRouter } from "./routers";

describe("enhancement routes", () => {
  it("returns findings for approved personnel", async () => {
    const result = await appRouter.createCaller(personnelContext()).findings.list({ year: 2026 });
    expect(result[0]?.criterion).toBe("sécurité");
  });

  it("returns signed audit entries", async () => {
    const result = await appRouter.createCaller(personnelContext()).audit.list();
    expect(result[0]?.actorName).toBe("Personnel autorisé");
  });

  it("returns reminder settings", async () => {
    const result = await appRouter.createCaller(personnelContext()).reminders.settings();
    expect(result?.scheduleCronTaskUid).toBe("task-1");
  });

  it("returns annual statistics", async () => {
    const result = await appRouter.createCaller(personnelContext()).stats.annual({ year: 2026 });
    expect(result.totals.anomaliesResolues).toBe(2);
  });

  it("blocks pending personnel from enhancement routes", async () => {
    await expect(appRouter.createCaller(personnelContext("pending")).findings.list()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
