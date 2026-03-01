import { router } from "./trpc";
import { usersRouter } from "./routers/users";
import { postsRouter } from "./routers/posts";
import { guestbookRouter } from "./routers/guestbook";

export const appRouter = router({
  users: usersRouter,
  posts: postsRouter,
  guestbook: guestbookRouter,
});

// Exportar el tipo para usarlo en el cliente (type-only import)
export type AppRouter = typeof appRouter;
