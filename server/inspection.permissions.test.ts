import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { personnelContext } from "./test-context";

describe("inspection permissions", () => {
  it("blocks a pending staff account from dashboard data", async () => {
    const caller = appRouter.createCaller(personnelContext("pending", 2));
    await expect(caller.inspections.dashboard()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("requires a personnel signature before completing a report", async () => {
    const caller = appRouter.createCaller(personnelContext("approved", 2));
    await expect(caller.inspections.save({ month: "2026-08", status: "complete", signatureData: null, notes: null, items: [] })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
