import { describe, expect, it, vi } from "vitest";
import { personnelContext } from "./test-context";

const mocks = vi.hoisted(() => ({
  insertValues: vi.fn().mockResolvedValue([{ insertId: 42 }]),
  updateWhere: vi.fn().mockResolvedValue(undefined),
  selectLimit: vi.fn().mockResolvedValue([]),
  createJob: vi.fn().mockResolvedValue({ taskUid: "task-42" }),
  updateJob: vi.fn().mockResolvedValue({ nextExecutionAt: null }),
}));

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    insert: vi.fn(() => ({ values: mocks.insertValues })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: mocks.updateWhere })) })),
    select: vi.fn(() => ({ from: vi.fn(() => ({ limit: mocks.selectLimit })) })),
  }),
  ensureDefaultCriteria: vi.fn(), ensureDefaultEquipment: vi.fn(), getAnnualStats: vi.fn(), getInspectionByMonth: vi.fn(), getUserByOpenId: vi.fn(), listApprovedUsers: vi.fn(), listAuditLogs: vi.fn(), listCriteria: vi.fn(), listEquipment: vi.fn(), listFindings: vi.fn(), listInspections: vi.fn(), saveInspection: vi.fn(),
}));
vi.mock("./_core/heartbeat", () => ({ createHeartbeatJob: mocks.createJob, updateHeartbeatJob: mocks.updateJob }));
vi.mock("./storage", () => ({ storagePut: vi.fn() }));

import { appRouter } from "./routers";

const signatureData = "data:image/png;base64,personnel-signature";

describe("enhancement mutations", () => {
  it("creates a signed finding and writes an audit entry", async () => {
    const result = await appRouter.createCaller(personnelContext()).findings.create({ inspectionId: 1, equipmentId: 2, criterion: "sécurité", description: "Fixation à vérifier", dueDate: "2026-09-01", responsibleId: 3, signatureData });
    expect(result).toEqual({ success: true, id: 42 });
    expect(mocks.insertValues).toHaveBeenCalledWith(expect.objectContaining({ responsibleId: 3, createdBy: 1 }));
    expect(mocks.insertValues).toHaveBeenCalledWith(expect.objectContaining({ entityType: "finding", entityId: 42, signatureData }));
  });

  it("updates an anomaly with a signed corrective action", async () => {
    await appRouter.createCaller(personnelContext()).findings.update({ id: 42, status: "resolved", resolution: "Fixation resserrée", responsibleId: 3, dueDate: "2026-09-01", signatureData });
    expect(mocks.updateWhere).toHaveBeenCalled();
    expect(mocks.insertValues).toHaveBeenCalledWith(expect.objectContaining({ action: "resolved", entityId: 42, signatureData }));
  });

  it("creates then pauses the real monthly Heartbeat job", async () => {
    const caller = appRouter.createCaller(personnelContext());
    await caller.reminders.configure({ enabled: true, dayOfMonth: 5, hourUtc: 7 });
    expect(mocks.createJob).toHaveBeenCalledWith(expect.objectContaining({ path: "/api/scheduled/monthly-reminder", cron: "0 0 7 5 * *" }), "");
    mocks.selectLimit.mockResolvedValueOnce([{ id: 1, enabled: 1, dayOfMonth: 5, hourUtc: 7, scheduleCronTaskUid: "task-42" }]);
    await caller.reminders.configure({ enabled: false, dayOfMonth: 5, hourUtc: 7 });
    expect(mocks.updateJob).toHaveBeenCalledWith("task-42", expect.objectContaining({ enable: false }), "");
  });
});
