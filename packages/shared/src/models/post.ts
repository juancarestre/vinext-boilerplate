import { z } from "zod";

// ---------- Schemas ----------

export const PostSchema = z.object({
  id: z.string(),
  title: z.string().min(3, "Título debe tener al menos 3 caracteres"),
  content: z.string().min(10, "Contenido debe tener al menos 10 caracteres"),
  slug: z.string(),
  authorId: z.string(),
  published: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreatePostSchema = PostSchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdatePostSchema = CreatePostSchema.partial();

// ---------- Types ----------

export type Post = z.infer<typeof PostSchema>;
export type CreatePost = z.infer<typeof CreatePostSchema>;
export type UpdatePost = z.infer<typeof UpdatePostSchema>;
