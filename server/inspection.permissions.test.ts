import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function context(accessStatus: "pending" | "approved", role: "inspecteur" | "admin" = "inspecteur"): TrpcContext {
  return {
    user: { id: 2, openId: "staff-user", name: "Inspecteur", email: "staff@example.com", loginMethod: "manus", role, accessStatus, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("inspection permissions", () => {
  it("blocks a pending staff account from dashboard data", async () => {
    const caller = appRouter.createCaller(context("pending"));
    await expect(caller.inspections.dashboard()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("requires an inspector signature before completing a report", async () => {
    const caller = appRouter.createCaller(context("approved"));
    await expect(caller.inspections.save({ month: "2026-08", status: "complete", signatureData: null, notes: null, items: [] })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
