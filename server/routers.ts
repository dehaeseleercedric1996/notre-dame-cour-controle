import { TRPCError } from "@trpc/server";
import { parse as parseCookie } from "cookie";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { ensureDefaultCriteria, ensureDefaultEquipment, getAnnualStats, getInspectionByMonth, getUserByOpenId, getDb, listApprovedUsers, listAuditLogs, listCriteria, listEquipment, listFindings, listInspections, saveInspection } from "./db";
import { desc, eq } from "drizzle-orm";
import { auditLog, criteria, findings, reminderSettings, users } from "../drizzle/schema";
import { storagePut } from "./storage";
import { createHeartbeatJob, updateHeartbeatJob } from "./_core/heartbeat";
import { COOKIE_NAME } from "@shared/const";

const statusSchema = z.enum(["conforme", "non conforme", "à surveiller"]);
const criterionSchema = z.string().trim().min(1).max(80);
const authorizedProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.accessStatus !== "approved" && ctx.user.openId !== process.env.OWNER_OPEN_ID) throw new TRPCError({ code: "FORBIDDEN", message: "Votre compte doit être approuvé par un administrateur du collège." });
  return next();
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  people: router({ approved: authorizedProcedure.query(() => listApprovedUsers()) }),
  equipment: router({
    list: authorizedProcedure.query(() => listEquipment()),
    manageList: authorizedProcedure.query(async () => { const db = await getDb(); if (!db) return []; const { equipment } = await import("../drizzle/schema"); return db.select({ id: equipment.id, name: equipment.name, category: equipment.category, description: equipment.description, active: equipment.active, lastActionBy: equipment.lastActionBy, lastActionSignature: equipment.lastActionSignature, updatedAt: equipment.updatedAt, authorName: users.name, authorEmail: users.email }).from(equipment).leftJoin(users, eq(equipment.lastActionBy, users.id)).orderBy(desc(equipment.active), desc(equipment.updatedAt)); }),
    create: authorizedProcedure.input(z.object({ name: z.string().min(2), category: z.string().min(2), description: z.string().optional(), signatureData: z.string().min(10) })).mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Base de données indisponible." });
      const { equipment } = await import("../drizzle/schema");
      await db.insert(equipment).values({ name: input.name.trim(), category: input.category.trim(), description: input.description?.trim() || null, active: 1, lastActionBy: ctx.user.id, lastActionSignature: input.signatureData });
      return { success: true } as const;
    }),
    update: authorizedProcedure.input(z.object({ id: z.number(), name: z.string().min(2), category: z.string().min(2), description: z.string().optional(), signatureData: z.string().min(10) })).mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Base de données indisponible." });
      const { equipment } = await import("../drizzle/schema");
      await db.update(equipment).set({ name: input.name.trim(), category: input.category.trim(), description: input.description?.trim() || null, lastActionBy: ctx.user.id, lastActionSignature: input.signatureData }).where(eq(equipment.id, input.id));
      return { success: true } as const;
    }),
    setActive: authorizedProcedure.input(z.object({ id: z.number(), active: z.boolean(), signatureData: z.string().min(10) })).mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Base de données indisponible." });
      const { equipment } = await import("../drizzle/schema");
      await db.update(equipment).set({ active: input.active ? 1 : 0, lastActionBy: ctx.user.id, lastActionSignature: input.signatureData }).where(eq(equipment.id, input.id));
      return { success: true } as const;
    }),
  }),
  criteria: router({
    list: authorizedProcedure.query(() => listCriteria()),
    manageList: authorizedProcedure.query(() => listCriteria(true)),
    create: authorizedProcedure.input(z.object({ name: z.string().trim().min(2).max(80), signatureData: z.string().min(10) })).mutation(async ({ ctx, input }) => {
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Base de données indisponible." });
      const existing = await db.select().from(criteria).orderBy(criteria.sortOrder, criteria.id);
      await db.insert(criteria).values({ name: input.name, active: 1, sortOrder: existing.length, lastActionBy: ctx.user.id, lastActionSignature: input.signatureData });
      return { success: true } as const;
    }),
    update: authorizedProcedure.input(z.object({ id: z.number(), name: z.string().trim().min(2).max(80), signatureData: z.string().min(10) })).mutation(async ({ ctx, input }) => {
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Base de données indisponible." });
      await db.update(criteria).set({ name: input.name, lastActionBy: ctx.user.id, lastActionSignature: input.signatureData }).where(eq(criteria.id, input.id));
      return { success: true } as const;
    }),
    setActive: authorizedProcedure.input(z.object({ id: z.number(), active: z.boolean(), signatureData: z.string().min(10) })).mutation(async ({ ctx, input }) => {
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Base de données indisponible." });
      await db.update(criteria).set({ active: input.active ? 1 : 0, lastActionBy: ctx.user.id, lastActionSignature: input.signatureData }).where(eq(criteria.id, input.id));
      return { success: true } as const;
    }),
    reorder: authorizedProcedure.input(z.object({ items: z.array(z.object({ id: z.number(), sortOrder: z.number().int().min(0) })).min(1), signatureData: z.string().min(10) })).mutation(async ({ ctx, input }) => {
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Base de données indisponible." });
      for (const item of input.items) await db.update(criteria).set({ sortOrder: item.sortOrder, lastActionBy: ctx.user.id, lastActionSignature: input.signatureData }).where(eq(criteria.id, item.id));
      return { success: true } as const;
    }),
  }),
  findings: router({
    list: authorizedProcedure.input(z.object({ status: z.enum(["open", "in_progress", "resolved"]).optional(), year: z.number().int().optional() }).optional()).query(({ input }) => listFindings(input)),
    create: authorizedProcedure.input(z.object({ inspectionId: z.number().int(), equipmentId: z.number().int(), criterion: criterionSchema, description: z.string().trim().min(3), dueDate: z.string().optional(), responsibleId: z.number().int().optional(), signatureData: z.string().min(10), photoData: z.string().optional(), photoMimeType: z.string().optional() })).mutation(async ({ ctx, input }) => {
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Base de données indisponible." });
      let photoKey: string | undefined; let photoUrl: string | undefined;
      if (input.photoData) { const raw = input.photoData.includes(",") ? input.photoData.split(",")[1] : input.photoData; const uploaded = await storagePut(`findings/${ctx.user.id}/${Date.now()}`, Buffer.from(raw, "base64"), input.photoMimeType || "image/jpeg"); photoKey = uploaded.key; photoUrl = uploaded.url; }
      const result = await db.insert(findings).values({ inspectionId: input.inspectionId, equipmentId: input.equipmentId, criterion: input.criterion, description: input.description, dueDate: input.dueDate ? new Date(input.dueDate) : null, responsibleId: input.responsibleId ?? null, createdBy: ctx.user.id, photoKey: photoKey ?? null, photoUrl: photoUrl ?? null });
      const findingId = Number(result[0].insertId);
      await db.insert(auditLog).values({ entityType: "finding", entityId: findingId, action: "created", actorId: ctx.user.id, signatureData: input.signatureData, details: input.description });
      return { success: true, id: findingId } as const;
    }),
    update: authorizedProcedure.input(z.object({ id: z.number().int(), status: z.enum(["open", "in_progress", "resolved"]).optional(), resolution: z.string().optional(), responsibleId: z.number().int().nullable().optional(), dueDate: z.string().nullable().optional(), signatureData: z.string().min(10) })).mutation(async ({ ctx, input }) => {
      const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Base de données indisponible." });
      await db.update(findings).set({ status: input.status, resolution: input.resolution ?? null, responsibleId: input.responsibleId ?? null, dueDate: input.dueDate ? new Date(input.dueDate) : null, resolvedAt: input.status === "resolved" ? new Date() : null }).where(eq(findings.id, input.id));
      await db.insert(auditLog).values({ entityType: "finding", entityId: input.id, action: input.status === "resolved" ? "resolved" : "updated", actorId: ctx.user.id, signatureData: input.signatureData, details: input.resolution || input.status || "Mise à jour" });
      return { success: true } as const;
    }),
  }),
  audit: router({ list: authorizedProcedure.input(z.object({ entityType: z.string().optional(), entityId: z.number().int().optional() }).optional()).query(({ input }) => listAuditLogs(input?.entityType, input?.entityId)) }),
  stats: router({ annual: authorizedProcedure.input(z.object({ year: z.number().int().min(2020).max(2100) })).query(({ input }) => getAnnualStats(input.year)) }),
  reminders: router({
    settings: authorizedProcedure.query(async () => { const db = await getDb(); if (!db) return null; return (await db.select().from(reminderSettings).limit(1))[0] || null; }),
    configure: authorizedProcedure.input(z.object({ enabled: z.boolean(), dayOfMonth: z.number().int().min(1).max(28), hourUtc: z.number().int().min(0).max(23) })).mutation(async ({ ctx, input }) => { const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Base de données indisponible." }); const existing = (await db.select().from(reminderSettings).limit(1))[0]; const sessionToken = parseCookie(ctx.req.headers.cookie || "")[COOKIE_NAME] || ""; const cron = `0 0 ${input.hourUtc} ${input.dayOfMonth} * *`; let taskUid = existing?.scheduleCronTaskUid || null; if (input.enabled && !taskUid) { const job = await createHeartbeatJob({ name: "cour-controle-rappel-mensuel", cron, path: "/api/scheduled/monthly-reminder", description: "Rappel mensuel du contrôle de la cour" }, sessionToken); taskUid = job.taskUid; } else if (taskUid) { await updateHeartbeatJob(taskUid, { cron, path: "/api/scheduled/monthly-reminder", enable: input.enabled }, sessionToken); } if (existing) await db.update(reminderSettings).set({ enabled: input.enabled ? 1 : 0, dayOfMonth: input.dayOfMonth, hourUtc: input.hourUtc, scheduleCronTaskUid: taskUid }).where(eq(reminderSettings.id, existing.id)); else await db.insert(reminderSettings).values({ enabled: input.enabled ? 1 : 0, dayOfMonth: input.dayOfMonth, hourUtc: input.hourUtc, scheduleCronTaskUid: taskUid }); return { success: true, taskUid } as const; }),
  }),
  inspections: router({
    dashboard: authorizedProcedure.query(async () => {
      const month = new Date().toISOString().slice(0, 7);
      const [current, history, equipment, criteriaRows] = await Promise.all([getInspectionByMonth(month), listInspections(), ensureDefaultEquipment(), ensureDefaultCriteria()]);
      return { month, current, history: history.slice(0, 12), equipment, criteria: criteriaRows };
    }),
    byMonth: authorizedProcedure.input(z.object({ month: z.string().regex(/^\d{4}-\d{2}$/) })).query(({ input }) => getInspectionByMonth(input.month)),
    history: authorizedProcedure.input(z.object({ month: z.string().optional(), equipmentId: z.number().optional() }).optional()).query(async ({ input }) => {
      const rows = await listInspections(input?.month);
      if (!input?.equipmentId) return rows;
      return rows.map(row => ({ ...row, items: row.items.filter(item => item.equipmentId === input.equipmentId) })).filter(row => row.items.length > 0);
    }),
    save: authorizedProcedure.input(z.object({
      month: z.string().regex(/^\d{4}-\d{2}$/),
      status: z.enum(["draft", "complete"]),
      signatureData: z.string().nullable().optional(),
      notes: z.string().nullable().optional(),
      items: z.array(z.object({ equipmentId: z.number(), criterion: criterionSchema, status: statusSchema, comment: z.string().nullable().optional() })),
    })).mutation(async ({ ctx, input }) => {
      if (input.status === "complete" && !input.signatureData) throw new TRPCError({ code: "BAD_REQUEST", message: "La signature de l’inspecteur est obligatoire pour clôturer le contrôle." });
      return saveInspection({ ...input, inspectorId: ctx.user.id, completedAt: input.status === "complete" ? new Date() : null });
    }),
  }),
});

export type AppRouter = typeof appRouter;
