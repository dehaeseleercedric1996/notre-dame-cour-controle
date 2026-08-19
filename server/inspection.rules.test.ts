import { describe, expect, it } from "vitest";
import { aggregateInspectionStatus, attachEquipmentMetadata, completeEquipmentEntries } from "../shared/inspection";

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

  it("keeps archived equipment metadata attached to an historical item", () => {
    const archived = { id: 7, name: "Ancienne balançoire", active: 0 };
    const result = attachEquipmentMetadata([{ equipmentId: 7, criterion: "sécurité" }], [archived]);
    expect(result[0]?.equipment).toEqual(archived);
  });
});

describe("completeEquipmentEntries", () => {
  it("marks all five criteria as conforme and preserves comments", () => {
    const result = completeEquipmentEntries(7, ["sécurité", "fiabilité", "stabilité", "état général", "propreté"], { "7::sécurité": { status: "à surveiller", comment: "Zone humide" } });
    expect(Object.values(result)).toHaveLength(5);
    expect(Object.values(result).every(entry => entry.status === "conforme")).toBe(true);
    expect(result["7::sécurité"]?.comment).toBe("Zone humide");
  });
});
