import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { ensureDefaultEquipment, getInspectionByMonth, getUserByOpenId, getDb, listEquipment, listInspections, saveInspection } from "./db";
import { users } from "../drizzle/schema";
import { desc, eq } from "drizzle-orm";

const statusSchema = z.enum(["conforme", "non conforme", "à surveiller"]);
const criterionSchema = z.enum(["sécurité", "fiabilité", "stabilité", "état général", "propreté"]);
const authorizedProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.accessStatus !== "approved" && ctx.user.openId !== process.env.OWNER_OPEN_ID) throw new TRPCError({ code: "FORBIDDEN", message: "Votre compte doit être approuvé par un administrateur du collège." });
  return next();
});
const adminProcedure = authorizedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Accès administrateur requis." });
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
    create: adminProcedure.input(z.object({ name: z.string().min(2), category: z.string().min(2), description: z.string().optional() })).mutation(async ({ input }) => {
      const db = await import("./db").then(module => module.getDb());
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Base de données indisponible." });
      const { equipment } = await import("../drizzle/schema");
      await db.insert(equipment).values({ name: input.name, category: input.category, description: input.description ?? null, active: 1 });
      return listEquipment();
    }),
  }),
  staffAccess: router({
    list: adminProcedure.query(async () => { const db = await getDb(); return db ? db.select({ id: users.id, name: users.name, email: users.email, role: users.role, accessStatus: users.accessStatus, lastSignedIn: users.lastSignedIn }).from(users).orderBy(desc(users.lastSignedIn)) : []; }),
    setStatus: adminProcedure.input(z.object({ userId: z.number(), accessStatus: z.enum(["approved", "revoked"]) })).mutation(async ({ input }) => { const db = await getDb(); if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Base de données indisponible." }); await db.update(users).set({ accessStatus: input.accessStatus }).where(eq(users.id, input.userId)); return { success: true } as const; }),
  }),
  inspections: router({
    dashboard: authorizedProcedure.query(async () => {
      const month = new Date().toISOString().slice(0, 7);
      const [current, history, equipment] = await Promise.all([getInspectionByMonth(month), listInspections(), ensureDefaultEquipment()]);
      return { month, current, history: history.slice(0, 12), equipment };
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
