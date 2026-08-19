import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { ensureDefaultCriteria, ensureDefaultEquipment, getInspectionByMonth, getUserByOpenId, getDb, listCriteria, listEquipment, listInspections, saveInspection } from "./db";
import { desc, eq } from "drizzle-orm";
import { criteria, users } from "../drizzle/schema";

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
