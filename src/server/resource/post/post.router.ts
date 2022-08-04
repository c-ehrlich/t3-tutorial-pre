import { authedProcedure, t } from '../../trpc/utils';
import { z } from 'zod';
import { createPostSchema } from './post.schema';
import { createPost } from './post.service';
import { TRPCError } from '@trpc/server';

export const postRouter = t.router({
  create: authedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const post = await createPost(ctx, input);
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
