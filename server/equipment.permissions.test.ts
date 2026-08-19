import { describe, expect, it, vi } from "vitest";

const { insertValues, updateWhere } = vi.hoisted(() => ({ insertValues: vi.fn().mockResolvedValue(undefined), updateWhere: vi.fn().mockResolvedValue(undefined) }));
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    insert: vi.fn(() => ({ values: insertValues })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: updateWhere })) })),
  }),
  ensureDefaultEquipment: vi.fn(), getInspectionByMonth: vi.fn(), getUserByOpenId: vi.fn(), listEquipment: vi.fn(), listInspections: vi.fn(), saveInspection: vi.fn(),
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { personnelContext } from "./test-context";

function ctx(accessStatus: "approved" | "pending"): TrpcContext {
  return personnelContext(accessStatus, 9);
}

const signatureData = "data:image/png;base64,personnel-signature";

describe("equipment personnel access", () => {
  it("rejects equipment mutations from a non-approved account", async () => {
    const caller = appRouter.createCaller(ctx("pending"));
    await expect(caller.equipment.create({ name: "Bac à sable", category: "Jeu", signatureData })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("requires a signature before allowing an approved member to add equipment", async () => {
    const caller = appRouter.createCaller(ctx("approved"));
    await expect(caller.equipment.create({ name: "Bac à sable", category: "Jeu", signatureData: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("allows an approved member to add, modify and archive an equipment", async () => {
    const caller = appRouter.createCaller(ctx("approved"));
    await expect(caller.equipment.create({ name: "Bac à sable", category: "Jeu", description: "Zone dédiée", signatureData })).resolves.toEqual({ success: true });
    await expect(caller.equipment.update({ id: 1, name: "Bac à sable rénové", category: "Jeu", description: "Description mise à jour", signatureData })).resolves.toEqual({ success: true });
    await expect(caller.equipment.setActive({ id: 1, active: false, signatureData })).resolves.toEqual({ success: true });
    await expect(caller.equipment.setActive({ id: 1, active: true, signatureData })).resolves.toEqual({ success: true });
    expect(insertValues).toHaveBeenCalledWith(expect.objectContaining({ name: "Bac à sable", active: 1, lastActionBy: 9, lastActionSignature: signatureData }));
    expect(updateWhere).toHaveBeenCalled();
  });
});
