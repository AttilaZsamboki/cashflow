import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const expenseRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    const result = ctx.prisma.expenses.findMany();
    return result;
  }),
  getAllVallets: publicProcedure.query(({ ctx }) => {
    const result = ctx.prisma.penztarcak.findMany();
    return result;
  }),
  getAllIncomeExpense: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.tetelek.findMany();
  }),
  getCashflowSummary: publicProcedure.query(({ ctx }) => {
    const result = ctx.prisma.zsambi_cashflow.findMany();
    return result;
  }),
  getCashflowPlanner: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.cashflow_planner_table.findMany();
  }),
  updateCashflowPlanner: publicProcedure
    .input(z.object({ field: z.string(), id: z.string(), value: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { field, id, value } = input;
      const plannedCash = await ctx.prisma.cashflow_planner_table.update({
        where: { name_day: { name: id, day: field } },
        data: {
          planned_expense: value,
        },
      });
      return plannedCash;
    }),
});
