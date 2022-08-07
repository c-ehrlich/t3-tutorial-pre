import { TRPCError } from '@trpc/server';
import { authedProcedure, t } from '../../trpc/utils';
import { findUserSchema, followUserSchema } from './user.schema';

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

        // put user id in followers[0] to check if user is following
        followers: {
          where: {
            followerId: ctx.session?.user?.id ? ctx.session.user.id : '',
          },
          select: {
            followerId: true,
          },
        },

        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    }

    return user;
  }),

  follow: authedProcedure
    .input(followUserSchema)
    .mutation(async ({ input, ctx }) => {
      // check if trying to follow self
      if (input.id === ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot follow yourself',
        });
      }

      const follow = await ctx.prisma.userFollows.upsert({
        where: {
          followerId_followingId: {
            followerId: ctx.session.user.id,
            followingId: input.id,
          },
        },
        create: {
          followerId: ctx.session.user.id,
          followingId: input.id,
        },
        update: {
          followerId: ctx.session.user.id,
          followingId: input.id,
        },
      });

      if (!follow) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to follow user',
        });
      }

      return true;
    }),

  unfollow: authedProcedure
    .input(followUserSchema)
    .mutation(async ({ input, ctx }) => {
      // check if trying to unfollow self
      if (input.id === ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Cannot follow yourself',
        });
      }

      const unfollow = await ctx.prisma.userFollows.delete({
        where: {
          followerId_followingId: {
            followerId: ctx.session.user.id,
            followingId: input.id,
          },
        },
      });

      if (!unfollow) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to unfollow user',
        });
      }

      return true;
    }),
});
