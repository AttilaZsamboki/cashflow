import { router, publicProcedure } from "../trpc";

export const expenseRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.expenses.findMany();
    return result;
  }),
  getAllVallets: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.prisma.penztarcak.findMany();
    return result;
  }),
  getAllIncomeExpense: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.koltsegek.findMany();
  }),
});
