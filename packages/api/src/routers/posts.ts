import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import {
  CreatePostSchema,
  UpdatePostSchema,
  type Post,
} from "@vinext-boilerplate/shared";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// In-memory store
const posts: Map<string, Post> = new Map([
  [
    "1",
    {
      id: "1",
      title: "Que es Vinext?",
      content:
        "Vinext es un plugin de Vite que reimplementa la API de Next.js con deploy a Cloudflare Workers.",
      slug: "que-es-vinext",
      authorId: "1",
      published: true,
      createdAt: new Date("2026-02-20").toISOString(),
      updatedAt: new Date("2026-02-20").toISOString(),
    },
  ],
  [
    "2",
    {
      id: "2",
      title: "tRPC + Hono en Workers",
      content:
        "Combinando tRPC para type safety end-to-end con Hono como server framework sobre Cloudflare Workers.",
      slug: "trpc-hono-workers",
      authorId: "2",
      published: true,
      createdAt: new Date("2026-02-25").toISOString(),
      updatedAt: new Date("2026-02-25").toISOString(),
    },
  ],
]);

export const postsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({ published: z.boolean().optional() })
        .optional()
    )
    .query(({ input }) => {
      let result = Array.from(posts.values());
      if (input?.published !== undefined) {
        result = result.filter((p) => p.published === input.published);
      }
      return result;
    }),

  getById: publicProcedure
    .input(z.string())
    .query(({ input }) => {
      const post = posts.get(input);
      if (!post) throw new Error(`Post ${input} not found`);
      return post;
    }),

  getBySlug: publicProcedure
    .input(z.string())
    .query(({ input }) => {
      const post = Array.from(posts.values()).find((p) => p.slug === input);
      if (!post) throw new Error(`Post with slug "${input}" not found`);
      return post;
    }),

  create: publicProcedure
    .input(CreatePostSchema)
    .mutation(({ input }) => {
      const id = String(Date.now());
      const now = new Date().toISOString();
      const post: Post = {
        id,
        ...input,
        slug: slugify(input.title),
        createdAt: now,
        updatedAt: now,
      };
      posts.set(id, post);
      return post;
    }),

  update: publicProcedure
    .input(z.object({ id: z.string(), data: UpdatePostSchema }))
    .mutation(({ input }) => {
      const existing = posts.get(input.id);
      if (!existing) throw new Error(`Post ${input.id} not found`);
      const updated: Post = {
        ...existing,
        ...input.data,
        slug: input.data.title ? slugify(input.data.title) : existing.slug,
        updatedAt: new Date().toISOString(),
      };
      posts.set(input.id, updated);
      return updated;
    }),

  delete: publicProcedure
    .input(z.string())
    .mutation(({ input }) => {
      const existed = posts.delete(input);
      return { success: existed };
    }),
});
