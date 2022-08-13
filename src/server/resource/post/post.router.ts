import { authedProcedure, t } from '../../trpc/utils';
import {
  createPostSchema,
  editPostSchema,
  likePostSchema,
} from './post.schema';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  createPost,
  editPost,
  getPaginatedPosts,
  likeOrUnlikePost,
} from './post.service';
import { getNextCursor } from '../../../utils/db.util';

export const postRouter = t.router({
  create: authedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      const post = await createPost({ ctx, input });

      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return post;
    }),

  edit: authedProcedure
    .input(editPostSchema)
    .mutation(async ({ ctx, input }) => {
      const updatedPost = editPost({ ctx, input });

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
      const items = await getPaginatedPosts({ ctx, input });

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
      const items = await getPaginatedPosts({ ctx, input });

      const nextCursor = getNextCursor({ items, input });

      return {
        items,
        nextCursor,
      };
    }),

  likePost: authedProcedure
    .input(likePostSchema)
    .mutation(async ({ ctx, input }) => {
      const likedPost = await likeOrUnlikePost({ ctx, input, intent: 'like' });

      if (!likedPost) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return true;
    }),

  unlikePost: authedProcedure
    .input(likePostSchema)
    .mutation(async ({ ctx, input }) => {
      const unlikedPost = await likeOrUnlikePost({
        ctx,
        input,
        intent: 'unlike',
      });

      if (!unlikedPost) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      return true;
    }),
});
