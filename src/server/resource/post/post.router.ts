import { authedProcedure, t } from '../../trpc/utils';
import { createPostSchema, editPostSchema } from './post.schema';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

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
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 20;
      const { cursor } = input;
      const items = await ctx.prisma.post.findMany({
        where: {
          // if userId is provided, only return posts from that user
          ...(input.userId && { userId: input.userId }),
        },
        // get an extra item at the end which we'll use as next cursor
        take: limit + 1,
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: 'desc',
        },
      });

      let nextCursor: typeof cursor | null = null;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  getAll: t.procedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!posts) {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }

    return posts;
  }),
});
