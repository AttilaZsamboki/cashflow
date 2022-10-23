// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { expenseRouter } from "./expenses";

export const appRouter = router({
  auth: authRouter,
  expenses: expenseRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
