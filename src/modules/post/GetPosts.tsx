import { trpc } from '../../utils/trpc';
import PostList from './PostList';

interface GetPostsProps {
  userId?: string;
  isFollowing?: boolean;
}

function GetPosts(props: GetPostsProps) {
  const {
    data: posts,
    isLoading,
    isError,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = trpc.proxy.post.getPaginated.useInfiniteQuery(
    { limit: 2, ...(props.userId && { userId: props.userId }) },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  if (isError) return <div>{JSON.stringify(error)}</div>;

  if (isLoading) return <div>Loading Posts...</div>;

  if (posts) {
    const flattenedPosts = posts.pages.map((p) => p.items).flat();

    return (
      <>
        <PostList
          posts={flattenedPosts}
          context={
            props.userId
              ? 'USER_PROFILE'
              : props.isFollowing
              ? 'FOLLOWING'
              : 'PUBLIC_TIMELINE'
          }
        />

        <button
          className={`border border-black p-2 bg-slate-200 ${
            hasNextPage && !isFetchingNextPage && 'hover:bg-slate-400'
          }`}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
            ? 'Load More'
            : 'Nothing more to load'}
        </button>
      </>
    );
  }

  return <div>Unexpected outcome in PublicTimeline</div>;
}

export default GetPosts;
