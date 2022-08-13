import type { Context } from '../../../server/trpc/context';

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
