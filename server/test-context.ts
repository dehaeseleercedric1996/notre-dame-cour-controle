import type { TrpcContext } from "./_core/context";

export function personnelUser(accessStatus: "pending" | "approved" | "revoked" = "approved", id = 1): NonNullable<TrpcContext["user"]> {
  return { id, openId: `staff-${id}`, name: "Personnel autorisé", email: `personnel-${id}@example.com`, loginMethod: "manus", role: "inspecteur", accessStatus, createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() };
}

export function personnelContext(accessStatus: "pending" | "approved" | "revoked" = "approved", id = 1): TrpcContext {
  return { user: personnelUser(accessStatus, id), req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}
