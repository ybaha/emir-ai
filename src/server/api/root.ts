import { createTRPCRouter } from "./trpc";
import { gptRouter } from "./routers/gpt";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  gpt: gptRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
