export const INSPECTION_STATUSES = ["conforme", "non conforme", "à surveiller"] as const;
export type InspectionStatusValue = typeof INSPECTION_STATUSES[number];

export function aggregateInspectionStatus(statuses: InspectionStatusValue[]): InspectionStatusValue | "pending" {
  if (statuses.length === 0) return "pending";
  if (statuses.includes("non conforme")) return "non conforme";
  if (statuses.includes("à surveiller")) return "à surveiller";
  return "conforme";
}

export function attachEquipmentMetadata<Item extends { equipmentId: number }, Equipment extends { id: number }>(items: Item[], equipmentRows: Equipment[]) {
  return items.map(item => ({ ...item, equipment: equipmentRows.find(equipment => equipment.id === item.equipmentId) }));
}

export function historicalReportItems<Item extends { equipmentId: number; criterion: string; status: string; comment?: string | null }>(items: Item[]) {
  return items.map(item => ({ ...item, criterion: item.criterion, comment: item.comment ?? null }));
}

export function completeEquipmentEntries<Entry extends { status: InspectionStatusValue; comment: string }>(equipmentId: number, criteria: readonly string[], existing: Record<string, Entry>) {
  const next = { ...existing };
  for (const criterion of criteria) {
    const key = `${equipmentId}::${criterion}`;
    next[key] = { ...(existing[key] || { comment: "" }), status: "conforme" } as Entry;
  }
  return next;
}
