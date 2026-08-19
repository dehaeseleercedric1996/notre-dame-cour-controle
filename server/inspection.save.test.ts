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
import { personnelContext } from "./test-context";
import { completeEquipmentEntries } from "../shared/inspection";

const ctx: TrpcContext = personnelContext("approved", 3);

describe("inspection save", () => {
  it("persists a draft with its inspection items", async () => {
    const caller = appRouter.createCaller(ctx);
    const result = await caller.inspections.save({ month: "2026-08", status: "draft", signatureData: null, notes: "RAS", items: [{ equipmentId: 1, criterion: "sécurité", status: "conforme", comment: "Fixations contrôlées" }] });
    expect(result).toEqual({ id: 8, month: "2026-08", status: "draft", items: [] });
    expect(saveInspectionMock).toHaveBeenCalledWith(expect.objectContaining({ month: "2026-08", inspectorId: 3, status: "draft", notes: "RAS" }));
  });
});

  it("persists the five conform criteria produced by the quick validation action", async () => {
    const entries = completeEquipmentEntries(1, ["sécurité", "fiabilité", "stabilité", "état général", "propreté"], {});
    const items = Object.entries(entries).map(([key, entry]) => { const [equipmentId, criterion] = key.split("::"); return { equipmentId: Number(equipmentId), criterion, status: entry.status, comment: entry.comment || null }; });
    const caller = appRouter.createCaller(ctx);
    await caller.inspections.save({ month: "2026-08", status: "draft", signatureData: null, notes: null, items });
    expect(saveInspectionMock).toHaveBeenLastCalledWith(expect.objectContaining({ status: "draft", items: expect.arrayContaining(items) }));
    expect(items).toHaveLength(5);
    expect(items.every(item => item.status === "conforme")).toBe(true);
  });

  it("accepts a custom criterion label in a historical report", async () => {
    const caller = appRouter.createCaller(ctx);
    await caller.inspections.save({ month: "2026-09", status: "draft", signatureData: null, notes: null, items: [{ equipmentId: 1, criterion: "Accessibilité des protections", status: "conforme", comment: "Contrôlé" }] });
    expect(saveInspectionMock).toHaveBeenLastCalledWith(expect.objectContaining({ items: [expect.objectContaining({ criterion: "Accessibilité des protections" })] }));
  });
