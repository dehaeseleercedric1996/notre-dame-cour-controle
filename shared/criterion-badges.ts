export type CriterionBadge = { label: "Nouveau" | "Modifié"; className: string } | null;

export function getCriterionBadge(createdAt: Date | string | null | undefined, updatedAt: Date | string | null | undefined, now = Date.now()): CriterionBadge {
  const within = (value: Date | string | null | undefined, days: number) => {
    if (!value) return false;
    const timestamp = new Date(value).getTime();
    return Number.isFinite(timestamp) && now - timestamp >= 0 && now - timestamp <= days * 24 * 60 * 60 * 1000;
  };
  if (within(createdAt, 30)) return { label: "Nouveau", className: "bg-[#eee8ff] text-[#6b4db3]" };
  if (within(updatedAt, 14)) return { label: "Modifié", className: "bg-[#fff0d4] text-[#a96916]" };
  return null;
}
