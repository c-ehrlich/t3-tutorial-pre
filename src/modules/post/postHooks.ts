import { useSession } from 'next-auth/react';
import { INFINITE_QUERY_LIMIT } from '../../constants';
import { trpc } from '../../utils/trpc';
import { PostProps } from './Post';

export function useEditPost({ post, context }: PostProps) {
  const queryClient = trpc.useContext();
  const { data: session } = useSession();

  const editPostMutation = trpc.proxy.post.edit.useMutation({
    onMutate: (editedPost) => {
      const queryKeyRemainder = context === 'USER_PROFILE' &&
        session?.user?.id === post.userId && {
          userId: session.user.id,
        };

      const queryData = queryClient.getInfiniteQueryData([
        'post.getPaginated',
        {
          limit: INFINITE_QUERY_LIMIT,
          ...(queryKeyRemainder && queryKeyRemainder),
        },
      ]);

      if (queryData) {
        const optimisticUpdate: typeof queryData = {
          ...queryData,
          pages: queryData.pages.map((page) => ({
            ...page,
            items: page.items.map((item) => ({
              ...item,
              text: item.id === editedPost.id ? editedPost.text : item.text,
            })),
          })),
        };

        queryClient.setInfiniteQueryData(
          [
            'post.getPaginated',
            {
              limit: INFINITE_QUERY_LIMIT,
              ...(queryKeyRemainder && queryKeyRemainder),
            },
          ],
          optimisticUpdate
        );
      }
    },

    onError: (err) => {
      console.error(err);
    },

    onSettled: () => {
      queryClient.invalidateQueries(['post.getPaginated']);
    },
  });

  return editPostMutation;
}

export function useLikePost({ post, context }: PostProps) {
  const queryClient = trpc.useContext();
  const { data: session } = useSession();

  const likePostMutation = trpc.proxy.post.likePost.useMutation({
    onMutate: (likedPost) => {
      const queryKeyRemainder = context === 'USER_PROFILE' &&
        session?.user?.id === post.userId && {
          userId: session.user.id,
        };

      const queryData = queryClient.getInfiniteQueryData([
        'post.getPaginated',
        {
          limit: INFINITE_QUERY_LIMIT,
          ...(queryKeyRemainder && queryKeyRemainder),
        },
      ]);

      if (queryData) {
        const optimisticUpdate: typeof queryData = {
          ...queryData,
          pages: queryData.pages.map((page) => ({
            ...page,
            items: page.items.map((item) => ({
              ...item,
              likedBy:
                item.id === likedPost.id
                  ? [{ id: session?.user?.id ?? '' }]
                  : item.likedBy,
            })),
          })),
        };

        queryClient.setInfiniteQueryData(
          [
            'post.getPaginated',
            {
              limit: INFINITE_QUERY_LIMIT,
              ...(queryKeyRemainder && queryKeyRemainder),
            },
          ],
          optimisticUpdate
        );
      }
    },

    onError: (err) => {
      console.error(err);
    },

    onSettled: () => {
      queryClient.invalidateQueries(['post.getPaginated']);
    },
  });

  return likePostMutation;
}

export function useUnlikePost({ post, context }: PostProps) {
  const queryClient = trpc.useContext();
  const { data: session } = useSession();

  const unlikePostMutation = trpc.proxy.post.unlikePost.useMutation({
    onMutate: (unlikedPost) => {
      const queryKeyRemainder = context === 'USER_PROFILE' &&
        session?.user?.id === post.userId && {
          userId: session.user.id,
        };

      const queryData = queryClient.getInfiniteQueryData([
        'post.getPaginated',
        {
          limit: INFINITE_QUERY_LIMIT,
          ...(queryKeyRemainder && queryKeyRemainder),
        },
      ]);

      if (queryData) {
        const optimisticUpdate: typeof queryData = {
          ...queryData,
          pages: queryData.pages.map((page) => ({
            ...page,
            items: page.items.map((item) => ({
              ...item,
              likedBy: item.id === unlikedPost.id ? [] : item.likedBy,
            })),
          })),
        };

        queryClient.setInfiniteQueryData(
          [
            'post.getPaginated',
            {
              limit: INFINITE_QUERY_LIMIT,
              ...(queryKeyRemainder && queryKeyRemainder),
            },
          ],
          optimisticUpdate
        );
      }
    },

    onError: (err) => {
      console.error(err);
    },

    onSettled: () => {
      queryClient.invalidateQueries(['post.getPaginated']);
    },
  });

  return unlikePostMutation;
}
