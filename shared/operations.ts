export type FindingStatus = "open" | "in_progress" | "resolved";

export function findingStatusLabel(status: FindingStatus) {
  return { open: "Ouverte", in_progress: "En cours", resolved: "Résolue" }[status];
}

export function buildMonthlyReminderCron(dayOfMonth: number, hourUtc: number) {
  const safeDay = Math.min(28, Math.max(1, Math.trunc(dayOfMonth)));
  const safeHour = Math.min(23, Math.max(0, Math.trunc(hourUtc)));
  return `0 0 ${safeHour} ${safeDay} * *`;
}
