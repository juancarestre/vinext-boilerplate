import { z } from "zod";

// ---------- Schemas ----------

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  role: z.enum(["admin", "user", "viewer"]),
  createdAt: z.string().datetime(),
});

export const CreateUserSchema = UserSchema.omit({ id: true, createdAt: true });

export const UpdateUserSchema = CreateUserSchema.partial();

// ---------- Types (inferred from Zod) ----------

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
