export const INSPECTION_STATUSES = ["conforme", "non conforme", "à surveiller"] as const;
export type InspectionStatusValue = typeof INSPECTION_STATUSES[number];

export function aggregateInspectionStatus(statuses: InspectionStatusValue[]): InspectionStatusValue | "pending" {
  if (statuses.length === 0) return "pending";
  if (statuses.includes("non conforme")) return "non conforme";
  if (statuses.includes("à surveiller")) return "à surveiller";
  return "conforme";
}
