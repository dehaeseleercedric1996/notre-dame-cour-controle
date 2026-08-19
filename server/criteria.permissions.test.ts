import { describe, expect, it, vi } from "vitest";

const { insertValues, updateWhere } = vi.hoisted(() => ({ insertValues: vi.fn().mockResolvedValue(undefined), updateWhere: vi.fn().mockResolvedValue(undefined) }));
const selectOrder = vi.hoisted(() => vi.fn().mockResolvedValue([]));
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    select: vi.fn(() => ({ from: vi.fn(() => ({ orderBy: selectOrder })) })),
    insert: vi.fn(() => ({ values: insertValues })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: updateWhere })) })),
  }),
  ensureDefaultCriteria: vi.fn().mockResolvedValue([]), ensureDefaultEquipment: vi.fn(), getInspectionByMonth: vi.fn(), getUserByOpenId: vi.fn(), listCriteria: vi.fn().mockResolvedValue([]), listEquipment: vi.fn(), listInspections: vi.fn(), saveInspection: vi.fn(),
}));

import { appRouter } from "./routers";
import { personnelContext } from "./test-context";

const signatureData = "data:image/png;base64,criteria-signature";

describe("criteria personnel access", () => {
  it("rejects criterion mutations from a non-approved account", async () => {
    const caller = appRouter.createCaller(personnelContext("pending", 4));
    await expect(caller.criteria.create({ name: "Accessibilité", signatureData })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("requires a signature before changing criteria", async () => {
    const caller = appRouter.createCaller(personnelContext("approved", 4));
    await expect(caller.criteria.create({ name: "Accessibilité", signatureData: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("allows approved personnel to add, modify, reorder and archive a criterion", async () => {
    const caller = appRouter.createCaller(personnelContext("approved", 4));
    await expect(caller.criteria.create({ name: "Accessibilité", signatureData })).resolves.toEqual({ success: true });
    await expect(caller.criteria.update({ id: 1, name: "Accessibilité des protections", signatureData })).resolves.toEqual({ success: true });
    await expect(caller.criteria.reorder({ items: [{ id: 1, sortOrder: 0 }], signatureData })).resolves.toEqual({ success: true });
    await expect(caller.criteria.setActive({ id: 1, active: false, signatureData })).resolves.toEqual({ success: true });
    expect(insertValues).toHaveBeenCalledWith(expect.objectContaining({ name: "Accessibilité", active: 1, lastActionBy: 4, lastActionSignature: signatureData }));
    expect(updateWhere).toHaveBeenCalled();
  });
});
