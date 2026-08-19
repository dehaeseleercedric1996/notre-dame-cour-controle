import { describe, expect, it } from "vitest";
import { aggregateInspectionStatus } from "../shared/inspection";

describe("inspection status rules", () => {
  it("marks an equipment non conforme when at least one criterion is non conforme", () => {
    expect(aggregateInspectionStatus(["conforme", "à surveiller", "non conforme"])).toBe("non conforme");
  });

  it("marks an equipment à surveiller when no criterion is red but one is orange", () => {
    expect(aggregateInspectionStatus(["conforme", "à surveiller", "conforme"])).toBe("à surveiller");
  });

  it("marks an equipment conforme only when every criterion is conforme", () => {
    expect(aggregateInspectionStatus(["conforme", "conforme", "conforme"])).toBe("conforme");
  });

  it("returns pending when no criterion has been entered", () => {
    expect(aggregateInspectionStatus([])).toBe("pending");
  });
});
