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
  getCategoriesByType: publicProcedure
    .input(z.object({ type: z.string() }))
    .query(({ ctx, input }) => {
      const { type } = input;
      return ctx.prisma.kategoriak.findMany({
        where: { tipus: type },
      });
    }),
  getItemByType: publicProcedure
    .input(z.object({ type: z.string() }))
    .query(({ ctx, input }) => {
      const { type } = input;
      return ctx.prisma.elemek.findMany({
        where: { elem_tipus: type },
      });
    }),
  getConnectionsByType: publicProcedure
    .input(z.object({ type: z.string() }))
    .query(({ ctx, input }) => {
      const { type } = input;
      return ctx.prisma.elem_kapcsolatok.findMany({
        where: { tipus: type },
      });
    }),
  getTypeByType: publicProcedure
    .input(z.object({ type: z.string() }))
    .query(({ ctx, input }) => {
      const { type } = input;
      return ctx.prisma.tipusok.findMany({
        where: { tipus: type },
      });
    }),
  getPartnersByType: publicProcedure
    .input(z.object({ type: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.partnerek.findMany({
        where: { tipus: input.type },
      });
    }),
  createItem: publicProcedure
    .input(
      z.object({
        category: z.string(),
        name: z.string(),
        partner: z.string(),
        elem_tipus: z.string(),
        type: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { category, partner, elem_tipus, name, type } = input;
      const resp = await ctx.prisma.elemek.create({
        data: {
          name: name,
          elem_tipus: elem_tipus,
          kategoriakName: category,
          partnerName: partner,
          type: type,
        },
      });
      return resp;
    }),
  createCategory: publicProcedure
    .input(
      z.object({
        name: z.string(),
        tipus: z.string(),
        is_main: z.boolean(),
        parent_name: z.string(),
        is_active: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, tipus, is_main, parent_name, is_active } = input;
      return await ctx.prisma.kategoriak.create({
        data: {
          name: name,
          tipus: tipus,
          is_main: is_main,
          parent_name: parent_name,
          is_active: is_active,
        },
      });
    }),
  createConnection: publicProcedure
    .input(
      z.object({
        item: z.string(),
        sample: z.string(),
        itemType: z.string(),
        partner: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { item, partner, sample, itemType } }) => {
      return await ctx.prisma.elem_kapcsolatok.create({
        data: {
          minta: sample,
          partnerekName: partner,
          elemekName: item,
          tipus: itemType,
        },
      });
    }),
  createPartner: publicProcedure
    .input(z.object({ type: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input: { type, name } }) => {
      return await ctx.prisma.partnerek.create({
        data: {
          name: name,
          tipus: type,
        },
      });
    }),
  createType: publicProcedure
    .input(z.object({ type: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input: { type, name } }) => {
      return await ctx.prisma.tipusok.create({
        data: {
          name: name,
          tipus: type,
        },
      });
    }),
});
