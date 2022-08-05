import { authedProcedure, t } from '../../trpc/utils';
import { createPostSchema } from './post.schema';
import { TRPCError } from '@trpc/server';

export const postRouter = t.router({
  create: authedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.create({
        data: {
          userId: ctx.session.user.id,
          text: input.text,
        },
      });

      if (!post) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
      }

      return {
        post,
      };
    }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
});
