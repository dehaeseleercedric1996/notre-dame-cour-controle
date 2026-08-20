import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  authenticateRequest: vi.fn(),
  notifyOwner: vi.fn().mockResolvedValue(true),
  selectLimit: vi.fn(),
}));

vi.mock("./_core/sdk", () => ({ sdk: { authenticateRequest: mocks.authenticateRequest } }));
vi.mock("./db", () => ({ getDb: vi.fn().mockResolvedValue({ select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn(() => ({ limit: mocks.selectLimit })) })) })) }) }));
vi.mock("./_core/notification", () => ({ notifyOwner: mocks.notifyOwner }));
vi.mock("./_core/storageProxy", () => ({ registerStorageProxy: vi.fn() }));
vi.mock("./_core/oauth", () => ({ registerOAuthRoutes: vi.fn() }));

import { monthlyReminderHandler } from "./_core/index";

function response() {
  return { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() } as any;
}

describe("monthly reminder callback", () => {
  it("rejects requests that are not authenticated Heartbeat callbacks", async () => {
    mocks.authenticateRequest.mockResolvedValueOnce({ isCron: false, taskUid: null });
    const res = response();
    await monthlyReminderHandler({} as any, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("dereferences the configured task and notifies the owner", async () => {
    mocks.authenticateRequest.mockResolvedValueOnce({ isCron: true, taskUid: "task-42" });
    mocks.selectLimit.mockResolvedValueOnce([{ enabled: 1, scheduleCronTaskUid: "task-42" }]);
    const res = response();
    await monthlyReminderHandler({} as any, res);
    expect(mocks.notifyOwner).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true }));
  });
});
