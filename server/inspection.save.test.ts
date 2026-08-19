import { describe, expect, it, vi } from "vitest";

const { saveInspectionMock } = vi.hoisted(() => ({ saveInspectionMock: vi.fn().mockResolvedValue({ id: 8, month: "2026-08", status: "draft", items: [] }) }));
vi.mock("./db", () => ({
  ensureDefaultEquipment: vi.fn(),
  getInspectionByMonth: vi.fn(),
  getUserByOpenId: vi.fn(),
  getDb: vi.fn(),
  listEquipment: vi.fn(),
  listInspections: vi.fn(),
  saveInspection: saveInspectionMock,
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const ctx = {
  user: { id: 3, openId: "approved-inspector", name: "Inspecteur", email: "inspecteur@example.com", loginMethod: "manus", role: "inspecteur", accessStatus: "approved", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: { protocol: "https", headers: {} },
  res: {},
} as TrpcContext;

describe("inspection save", () => {
  it("persists a draft with its inspection items", async () => {
    const caller = appRouter.createCaller(ctx);
    const result = await caller.inspections.save({ month: "2026-08", status: "draft", signatureData: null, notes: "RAS", items: [{ equipmentId: 1, criterion: "sécurité", status: "conforme", comment: "Fixations contrôlées" }] });
    expect(result).toEqual({ id: 8, month: "2026-08", status: "draft", items: [] });
    expect(saveInspectionMock).toHaveBeenCalledWith(expect.objectContaining({ month: "2026-08", inspectorId: 3, status: "draft", notes: "RAS" }));
  });
});
