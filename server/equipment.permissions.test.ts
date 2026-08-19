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

function ctx(role: "admin" | "inspecteur", accessStatus: "approved" | "pending"): TrpcContext {
  return { user: { id: 9, openId: "equipment-test", name: "Test", email: "test@example.com", loginMethod: "manus", role, accessStatus, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() }, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

describe("equipment administration", () => {
  it("rejects equipment mutations from an inspector", async () => {
    const caller = appRouter.createCaller(ctx("inspecteur", "approved"));
    await expect(caller.equipment.create({ name: "Bac à sable", category: "Jeu" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.equipment.setActive({ id: 1, active: false })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("allows an approved administrator to add and archive an equipment", async () => {
    const caller = appRouter.createCaller(ctx("admin", "approved"));
    await expect(caller.equipment.create({ name: "Bac à sable", category: "Jeu", description: "Zone dédiée" })).resolves.toEqual({ success: true });
    await expect(caller.equipment.update({ id: 1, name: "Bac à sable rénové", category: "Jeu", description: "Description mise à jour" })).resolves.toEqual({ success: true });
    await expect(caller.equipment.setActive({ id: 1, active: false })).resolves.toEqual({ success: true });
    expect(insertValues).toHaveBeenCalledWith(expect.objectContaining({ name: "Bac à sable", active: 1 }));
    expect(updateWhere).toHaveBeenCalled();
  });
});
