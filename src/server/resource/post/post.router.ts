import { authedProcedure, t } from '../../trpc/utils';
import {
  createPostSchema,
  editPostSchema,
  likePostSchema,
} from './post.schema';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { getPostSearchOptions } from './post.service';
import { getNextCursor } from '../../../utils/db.util';

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
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return post;
    }),

  edit: authedProcedure
    .input(editPostSchema)
    .mutation(async ({ ctx, input }) => {
      // check that the user is allowed to edit the post
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
        select: {
          userId: true,
        },
      });

      if (post?.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      const updatedPost = await ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          text: input.text,
        },
      });

      if (!updatedPost) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return true;
    }),

  getPaginated: t.procedure
    .input(
      z.object({
        limit: z.number().min(1).nullish(),
        cursor: z.string().nullish(),
        userId: z.string().cuid().optional(),
        isFollowing: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const searchOptions = getPostSearchOptions(ctx, input);

      const followRelations = await ctx.prisma.user
        .findUniqueOrThrow({
          where: { id: ctx?.session?.user?.id },
        })
        .following();
      const usersFollowed = followRelations.map(
        (relation) => relation.followingId
      );

      const items = await ctx.prisma.post.findMany({
        where: {
          // posts from users we're following
          ...(input.isFollowing && {
            userId: {
              in: usersFollowed,
            },
          }),
          // if userId is provided, only return posts from that user
          ...(input.userId && { userId: input.userId }),
        },
        ...searchOptions,
      });

      const nextCursor = getNextCursor({ items, input });

      return {
        items,
        nextCursor,
      };
    }),

  paginatedSearch: t.procedure
    .input(
      z.object({
        limit: z.number().min(1).nullish(),
        cursor: z.string().nullish(),
        text: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const searchOptions = getPostSearchOptions(ctx, input);

      const items = await ctx.prisma.post.findMany({
        where: {
          text: {
            contains: input.text,
          },
        },
        ...searchOptions,
      });

      const nextCursor = getNextCursor({ items, input });

      return {
        items,
        nextCursor,
      };
    }),

  likePost: authedProcedure
    .input(likePostSchema)
    .mutation(async ({ ctx, input }) => {
      const likedPost = await ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          likedBy: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      if (!likedPost) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return true;
    }),

  unlikePost: authedProcedure
    .input(likePostSchema)
    .mutation(async ({ ctx, input }) => {
      const unlikedPost = await ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          likedBy: {
            disconnect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      if (!unlikedPost) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return true;
    }),
});
