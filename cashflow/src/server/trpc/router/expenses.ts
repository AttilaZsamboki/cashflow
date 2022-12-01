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
        id: z.string(),
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
        itemId: z.string(),
        sample: z.string(),
        itemType: z.string(),
        partner: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { itemId, partner, sample, itemType } }) => {
      return await ctx.prisma.elem_kapcsolatok.create({
        data: {
          minta: sample,
          partnerekName: partner,
          elemekId: itemId,
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
  deleteItem: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.elemek.delete({
        where: {
          id: id,
        },
      });
    }),
  deleteCategory: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.kategoriak.delete({
        where: {
          id: id,
        },
      });
    }),
  deleteConnection: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.elem_kapcsolatok.delete({
        where: {
          id: id,
        },
      });
    }),
  deleteType: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.tipusok.delete({
        where: {
          id: id,
        },
      });
    }),
  deletePartner: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.partnerek.delete({
        where: {
          id: id,
        },
      });
    }),
  // getCategoryDetails: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(async ({ ctx, input: { id } }) => {
  //     return await ctx.prisma.kategoriak.findUnique({
  //       where: {
  //         id: id,
  //       },
  //     });
  //   }),
  // getItemDetails: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(async ({ ctx, input: { id } }) => {
  //     return await ctx.prisma.elemek.findUnique({
  //       where: {
  //         id: id,
  //       },
  //     });
  //   }),
  // getTypeDetails: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(async ({ ctx, input: { id } }) => {
  //     return await ctx.prisma.tipusok.findUnique({
  //       where: {
  //         id: id,
  //       },
  //     });
  //   }),
  // getPartnerDetails: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(async ({ ctx, input: { id } }) => {
  //     return await ctx.prisma.partnerek.findUnique({
  //       where: {
  //         id: id,
  //       },
  //     });
  //   }),
  // getConnectionDetails: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(async ({ ctx, input: { id } }) => {
  //     return await ctx.prisma.elem_kapcsolatok.findUnique({
  //       where: {
  //         id: id,
  //       },
  //     });
  //   }),
  updateItem: publicProcedure
    .input(
      z.object({
        name: z.string(),
        type: z.string(),
        partnerName: z.string(),
        kategoriakName: z.string(),
        elem_tipus: z.string(),
        id: z.string(),
      })
    )
    .mutation(
      async ({
        ctx,
        input: { id, name, type, partnerName, kategoriakName, elem_tipus },
      }) => {
        return ctx.prisma.elemek.update({
          where: {
            id: id,
          },
          data: {
            name: name,
            id: id,
            type: type,
            partnerName: partnerName,
            kategoriakName: kategoriakName,
            elem_tipus: elem_tipus,
          },
        });
      }
    ),
  updateCategory: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        tipus: z.string(),
        is_main: z.boolean(),
        parent_name: z.string(),
        is_active: z.boolean(),
      })
    )
    .mutation(
      ({
        ctx,
        input: { id, name, tipus, is_main, parent_name, is_active },
      }) => {
        return ctx.prisma.kategoriak.update({
          where: {
            id: id,
          },
          data: {
            name: name,
            tipus: tipus,
            is_main: is_main,
            parent_name: parent_name,
            is_active: is_active,
            id: id,
          },
        });
      }
    ),
  updateConnection: publicProcedure
    .input(
      z.object({
        id: z.string(),
        minta: z.string(),
        partnerekName: z.string(),
        tipus: z.string(),
        elemekId: z.string(),
      })
    )
    .mutation(
      ({ ctx, input: { id, minta, partnerekName, tipus, elemekId } }) => {
        return ctx.prisma.elem_kapcsolatok.update({
          where: {
            id: id,
          },
          data: {
            id: id,
            minta: minta,
            partnerekName: partnerekName,
            tipus: tipus,
            elemekId: elemekId,
          },
        });
      }
    ),
  updatePartner: publicProcedure
    .input(z.object({ id: z.string(), name: z.string(), tipus: z.string() }))
    .mutation(({ ctx, input: { id, name, tipus } }) => {
      return ctx.prisma.partnerek.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          id: id,
          tipus: tipus,
        },
      });
    }),
  updateType: publicProcedure
    .input(z.object({ id: z.string(), name: z.string(), tipus: z.string() }))
    .mutation(({ ctx, input: { id, name, tipus } }) => {
      return ctx.prisma.tipusok.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          id: id,
          tipus: tipus,
        },
      });
    }),
});
