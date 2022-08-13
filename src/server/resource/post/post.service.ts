import { TRPCError } from '@trpc/server';
import type { Context } from '../../../server/trpc/context';
import { CreatePostInput, EditPostInput } from './post.schema';

export function createPost({
  ctx,
  input,
}: {
  ctx: Context;
  input: CreatePostInput;
}) {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return ctx.prisma.post.create({
    data: {
      userId: ctx.session.user.id,
      text: input.text,
    },
  });
}

export async function editPost({
  ctx,
  input,
}: {
  ctx: Context;
  input: EditPostInput;
}) {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

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

  return ctx.prisma.post.update({
    where: {
      id: input.id,
    },
    data: {
      text: input.text,
    },
  });
}

type GetPaginatedPostsInput = {
  cursor?: string | null | undefined;
  limit?: number | null | undefined;
  userId?: string | undefined;
  isFollowing?: boolean | undefined;
};

export function getPaginatedPosts({
  ctx,
  input,
}: {
  ctx: Context;
  input: GetPaginatedPostsInput;
}) {
  const limit = input.limit ?? 20;
  const { cursor } = input;

  return ctx.prisma.post.findMany({
    where: {
      // posts from users we're following
      ...(input.isFollowing && {
        userId: {
          // in: usersFollowed,
        },
      }),
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
      likedBy: {
        where: {
          id: ctx?.session?.user?.id ? ctx.session.user.id : '',
        },
        select: {
          id: true,
        },
      },
    },
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export function getPostSearchOptions(
  ctx: Context,
  input: GetPaginatedPostsInput
) {
  return {
    take: (input.limit ?? 20) + 1,
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      likedBy: {
        where: {
          id: ctx?.session?.user?.id ? ctx.session.user.id : '',
        },
        select: {
          id: true,
        },
      },
    },
    cursor: input.cursor ? { id: input.cursor } : undefined,
    orderBy: {
      createdAt: 'desc' as 'asc' | 'desc',
    },
  };
}
