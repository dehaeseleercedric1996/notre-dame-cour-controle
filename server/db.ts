import { and, desc, eq, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { DEFAULT_EQUIPMENT, InsertUser, equipment, inspectionItems, inspections, users } from "../drizzle/schema";
import { attachEquipmentMetadata } from "../shared/inspection";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; }
  }
  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role !== undefined || user.openId === ENV.ownerOpenId) {
    values.role = user.role ?? "admin";
    updateSet.role = values.role;
  }
  if (user.openId === ENV.ownerOpenId) {
    values.accessStatus = "approved";
    updateSet.accessStatus = "approved";
  }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function ensureDefaultEquipment() {
  const db = await getDb();
  if (!db) return [];
  const existing = await db.select().from(equipment).where(eq(equipment.active, 1));
  if (existing.length === 0) {
    await db.insert(equipment).values(DEFAULT_EQUIPMENT.map(item => ({ ...item, active: 1 })));
    return db.select().from(equipment).where(eq(equipment.active, 1));
  }
  return existing;
}

export async function listEquipment() {
  return ensureDefaultEquipment();
}

export async function getInspectionByMonth(month: string) {
  const db = await getDb();
  if (!db) return undefined;
  const inspection = (await db.select().from(inspections).where(eq(inspections.month, month)).limit(1))[0];
  if (!inspection) return undefined;
  const items = await db.select().from(inspectionItems).where(eq(inspectionItems.inspectionId, inspection.id));
  const equipmentRows = items.length ? await db.select().from(equipment).where(inArray(equipment.id, items.map(item => item.equipmentId))) : [];
  return { ...inspection, items: attachEquipmentMetadata(items, equipmentRows) };
}

export async function listInspections(month?: string) {
  const db = await getDb();
  if (!db) return [];
  const rows = month
    ? await db.select().from(inspections).where(eq(inspections.month, month)).orderBy(desc(inspections.month))
    : await db.select().from(inspections).orderBy(desc(inspections.month));
  if (rows.length === 0) return [];
  const ids = rows.map(row => row.id);
  const items = await db.select().from(inspectionItems).where(inArray(inspectionItems.inspectionId, ids));
  const equipmentRows = items.length ? await db.select().from(equipment).where(inArray(equipment.id, items.map(item => item.equipmentId))) : [];
  return rows.map(row => ({ ...row, items: attachEquipmentMetadata(items.filter(item => item.inspectionId === row.id), equipmentRows) }));
}

export async function saveInspection(input: {
  month: string;
  inspectorId: number;
  status: "draft" | "complete";
  signatureData?: string | null;
  notes?: string | null;
  completedAt?: Date | null;
  items: Array<{ equipmentId: number; criterion: string; status: "conforme" | "non conforme" | "à surveiller"; comment?: string | null }>;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database unavailable");
  await db.insert(inspections).values({
    month: input.month,
    inspectorId: input.inspectorId,
    status: input.status,
    signatureData: input.signatureData ?? null,
    notes: input.notes ?? null,
    completedAt: input.completedAt ?? null,
  }).onDuplicateKeyUpdate({
    set: { inspectorId: input.inspectorId, status: input.status, signatureData: input.signatureData ?? null, notes: input.notes ?? null, completedAt: input.completedAt ?? null },
  });
  const inspection = (await db.select().from(inspections).where(eq(inspections.month, input.month)).limit(1))[0];
  if (!inspection) throw new Error("Inspection could not be saved");
  for (const item of input.items) {
    await db.insert(inspectionItems).values({ inspectionId: inspection.id, ...item, comment: item.comment ?? null }).onDuplicateKeyUpdate({ set: { status: item.status, comment: item.comment ?? null } });
  }
  return getInspectionByMonth(input.month);
}
