import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["inspecteur", "admin"]).default("inspecteur").notNull(),
  accessStatus: mysqlEnum("accessStatus", ["pending", "approved", "revoked"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const criteria = mysqlTable("criteria", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 80 }).notNull().unique(),
  active: int("active").default(1).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  lastActionBy: int("lastActionBy"),
  lastActionSignature: text("lastActionSignature"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const equipment = mysqlTable("equipment", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  description: text("description"),
  active: int("active").default(1).notNull(),
  lastActionBy: int("lastActionBy"),
  lastActionSignature: text("lastActionSignature"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const inspections = mysqlTable("inspections", {
  id: int("id").autoincrement().primaryKey(),
  month: varchar("month", { length: 7 }).notNull(),
  inspectorId: int("inspectorId").notNull(),
  status: mysqlEnum("status", ["draft", "complete"]).default("draft").notNull(),
  signatureData: text("signatureData"),
  notes: text("notes"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ monthUnique: uniqueIndex("inspections_month_unique").on(table.month) }));

export const inspectionItems = mysqlTable("inspection_items", {
  id: int("id").autoincrement().primaryKey(),
  inspectionId: int("inspectionId").notNull(),
  equipmentId: int("equipmentId").notNull(),
  criterion: varchar("criterion", { length: 40 }).notNull(),
  status: mysqlEnum("status", ["conforme", "non conforme", "à surveiller"]).default("à surveiller").notNull(),
  comment: text("comment"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({ itemUnique: uniqueIndex("inspection_items_unique").on(table.inspectionId, table.equipmentId, table.criterion) }));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type CriterionRow = typeof criteria.$inferSelect;
export type Equipment = typeof equipment.$inferSelect;
export type Inspection = typeof inspections.$inferSelect;
export type InspectionItem = typeof inspectionItems.$inferSelect;

export const CRITERIA = ["sécurité", "fiabilité", "stabilité", "état général", "propreté"] as const;
export type Criterion = typeof CRITERIA[number];
export const STATUSES = ["conforme", "non conforme", "à surveiller"] as const;
export type InspectionStatus = typeof STATUSES[number];

export const DEFAULT_EQUIPMENT = [
  { name: "Toboggan", category: "Structures de jeu", description: "Glissière, plateforme, accès et protections." },
  { name: "Balançoires", category: "Structures de jeu", description: "Sièges, chaînes, fixations et zone de réception." },
  { name: "Structures de jeu", category: "Structures de jeu", description: "Modules, assemblages, protections et accès." },
  { name: "Clôtures et portillons", category: "Aménagement", description: "Continuité, fermeture, fixations et absence de danger." },
  { name: "Sol et zones de réception", category: "Aménagement", description: "Revêtement, nivellement, obstacles et drainage." },
  { name: "Mobilier extérieur", category: "Mobilier", description: "Bancs, tables, corbeilles et éléments fixés." },
] as const;
