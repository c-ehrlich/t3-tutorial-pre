import { TRPCError } from '@trpc/server';
import { t } from '../../trpc/utils';
import { findUserSchema } from './user.schema';

export const userRouter = t.router({
  findOne: t.procedure.input(findUserSchema).query(async ({ input, ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: input.id,
      },
      select: {
        name: true,
        image: true,
        createdAt: true,
        id: true,
        // TODO use this for initial state, then use a query to stay up to date?
        posts: true,
      },
    });

    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return user;
  }),
});
